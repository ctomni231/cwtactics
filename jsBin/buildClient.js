var builder = require("./buildLibrary.js");

// --------------------------------------------------------------------
// WRITE CLIENT LIB

var files = [];
var addEl = function( el ){
  files.push( el );
};

builder.getFileList("srcWebClient/controller").forEach( addEl );
builder.getFileList("srcWebClient/view").forEach( addEl );
builder.getFileList("srcWebClient/hooks").forEach( addEl );
builder.getFileList("srcWebClient/menuRenderer").forEach( addEl );
builder.getFileList("srcWebClient/commands").forEach( addEl );
builder.getFileList("srcWebClient").forEach( addEl );

files.splice( 0, 0, "srcWebClient/conf/turnOffDebug.js" );
var code = builder.readAndConcatFiles( files );
builder.writeToFile( code, "jsBin/nightly/normal/client.js" );

var ugly_code = builder.uglifyCode( "jsBin/nightly/normal/client.js" );
builder.writeToFile( ugly_code, "jsBin/nightly/min/client.js" );
files.splice( 0, 1 );

files.splice( 0, 0, "srcWebClient/conf/turnOnDebug.js" );
code = builder.readAndConcatFiles( files );
builder.writeToFile( code, "jsBin/nightly/normal/client_debug.js" );
builder.writeToFile( code.replace("const ","var "), "jsBin/nightly/normal/client_debug_IE.js" );

ugly_code = builder.uglifyCode( "jsBin/nightly/normal/client_debug.js" );
builder.writeToFile( ugly_code, "jsBin/nightly/min/client_debug.js" );
builder.writeToFile( ugly_code.replace("const ","var "), "jsBin/nightly/min/client_debug_IE.js" );


// DEPS
files.splice(0);
builder.getFileList("libJs/client").forEach( addEl );
builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "jsBin/nightly/normal/clientDeps.js"
);

ugly_code = builder.uglifyCode( "jsBin/nightly/normal/clientDeps.js" );
builder.writeToFile( ugly_code,"jsBin/nightly/min/clientDeps.js");


// --------------------------------------------------------------------
// GENERATE STARTER IMPORTS

var starterCodePre = builder.readAndConcatHTMLFiles([
  "srcWebClient/starter_PRE.html"
]);

var starterCodePost = builder.readAndConcatHTMLFiles([
  "srcWebClient/starter_POST.html"
]);

var importNonDebug = [
  "<script src='../../../maps/testMap.js' type='text/javascript'></script>",
  "<script src='../../../maps/testMap_2_6.js' type='text/javascript'></script>",

  "<script src='engineDeps.js' type='text/javascript'></script>",
  "<script src='clientDeps.js' type='text/javascript'></script>",
  "<script src='gameConf.js' type='text/javascript'></script>",
  "<script src='mod.js' type='text/javascript'></script>",
  "<script src='engine.js' type='text/javascript'></script>",
  "<script src='client.js' type='text/javascript'></script>"
];
var importDebug = [
  "<script src='../../../maps/testMap.js' type='text/javascript'></script>",
  "<script src='../../../maps/testMap_2_6.js' type='text/javascript'></script>",

  "<script src='engineDeps.js' type='text/javascript'></script>",
  "<script src='clientDeps.js' type='text/javascript'></script>",
  "<script src='gameConf.js' type='text/javascript'></script>",
  "<script src='mod.js' type='text/javascript'></script>",
  "<script src='engine_debug.js' type='text/javascript'></script>",
  "<script src='client_debug.js' type='text/javascript'></script>"
];

var codeNorm = starterCodePre + importNonDebug.join("\n") + starterCodePost;
var codeDebug = starterCodePre + importDebug.join("\n") + starterCodePost;

// --------------------------------------------------------------------
// WRITE STARTERS
builder.writeToFile( codeNorm, "jsBin/nightly/min/starter.html" );
builder.writeToFile( codeDebug, "jsBin/nightly/min/starterDebug.html" );
builder.writeToFile( codeNorm, "jsBin/nightly/normal/starter.html" );
builder.writeToFile( codeDebug, "jsBin/nightly/normal/starterDebug.html" );