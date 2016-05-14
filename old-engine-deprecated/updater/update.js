var updates = [];

cwt.update_add = function (version, name, updaterCallback) {
  updates.push({
    version: cwt.require_string(version),
    name: cwt.require_string(name),
    callback: cwt.require_function(updaterCallback)
  });
};

/**
 * checks for necessary updates, calls them and pushes the version.
 *
 * @param {function}   whenDone called when process is done
 */
cwt.update_evaluate_all = function (whenDone) {
  cwt.require_function(whenDone);

  cwt.log_info("checking for updates");

  cwt.queue_async_execute_list(updates, function (update, when_done) {
    cwt.log_info("evaluating update " + update.name + " for version " + update.version);
    update.callback(when_done);

  }, whenDone);
};
