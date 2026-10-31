// Master Autonomous Execution Engine for DADB Course
// Developed by Kshitij Shingare

const config = require('./config');
const { CDPClient, findCourseTarget, sleep } = require('./cdp-client');
const { handleVideo, handleQuiz, handlePdf, handleScorm, clickNextUnit } = require('./unit-handlers');

async function runEngine() {
  console.log('=====================================================');
  console.log('   DADB ACADEMY COURSE AUTOMATION ENGINE');
  console.log('   Author: Kshitij Shingare');
  console.log('   Target: academy.dadb.com (LearnWorlds Platform)');
  console.log('=====================================================');

  console.log(`[INIT] Connecting to Chrome on ${config.cdp.host}:${config.cdp.port}...`);
  const target = await findCourseTarget(config);
  console.log(`[INIT] Found course tab: "${target.title}"`);
  console.log(`[INIT] URL: ${target.url}`);

  const cdp = new CDPClient(target.webSocketDebuggerUrl);
  await cdp.connect();
  console.log('[INIT] Connected via Chrome DevTools Protocol successfully.');

  let consecutiveSameUnitCount = 0;
  let lastUnitTitle = '';

  while (true) {
    const state = await cdp.evaluate(`(() => {
      const progress = document.querySelector('.path-percent, .progress-bar-text, .course-progress')?.innerText?.trim() ||
                       Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.match(/^\\d+\\s*%$/))?.innerText?.trim() || '';

      const title = document.title;
      const f = document.getElementById('playerFrame');
      let docTitle = '';
      let hasVideo = false;
      let isQuiz = false;
      let isPdf = false;
      let isScorm = false;

      if (f) {
        try {
          const doc = f.contentDocument || f.contentWindow.document;
          docTitle = doc.title;
          hasVideo = !!doc.querySelector('video');
          isQuiz = doc.body.innerText.includes('Self-assessment') || doc.body.innerText.includes('READY TO START') || doc.body.innerText.includes('question 1') || doc.body.innerText.includes('Feedback');
          isPdf = doc.body.innerText.includes('Zoom In') || doc.body.innerText.includes('Automatic Zoom') || !!doc.getElementById('viewerContainer');
          isScorm = docTitle.includes('Scorm') || !!doc.getElementById('scorm-server') || window.location.href.includes('scorm');
        } catch (e) {}
      }

      const hasPrereq = !!document.querySelector('.prerequisite-bubble');

      return {
        url: window.location.href,
        title,
        docTitle,
        progress,
        hasVideo,
        isQuiz,
        isPdf,
        isScorm,
        hasPrereq
      };
    })()`);

    if (!state) {
      console.log('[ENGINE] Unable to read state. Retrying in 5 seconds...');
      await sleep(5000);
      continue;
    }

    console.log(`\n-----------------------------------------------------`);
    console.log(`[CURRENT UNIT] ${state.title} | Progress: ${state.progress || 'In Progress'}`);
    console.log(`[TYPE] Video: ${state.hasVideo}, Quiz: ${state.isQuiz}, PDF: ${state.isPdf}, SCORM: ${state.isScorm}, PrereqLock: ${state.hasPrereq}`);
    console.log(`-----------------------------------------------------`);

    // If on a non-course page (e.g. login or home screen), guide the user
    if (!state.hasVideo && !state.isQuiz && !state.isPdf && !state.isScorm && !state.url.includes('path-player')) {
      console.log(`\n[WAITING FOR COURSE] Current tab is not inside the course player.`);
      console.log(`[ACTION REQUIRED] Please log into your DADB Academy account in Chrome and open your course!`);
      console.log(`[SCANNING] Waiting for course player to be opened...\n`);

      try {
        const checkTarget = await findCourseTarget(config);
        if (checkTarget && checkTarget.webSocketDebuggerUrl !== cdp.wsUrl && checkTarget.url.includes('path-player')) {
          console.log(`[DETECTED] Found course player tab: "${checkTarget.title}" (${checkTarget.url})`);
          cdp.close();
          cdp.wsUrl = checkTarget.webSocketDebuggerUrl;
          await cdp.connect();
          console.log('[RECONNECTED] Attached to course player successfully.\n');
        }
      } catch (e) {}

      await sleep(5000);
      continue;
    }

    if (state.progress === '100 %') {
      console.log('\n=====================================================');
      console.log('   🎉 CONGRATULATIONS! COURSE IS 100% COMPLETE! 🎉');
      console.log('=====================================================');
      break;
    }

    // Check if stuck on the same unit
    if (state.title === lastUnitTitle) {
      consecutiveSameUnitCount++;
      if (consecutiveSameUnitCount >= config.navigation.maxSameUnitRetries) {
        console.log('[WARNING] Unit re-encountered. Evaluating prerequisite lock / replay...');
        if (state.hasPrereq && config.playback.replayOnPrereqLock) {
          console.log('[PREREQ LOCK] Triggering natural replay to fulfill course watch requirement...');
          await cdp.evaluate(`(() => {
            const f = document.getElementById('playerFrame');
            if (f) {
              const doc = f.contentDocument || f.contentWindow.document;
              const replayBtn = doc.querySelector('.replay-btn, button.replay-btn');
              if (replayBtn) replayBtn.click();
            }
          })()`);
        } else {
          await clickNextUnit(cdp, config);
        }
        consecutiveSameUnitCount = 0;
        await sleep(5000);
        continue;
      }
    } else {
      consecutiveSameUnitCount = 0;
      lastUnitTitle = state.title;
    }

    // Handle unit by type
    if (state.isQuiz || state.title.toLowerCase().includes('learning control') || state.title.toLowerCase().includes('final exam') || state.title.toLowerCase().includes('assessment')) {
      await handleQuiz(cdp, config);
    } else if (state.isPdf || state.title.toLowerCase().includes('study note')) {
      await handlePdf(cdp, config);
    } else if (state.isScorm || state.title.toLowerCase().includes('quest')) {
      await handleScorm(cdp, config);
    } else if (state.hasVideo) {
      await handleVideo(cdp, state.title, config);
    } else {
      console.log('[UNIT: OTHER] General content unit, scrolling and advancing...');
      await sleep(3000);
      await clickNextUnit(cdp, config);
    }

    await sleep(4000);
  }

  cdp.close();
}

if (require.main === module) {
  runEngine().catch(err => {
    console.error('\n[FATAL ERROR]', err.message);
    process.exit(1);
  });
}

module.exports = { runEngine };
