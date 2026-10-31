// Configuration file for DADB Academy Course Automator
// Developed by Kshitij Shingare

module.exports = {
  // Chrome DevTools Protocol configuration
  cdp: {
    port: 9222,
    host: '127.0.0.1',
    targetPattern: 'academy.dadb.com'
  },

  // Playback options (100% natural compliance)
  playback: {
    // Speed multiplier within natural player parameters (1.0, 1.25, 1.5, 2.0)
    speedMultiplier: 2.0,
    // Status polling interval in milliseconds
    pollIntervalMs: 15000,
    // Maximum stuck counter before triggering pause recovery
    maxStuckChecks: 2,
    // Replay naturally if prerequisite lock requires full watch
    replayOnPrereqLock: true
  },

  // Quiz & Assessment options
  assessments: {
    autoSolve: true,
    autoSubmit: true,
    // Automatically confirm iziToast / modal submission confirmation
    autoConfirmModals: true,
    // Delay between selecting answers in ms
    answerDelayMs: 600
  },

  // Navigation options
  navigation: {
    waitAfterNextMs: 5000,
    maxSameUnitRetries: 4,
    // Top next button coordinate for native hardware CDP mouse click
    topNextCoordinates: { x: 1759, y: 22 }
  }
};
