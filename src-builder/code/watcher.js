const fs = require('fs');

exports.produceFileWatcher = function(path, handler, preventMultipleCalls) {
  var blockedUntil = Date.now();
  var handlerCalled = false;
  fs.watch(path, {
    recursive: true
  }, function(event, filename) {
    if (Date.now() > blockedUntil || (preventMultipleCalls && handlerCalled)) {
      blockedUntil = Date.now() + 2000;
      handlerCalled = true;
      handler();
      handlerCalled = false;
    }
  });
};