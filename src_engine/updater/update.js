/*global cwt*/

cwt.gameUpdater = {};

cwt.gameUpdater.init = function (logger) {
  cwt.requireNothing(this.updates);

  this.logger = cwt.requireNonNull(logger);
  this.updates = [];
};

cwt.gameUpdater.addUpdate = function (version, updaterCallback) {
  this.updates.push({
    version: cwt.requireString(version),
    callback: cwt.requireFunction(updaterCallback)
  });
};

cwt.gameUpdater.evaluateNecessaryUpdates = function (whenDone) {
  var i, update;

  cwt.requireFunction(whenDone);

  for (i = 0; i < this.updates.length; i++) {
    update = this.updates[i];

    // TODO support asynchron updates
    update.callback();
  }

  whenDone();
};
