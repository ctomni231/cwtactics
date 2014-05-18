var builder = require("./buildLibrary.js");

var PATH = " " + builder.dirJsToString("libJs") + " " +
  builder.dirJsToString("gameSrc/base") + " " +
  builder.dirJsToString("gameSrc/classes") + " " +
  builder.dirJsToString("gameSrc/controller") + " " +
  builder.dirJsToString("gameSrc/input") + " " +
  builder.dirJsToString("gameSrc/model") + " " +
  builder.dirJsToString("gameSrc/logic") + " " +
  builder.dirJsToString("gameSrc/sheets") + " " +
  builder.dirJsToString("gameSrc/data") + " " +
  builder.dirJsToString("gameSrc/flow") + " " +
  builder.dirJsToString("gameSrc/renderer") + " " +
  builder.dirJsToString("gameSrc/commands") + " " +
  builder.dirJsToString("gameSrc/test") + " " +
  builder.dirJsToString("gameSrc/ai") + " ";

exports.doIt = function (p, baton) {
  baton.take();
  var flow = require("./workflow.js").order(function () {
    console.log("building engine -> start");
  })

    // BUILD MINIFIED DEV VERSION
    .andThen(function (p, b) {
      console.log("building dev version");

      b.take();
      builder.doCommand(
        builder.UGLIFY_CMD
          .replace(/\$DEFINE\$/g, "")
          .replace(/\$COMPRESS\$/g, "-b")
          .replace(/\$SOURCE_DIR\$/g, "gameConst/dev.js " + PATH)
          .replace(/\$TARGET_NAME\$/g, "game_dev/game")
          .replace(/\$TARGET_SOURCE_NAME\$/, "game")
        , function () {
          b.pass();
        }
      );
    })

    // BUILD MINIFIED LIVE VERSION
    .andThen(function (p, b) {
      console.log("building live version");

      b.take();
      builder.doCommand(
        builder.UGLIFY_CMD.replace(/\$DEFINE\$/g,
            builder.wipeOutSpecial(
              builder.readAndConcatFiles(["gameConst/live.js"], false)
            )
          )
          .replace(/\$SOURCE_DIR\$/g, PATH)
          .replace(/\$COMPRESS\$/g, "-c -m")
          .replace(/\$TARGET_NAME\$/g, "game/game")
          .replace(/\$TARGET_SOURCE_NAME\$/, "game")
        , function () {
          b.pass();
        }
      );
    })

    .start(function () {
      console.log("building engine -> complete");
      baton.pass();
    });
};
