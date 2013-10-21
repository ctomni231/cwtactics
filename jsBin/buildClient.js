var builder = require( "./buildLibrary.js" );

// -------------- build code --------------

var PATH =  "srcWebClient/libs/*.js "+
			"srcWebClient/core/*.js "+
			"srcWebClient/controller/*.js "+
			"srcWebClient/data/*.js "+
			"srcWebClient/gui/*.js "+
			"srcWebClient/hooks/*.js "+
			"srcWebClient/states/*.js "+
			"srcWebClient/stateScope/*.js ";

builder.doCommand(
  builder.UGLIFY_CMD.replace(/\$DEFINE\$/g,
            builder.wipeOutSpecial( builder.readAndConcatFiles(["gameConst/all.js","gameConst/dev.js"],false) )
           )
					.replace(/\$SOURCE_DIR\$/g,PATH)
					.replace(/\$TARGET_NAME\$/g,"game/client")
);

builder.doCommand(
  builder.UGLIFY_CMD.replace(/\$DEFINE\$/g,
            builder.wipeOutSpecial( builder.readAndConcatFiles(["gameConst/all.js","gameConst/live.js"],false) )
           )
					.replace(/\$SOURCE_DIR\$/g,PATH)
					.replace(/\$TARGET_NAME\$/g,"game_dev/client")
);

// -------------- build css --------------

var CSS_CODE = builder.readAndConcatFiles( builder.getFileList("srcWebClient/css"),"css" );

builder.writeToFile( CSS_CODE, builder.DIST_DIR+"game/style.css" );
builder.writeToFile( CSS_CODE, builder.DIST_DIR+"game_dev/style.css" );

// -------------- build html --------------

var HTML_CODE = builder.readAndConcatFiles([
		"srcWebClient/html/start.html",
		"srcWebClient/html/errorDialog.html",
		"srcWebClient/html/loadScreen.html",
		"srcWebClient/html/mobileScreen.html",
		"srcWebClient/html/mainScreen.html",
		"srcWebClient/html/versusScreen.html",
		"srcWebClient/html/playerSetup.html",
		"srcWebClient/html/setMapping.html",
		"srcWebClient/html/optionScreen.html",
		"srcWebClient/html/gameScreen.html"
	])+
	"<link href='style.css' rel='stylesheet' type='text/css' />"+
	"<script type='text/javascript' src='game.js'></script>"+
	"<script type='text/javascript' src='client.js'></script>"+
				builder.readAndConcatFiles([
		"srcWebClient/html/end.html"
	]);

builder.writeToFile( HTML_CODE, builder.DIST_DIR+"game/game.html" );
builder.writeToFile( HTML_CODE,	builder.DIST_DIR+"game_dev/game.html" );
