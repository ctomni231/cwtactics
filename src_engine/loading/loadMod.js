var MOD_KEY = "modification_data";

var MOD_FILES = [
  "header",
  "co",
  "fraction",
  "gamemode",
  "maps",
  "movetypes",
  "globalrules",
  "sounds",
  "menu",
  "tiles",
  "units",
  "weathers",
  "assets",
  "graphics",
  "tips",
  "language"
];

cwt.loading_modification = function (when_done, error_receiver) {
  var queue, modification;

  cwt.log_info("grabbing modification data file");

  queue = [];

  queue.push(function (when_mod_files_are_grabbed) {
    controller.storage_general.get(MOD_KEY, function (obj) {
      var has_modification = !cwt.type_is_nothing(obj);
      modification = has_modification ? obj.value : {};

      if (has_modification) {
        when_mod_files_are_grabbed();
        return;
      }

      cwt.log_warn("no modification exists - grabbing fresh one from repository");

      cwt.queue_async_execute_list(MOD_FILES, function (file, when_mod_file_is_loaded) {
        util.grabRemoteFile({
          path: MOD_PATH + file + ".json",
          json: true,

          error: function (msg) {
            error_receiver(msg);
          },

          success: function (resp) {
            modification[file] = resp;
            when_mod_file_is_loaded();
          }
        });

      }, function () {
        controller.storage_general.set(MOD_KEY, modification, function () {
          when_mod_files_are_grabbed();
        });
      });
    })
  });

  queue.push(function (when_mod_is_loaded) {
    model.modification_load(modification);
    when_mod_is_loaded();
  });

  cwt.queue_async_execute_joblist(queue, when_done);
};
