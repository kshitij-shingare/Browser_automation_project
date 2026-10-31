// Specialized Unit Handlers for Video, Quiz, PDF, SCORM, and Navigation
// Developed by Kshitij Shingare

const { sleep } = require('./cdp-client');
const { getAnswerForQuestion } = require('./quiz-solver');

async function clickNextUnit(cdp, config) {
  const res = await cdp.evaluate(`(() => {
    let actions = [];
    const f = document.getElementById('playerFrame');
    if (f) {
      try {
        const doc = f.contentDocument || f.contentWindow.document;
        const nextBtn = Array.from(doc.querySelectorAll('button, a, div')).find(el => {
          const t = el.innerText?.trim()?.toUpperCase();
          return t === 'NEXT' || t === 'CONTINUE';
        });
        if (nextBtn) {
          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
            nextBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
          });
          nextBtn.click();
          actions.push('iframe NEXT');
        }
      } catch (e) {}
    }

    const topNext = document.querySelector('.default-course-player-nav-btn.next, .nav-btn.next');
    if (topNext) {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
        topNext.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
      });
      topNext.click();
      actions.push('top navigation NEXT');
    }

    // Direct sidebar next link sequence fallback
    try {
      const links = Array.from(document.querySelectorAll('.lrn-path-cont-link'));
      const currentUnitId = new URLSearchParams(window.location.search).get('unit');
      let curIdx = links.findIndex(l => (l.href && l.href.includes(currentUnitId)) || (l.getAttribute('data-unit-id') === currentUnitId));
      if (curIdx === -1) {
        const headerTitle = document.querySelector('h1, h2, .course-player-title, .learning-unit-title')?.innerText?.trim() || '';
        curIdx = links.findIndex(l => headerTitle && l.innerText.includes(headerTitle));
      }
      if (curIdx >= 0 && links[curIdx + 1]) {
        const nextLink = links[curIdx + 1];
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
          nextLink.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
        });
        nextLink.click();
        actions.push('sidebar next: ' + nextLink.innerText.trim().split('\\n')[0]);
      }
    } catch(e) {}

    return actions.length > 0 ? actions.join(' + ') : 'None';
  })()`);

  console.log(`[NAVIGATION] Clicked: ${res}`);

  // Native hardware CDP click at topNext coordinates
  if (config.navigation.topNextCoordinates) {
    const { x, y } = config.navigation.topNextCoordinates;
    await cdp.clickAt(x, y);
  }

  await sleep(config.navigation.waitAfterNextMs || 5000);
}

async function handleVideo(cdp, unitTitle, config) {
  console.log(`[UNIT: VIDEO] Starting natural video playback: "${unitTitle}"`);

  // Unmute and dismiss initial sound overlays
  await cdp.evaluate(`(() => {
    const f = document.getElementById('playerFrame');
    if (f) {
      try {
        const doc = f.contentDocument || f.contentWindow.document;
        const soundBtn = doc.querySelector('.click-for-sound-btn');
        if (soundBtn) soundBtn.click();
        const v = doc.querySelector('video');
        if (v) {
          v.muted = true;
          v.play().catch(() => {});
        }
        const w = f.contentWindow.Wistia && f.contentWindow.Wistia.api ? f.contentWindow.Wistia.api.all()[0] : null;
        if (w) {
          w.unmute();
          w.play();
        }
      } catch (e) {}
    }
  })()`);

  // Set native 2x playback speed if supported by player UI
  if (config.playback.speedMultiplier === 2.0) {
    await cdp.evaluate(`(() => {
      const f = document.getElementById('playerFrame');
      if (f) {
        try {
          const doc = f.contentDocument || f.contentWindow.document;
          const el2x = Array.from(doc.querySelectorAll('.menu-radio-item, span, div')).find(el => el.innerText?.trim() === 'x 2');
          if (el2x) el2x.click();
        } catch (e) {}
      }
    })()`);
  }

  // Ensure sound overlay is dismissed and natural playback starts
  await cdp.clickVideoCenter();

  let lastTime = -1;
  let stuckCount = 0;

  while (true) {
    const status = await cdp.evaluate(`(() => {
      const f = document.getElementById('playerFrame');
      if (!f) return { hasVideo: false };
      let doc;
      try { doc = f.contentDocument || f.contentWindow.document; } catch (e) { return { hasVideo: false }; }
      const v = doc.querySelector('video');
      if (!v) return { hasVideo: false };

      const win = f.contentWindow;
      const w = win.Wistia && win.Wistia.api ? win.Wistia.api.all()[0] : null;

      if (v.paused && !v.ended && v.currentTime < v.duration) {
        v.play().catch(() => {});
        if (w) w.play();
      }

      const isEnded = v.ended || (v.duration > 0 && v.currentTime >= v.duration - 0.8);
      return {
        hasVideo: true,
        paused: v.paused,
        currentTime: v.currentTime,
        duration: v.duration,
        isEnded: isEnded
      };
    })()`);

    if (!status || !status.hasVideo) {
      console.log('[VIDEO] No video element found or video completed.');
      break;
    }

    const cur = (status.currentTime != null && !isNaN(status.currentTime)) ? status.currentTime.toFixed(1) : '0.0';
    const dur = (status.duration != null && !isNaN(status.duration)) ? status.duration.toFixed(1) : '0.0';
    console.log(`[VIDEO PLAYING] ${cur}s / ${dur}s (Ended: ${status.isEnded})`);

    if (status.isEnded) {
      console.log(`[VIDEO COMPLETED] "${unitTitle}" completed naturally!`);
      break;
    }

    // Auto-pause recovery: detect pauses and buffer stalls
    if (status.currentTime != null && lastTime != null && Math.abs(status.currentTime - lastTime) < 0.2) {
      stuckCount++;
      if (stuckCount >= config.playback.maxStuckChecks) {
        console.log('[VIDEO] Video paused or buffering. Attempting native click & resume...');
        await cdp.clickVideoCenter();
        await cdp.evaluate(`(() => {
          const f = document.getElementById('playerFrame');
          const doc = f ? (f.contentDocument || f.contentWindow.document) : null;
          const v = doc ? doc.querySelector('video') : null;
          if (v) { v.muted = true; v.play().catch(() => {}); }
        })()`);
        stuckCount = 0;
      }
    } else {
      stuckCount = 0;
    }
    lastTime = status.currentTime;

    await sleep(config.playback.pollIntervalMs || 15000);
  }

  await sleep(3000);
  await clickNextUnit(cdp, config);
}

async function handleQuiz(cdp, config) {
  console.log('[UNIT: QUIZ] Detected Assessment unit. Handling questions...');

  // Click "READY TO START" if present
  await cdp.evaluate(`(() => {
    const f = document.getElementById('playerFrame');
    const doc = f ? (f.contentDocument || f.contentWindow.document) : document;
    const startBtn = Array.from(doc.querySelectorAll('button')).find(el => el.innerText && el.innerText.toUpperCase().includes('READY TO START')) ||
                     Array.from(doc.querySelectorAll('a, [role="button"], div')).find(el => el.innerText && el.innerText.trim().toUpperCase() === 'READY TO START');
    if (startBtn) {
      startBtn.click();
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
        startBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
      });
    }
  })()`);

  await sleep(4000);

  // Loop through questions until SUBMIT or review screen
  for (let qNum = 1; qNum <= 50; qNum++) {
    let qState = null;
    for (let retry = 0; retry < 5; retry++) {
      qState = await cdp.evaluate(`(() => {
        const f = document.getElementById('playerFrame');
        const doc = f ? (f.contentDocument || f.contentWindow.document) : document;
        
        const isReview = doc.body.innerText.includes('Feedback') || doc.body.innerText.includes('Correct answers:') || doc.body.innerText.includes('RETAKE');
        if (isReview) return { isReview: true };

        const questionText = doc.querySelector('.question-title, .quiz-question, h3, h4, .text-bold, .lw-ass-question-title')?.innerText?.trim() ||
                             doc.body.innerText.split('\\n').find(l => l.includes('?') || l.includes('Which') || l.includes('What') || l.includes('How') || l.includes('Select')) || '';

        const labels = Array.from(doc.querySelectorAll('label, .learnworlds-radio-label, .learnworlds-checkbox-label, .option, [role="radio"], [role="checkbox"]')).map((el, i) => ({
          index: i,
          text: el.innerText.trim(),
          isCheckbox: !!el.querySelector('input[type="checkbox"]') || el.getAttribute('role') === 'checkbox'
        })).filter(l => l.text.length > 0 && l.text.length < 250);

        const hasSubmit = Array.from(doc.querySelectorAll('button, a, div')).some(el => el.innerText?.trim()?.toUpperCase() === 'SUBMIT');

        return {
          isReview: false,
          questionText,
          labels,
          hasSubmit
        };
      })()`);

      if (qState && (qState.isReview || (qState.labels && qState.labels.length > 0))) {
        break;
      }
      await sleep(2000);
    }

    if (!qState || qState.isReview) {
      console.log('[UNIT: QUIZ] Reached review or completion screen.');
      break;
    }

    if (!qState.labels || qState.labels.length === 0) {
      console.log('[UNIT: QUIZ] No options found on screen after wait, breaking loop.');
      break;
    }

    console.log(`[QUIZ Q${qNum}] ${qState.questionText}`);
    const chosenOptions = getAnswerForQuestion(qState.questionText, qState.labels);

    // Select chosen options in page natively
    for (const opt of chosenOptions) {
      console.log(`[QUIZ Q${qNum}] Selecting: "${opt.text}"`);
      await cdp.evaluate(`(() => {
        const f = document.getElementById('playerFrame');
        const doc = f ? (f.contentDocument || f.contentWindow.document) : document;
        const labels = Array.from(doc.querySelectorAll('label, .learnworlds-radio-label, .learnworlds-checkbox-label, .option, [role="radio"], [role="checkbox"]'));
        const target = labels.find(l => l.innerText && l.innerText.trim() === ${JSON.stringify(opt.text)});
        if (target) {
          target.click();
          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
            target.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
          });
          const input = target.querySelector('input') || (target.parentElement ? target.parentElement.querySelector('input') : null);
          if (input) {
            input.checked = true;
            input.click();
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      })()`);
      await sleep(config.assessments.answerDelayMs || 500);
    }

    await sleep(1000);

    if (qState.hasSubmit) {
      console.log('[QUIZ] Submitting final answers...');
      await cdp.evaluate(`(() => {
        const f = document.getElementById('playerFrame');
        const doc = f ? (f.contentDocument || f.contentWindow.document) : document;
        const submitBtn = Array.from(doc.querySelectorAll('button')).find(el => el.innerText && el.innerText.trim().toUpperCase() === 'SUBMIT') ||
                         Array.from(doc.querySelectorAll('a, [role="button"], div')).find(el => el.innerText && el.innerText.trim().toUpperCase() === 'SUBMIT');
        if (submitBtn) {
          submitBtn.click();
          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
            submitBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
          });
        }
      })()`);
      await sleep(2000);

      // Confirm modal dialog (iziToast "Yes" button)
      if (config.assessments.autoConfirmModals) {
        await cdp.evaluate(`(() => {
          const f = document.getElementById('playerFrame');
          const doc = f ? (f.contentDocument || f.contentWindow.document) : document;
          const yesBtn = Array.from(doc.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim().toUpperCase() === 'YES') ||
                         Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim().toUpperCase() === 'YES');
          if (yesBtn) {
            yesBtn.click();
            ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
              yesBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
            });
          }
        })()`);
      }
      await sleep(4000);
      break;
    } else {
      // Click next question button
      await cdp.evaluate(`(() => {
        const f = document.getElementById('playerFrame');
        const doc = f ? (f.contentDocument || f.contentWindow.document) : document;
        const btns = Array.from(doc.querySelectorAll('button.learnworlds-button.square, button.square'));
        const nextBtn = btns.sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left)[0];
        if (nextBtn) {
          nextBtn.click();
          ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evt => {
            nextBtn.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }));
          });
        }
      })()`);
      await sleep(2500);
    }
  }

  await sleep(3000);
  console.log('[QUIZ] Advancing after quiz completion...');
  await clickNextUnit(cdp, config);
}

async function handlePdf(cdp, config) {
  console.log('[UNIT: PDF] Scrolling Study Notes PDF to bottom...');
  await cdp.evaluate(`(() => {
    const f = document.getElementById('playerFrame');
    if (f) {
      try {
        const doc = f.contentDocument || f.contentWindow.document;
        const viewer = doc.getElementById('viewerContainer') || doc.body;
        viewer.scrollTop = viewer.scrollHeight;
      } catch (e) {}
    }
  })()`);
  await sleep(3000);
  await clickNextUnit(cdp, config);
}

async function handleScorm(cdp, config) {
  console.log('[UNIT: SCORM] Handling SCORM/Interactive Quest unit...');
  await cdp.evaluate(`(() => {
    try {
      const f = document.getElementById('playerFrame');
      const win = f ? f.contentWindow : window;
      if (win.SCORM2004_SetValue) {
        win.SCORM2004_SetValue("cmi.completion_status", "completed");
        win.SCORM2004_SetValue("cmi.success_status", "passed");
        win.SCORM2004_Commit("");
      }
      if (win.LMSSetValue) {
        win.LMSSetValue("cmi.core.lesson_status", "completed");
        win.LMSCommit("");
      }
    } catch (e) {}
  })()`);
  await sleep(3000);
  await clickNextUnit(cdp, config);
}

module.exports = {
  clickNextUnit,
  handleVideo,
  handleQuiz,
  handlePdf,
  handleScorm
};
