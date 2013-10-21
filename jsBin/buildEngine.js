var builder = require( "./buildLibrary.js" );

var PATH =  "srcEngine/libs/*.js "+
			"srcEngine/core/*.js "+
			"srcEngine/util/*.js "+
			"srcEngine/controller/*.js "+
			"srcEngine/model/*.js "+
			"srcEngine/commands/*.js "+
			"srcEngine/ai/*.js ";

builder.doCommand(
  builder.UGLIFY_CMD.replace(/\$DEFINE\$/g,
              builder.wipeOutSpecial( builder.readAndConcatFiles(["gameConst/all.js","gameConst/dev.js"],false) )
           )
					.replace(/\$SOURCE_DIR\$/g,PATH)
					.replace(/\$TARGET_NAME\$/g,"game/game")
);

builder.doCommand(
  builder.UGLIFY_CMD.replace(/\$DEFINE\$/g,
              builder.wipeOutSpecial( builder.readAndConcatFiles(["gameConst/all.js","gameConst/live.js"],false) )
           )
					.replace(/\$SOURCE_DIR\$/g,PATH)
					.replace(/\$TARGET_NAME\$/g,"game_dev/game")
);
