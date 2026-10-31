// Chrome DevTools Protocol (CDP) WebSocket Client
// Developed by Kshitij Shingare
// Uses built-in Node.js v18+ WebSocket and fetch (zero external dependencies required)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 1;
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      const handler = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            this.ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        } catch (e) {
          // Ignore non-matching or malformed payloads
        }
      };
      this.ws.addEventListener('message', handler);
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    try {
      const res = await this.send('Runtime.evaluate', {
        expression,
        returnByValue: true
      });
      return res.result ? res.result.value : null;
    } catch (err) {
      return null;
    }
  }

  async clickAt(x, y) {
    try {
      await this.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x,
        y,
        button: 'left',
        clickCount: 1
      });
      await sleep(80);
      await this.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x,
        y,
        button: 'left',
        clickCount: 1
      });
    } catch (e) {}
  }

  async clickVideoCenter() {
    try {
      const pos = await this.evaluate(`(() => {
        const f = document.getElementById('playerFrame');
        if (!f) return null;
        const rect = f.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()`);
      if (pos && pos.x && pos.y) {
        await this.clickAt(pos.x, pos.y);
      }
    } catch (e) {}
  }

  close() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
    }
  }
}

async function findCourseTarget(config) {
  const url = `http://${config.cdp.host}:${config.cdp.port}/json/list`;
  try {
    const res = await fetch(url);
    const pages = await res.json();
    // Prioritize active path-player course player tab
    const playerPage = pages.find(p => p.url && p.url.includes('path-player'));
    if (playerPage) return playerPage;

    const page = pages.find(p => p.url && p.url.includes(config.cdp.targetPattern));
    if (!page) {
      throw new Error(`Target tab matching "${config.cdp.targetPattern}" not found in Chrome! Please ensure course is open.`);
    }
    return page;
  } catch (err) {
    throw new Error(`Cannot connect to Chrome on port ${config.cdp.port}. Make sure Chrome is started with --remote-debugging-port=${config.cdp.port}. Details: ${err.message}`);
  }
}

module.exports = {
  CDPClient,
  findCourseTarget,
  sleep
};
