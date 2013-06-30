var builder = require("./buildLibrary.js");

// --------------------------------------------------------------------
// WRITE CLIENT LIB

var files = [];
var addEl = function( el ){
  files.push( el );
};

builder.getFileList("srcWebClient/core").forEach( addEl );
builder.getFileList("srcWebClient/data").forEach( addEl );
builder.getFileList("srcWebClient/controller").forEach( addEl );
builder.getFileList("srcWebClient/stateScope").forEach( addEl );
builder.getFileList("srcWebClient/states").forEach( addEl );
builder.getFileList("srcWebClient/hooks").forEach( addEl );
builder.getFileList("srcWebClient/gui").forEach( addEl );

var code = builder.readAndConcatFiles( files );
builder.writeToFile( code, "dist/nightly/normal/client.js" );

var ugly_code = builder.uglifyCode( "dist/nightly/normal/client.js" );
builder.writeToFile( ugly_code, "dist/nightly/min/client.js" );

// --------------------------------------------------------------------
// DEPS

files.splice(0);
builder.getFileList("libJs/client").forEach( addEl );
builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "dist/nightly/normal/clientDeps.js"
);

ugly_code = builder.uglifyCode( "dist/nightly/normal/clientDeps.js" );
builder.writeToFile( ugly_code,"dist/nightly/min/clientDeps.js");

// --------------------------------------------------------------------
// FILES

builder.fileCopy( "srcWebClient/css/style.css", "dist/nightly/min/style.css" );
builder.fileCopy( "srcWebClient/css/style.css", "dist/nightly/normal/style.css" );
builder.fileCopy( "srcWebClient/startGame.html", "dist/nightly/min/startGame.html" );
builder.fileCopy( "srcWebClient/startGame.html", "dist/nightly/normal/startGame.html" );