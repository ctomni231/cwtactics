// IGNORE ME ... I AM ONLY 

var fs = require('fs');
var ugly = require('uglify-js');
var sys = require('sys')
var exec= require('child_process').exec;

var isWindows = ( process.platform === 'win32' );

function pathReplace( path ){
  if( isWindows ) return path.replace(/\//g,"\\");
  else return path;
};

exports.DIST_DIR = "dist/nightly/";

exports.UGLIFY_CMD =  "uglifyjs "+
                      "$SOURCE_DIR$ "+
                      "-o "+exports.DIST_DIR+"$TARGET_NAME$.js "+
                      //"--source-map $TARGET_SOURCE_NAME$-source-map.js "+
                      //"--source-map-root http://localhost:8000/ "+
                      "-d $DEFINE$ "+
                      "$COMPRESS$ "+
                      "--screw-ie8 ";

exports.dirJsToString = function( dir ){
  var res = [];
  var result = fs.readdirSync( dir );
  for( var i=0,e=result.length; i<e; i++ ){
    if( result[i].match(/.js$/) ) res.push( pathReplace( dir+"/"+result[i] ) );
  }
  
  return res.join(" ");
};

exports.doCommand = function( cmd,cb ){
  
  console.log( "EXEC:\n"+cmd+"\n" );
  exec( cmd , function(error, stdout, stderr){
    console.log( ' stdout: ' + stdout);
    console.log( ' stderr: ' + stderr);
    console.log( "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" );
    if( cb ) cb();
  });
};

exports.createFolder = function( path ) {
  fs.mkdirSync(path);
};

exports.wipeOutSpecial = function( text ){
  return text.replace(/(\r\n|\n|\r)/gm,"").replace(/\s/gm,"").replace(/\t/gm,"");
};

exports.getFileList = function( dir ){
  var result = fs.readdirSync( dir );
  for( var i=0,e=result.length; i<e; i++ ){
    result[i] = dir+"/"+result[i];
  }

  return result;
};

cwtBuild.fileCopy = function (src, target) {
  if (src.substring(src.length - 3, src.length) === 'png') {
    fs.readFile(src, function (err, original_data) {
      var base64Image = original_data.toString('base64');
      var decodedImage = new Buffer(base64Image, 'base64');
      fs.writeFile(target, decodedImage, function (err) {});
    });
    
  } else {
    fs.writeSync(fs.openSync(target, 'w+'), fs.readFileSync(src).toString());
  }
};

exports.createFolder = function(path) {
  fs.mkdirSync(path);
};

exports.readAndConcatFiles = function( files,ext ){
  var all = [];
  files.forEach(function(file, i) {
    if( file.match(/.DS_Store$/) ) return;

    // check ext
    if( ext==="html" && !file.match(/.html$/) ) return;
    if( ext==="css"  && !file.match(/.css$/)  ) return;

    all[all.length] = fs.readFileSync( file ).toString();
  });

  return all.join( (ext===false)? '':'\n' );
};

exports.writeToFile = function( code, path ){
  var out = fs.openSync( path , 'w+');
  fs.writeSync( out, code );
  fs.closeSync( out );
};

exports.fileCopy = function( src, target ){
  if( src.substring( src.length-3, src.length ) === 'png'){
    console.log("using image workaround");
    fs.readFile( src , function(err, original_data){
      var base64Image = original_data.toString('base64');
      var decodedImage = new Buffer(base64Image, 'base64');
      fs.writeFile( target , decodedImage, function(err) {});
    });
  }
  else{
    var fin = fs.readFileSync( src ).toString();
    var fout = fs.openSync( target, 'w+');
    fs.writeSync(fout, fin);
  }
};

exports.deleteFile = function( path ){
  fs.unlinkSync(path);
};

var builder = require( "./buildLibrary.js" );

// -------------- build code --------------

var PATH =  " "+builder.dirJsToString("srcWebClient/libs")+" "+
			builder.dirJsToString("srcWebClient/core")+" "+
			builder.dirJsToString("srcWebClient/controller")+" "+
			builder.dirJsToString("srcWebClient/data")+" "+
			builder.dirJsToString("srcWebClient/gui")+" "+
			builder.dirJsToString("srcWebClient/hooks")+" "+
			builder.dirJsToString("srcWebClient/states")+" "+
			builder.dirJsToString("srcWebClient/stateScope")+" ";


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
      console.log("building html starter");

      var HTML_CODE = builder.readAndConcatFiles([
        "srcWebClient/html/start.html",
        "srcWebClient/html/errorDialog.html",
        "srcWebClient/html/updatePanel.html",
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
        "game.html",
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
