var updates = [];

cwt.update_add = function (version, name, updaterCallback) {
  updates.push({
    version: cwt.requireString(version),
    name: cwt.requireString(name),
    callback: cwt.requireFunction(updaterCallback)
  });
};

/**
 * checks for necessary updates, calls them and pushes the version.
 *
 * @param {cwt.Logger} logger   logger
 * @param {function}   whenDone called when process is done
 */
cwt.update_evaluate_all = function (logger, whenDone) {
  cwt.requireNonNull(logger);
  cwt.requireFunction(whenDone);

  logger.info("checking for updates");

  cwt.queue_async_execute_list(updates, function (update, when_done) {
    logger.info("evaluating update " + update.name + " for version " + update.version);
    update.callback(when_done);

  }, whenDone);
};
