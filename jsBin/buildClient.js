var builder = require( "./buildLibrary.js" );

// -------------- build code --------------

var PATH =  " "+builder.dirJsToString("srcWebClient/libs")+" "+
			builder.dirJsToString("srcWebClient/core")+" "+
			builder.dirJsToString("srcWebClient/controller")+" "+
			builder.dirJsToString("srcWebClient/aw2")+" "+
			builder.dirJsToString("srcWebClient/gui")+" "+
			builder.dirJsToString("srcWebClient/hooks")+" "+
			builder.dirJsToString("srcWebClient/states")+" ";
//			builder.dirJsToString("srcWebClient/stateScope")+" "


exports.doIt = function( p,baton ){
  baton.take();
  var flow = require("./workflow.js").order(function(){
      console.log("building client -> start");
    })

    // BUILD MINIFIED DEV VERSION
    .andThen(function( p,b ){
      console.log("building dev version");

      b.take();
      builder.doCommand(
        builder.UGLIFY_CMD
          .replace(/\$DEFINE\$/g,"")
          .replace(/\$COMPRESS\$/g,"-b")
          .replace(/\$SOURCE_DIR\$/g,"gameConst/dev.js "+PATH)
          .replace(/\$TARGET_NAME\$/g,"game_dev/client")
          .replace(/\$TARGET_SOURCE_NAME\$/,"client")
        ,function(){
          b.pass();
        }
      );
    })

    // BUILD MINIFIED LIVE VERSION
    .andThen(function( p,b ){
      console.log("building live version");

      b.take();
      builder.doCommand(
        builder.UGLIFY_CMD.replace(/\$DEFINE\$/g,
            builder.wipeOutSpecial(
              builder.readAndConcatFiles(["gameConst/live.js"],false)
            )
          )
          .replace(/\$SOURCE_DIR\$/g,PATH)
          .replace(/\$COMPRESS\$/g,"-c -m")
          .replace(/\$TARGET_NAME\$/g,"game/client")
          .replace(/\$TARGET_SOURCE_NAME\$/,"client")
        ,function(){
          b.pass();
        }
      );
    })

    // BUILD HTML
    .andThen(function(){
      console.log("building dom starter");

      var HTML_CODE = builder.readAndConcatFiles([
        "srcWebClient/dom/start.dom",
        "srcWebClient/dom/errorDialog.dom",
        "srcWebClient/dom/updatePanel.dom",
        "srcWebClient/dom/loadScreen.dom",
        "srcWebClient/dom/mobileScreen.dom",
        "srcWebClient/dom/mainScreen.dom",
        "srcWebClient/dom/versusScreen.dom",
        "srcWebClient/dom/playerSetup.dom",
        "srcWebClient/dom/parameterSetup.dom",
        "srcWebClient/dom/setMapping.dom",
        "srcWebClient/dom/optionScreen.dom",
        "srcWebClient/dom/confirmWipeOut.dom",
        "srcWebClient/dom/gameScreen.dom"
      ])+
        "<link href='style.css' rel='stylesheet' type='text/css' />"+
        "<script type='text/javascript' src='game.js'></script>"+
        "<script type='text/javascript' src='client.js'></script>"+
        builder.readAndConcatFiles([
          "srcWebClient/dom/end.dom"
        ]);

      builder.writeToFile( HTML_CODE, builder.DIST_DIR+"game/game.dom" );
      builder.writeToFile( HTML_CODE,	builder.DIST_DIR+"game_dev/game.dom" );
    })

    // BUILD CSS
    .andThen(function(){
      console.log("building css");

      var CSS_CODE = builder.readAndConcatFiles( builder.getFileList("srcWebClient/css"),"css" );

      builder.writeToFile( CSS_CODE, builder.DIST_DIR+"game/style.css" );
      builder.writeToFile( CSS_CODE, builder.DIST_DIR+"game_dev/style.css" );
    })

    // CACHE MANIFEST
    .andThen(function(){
      console.log("building cache.manifest");
      var content = [
        "CACHE MANIFEST",
        "",
        "# VERSION: "+(new Date()).getTime(),
        "",
        "client.js",
        "game.js",
        "style.css",
        "game.dom",
        "",
        "NETWORK:",
        "*"
      ].join("\n");

      builder.writeToFile(content,builder.DIST_DIR+"game/cache.manifest");
      builder.writeToFile(content,builder.DIST_DIR+"game_dev/cache.manifest");
    })

    .start(function(){
      console.log("building client -> complete");
      baton.pass();
    });
};
