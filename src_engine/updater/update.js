var updates = [];

var Update = function (version, updaterCallback) {
  this.version         = cwt.requireString(version);
  this.updaterCallback = cwt.requireFunction(updaterCallback);
};

cwt.addUpdate = function (version, updaterCallback) {
  updates.push(new Update(version, updaterCallback));
};

cwt.evaluateNecessaryUpdates = function (whenDone) {
  var i, update;

  cwt.requireFunction(whenDone);

  for (i = 0; i < updates.length; i++) {
    update = updates[i];

    // TODO support asynchron updates
    update.updaterCallback();
  }

  whenDone();
};
