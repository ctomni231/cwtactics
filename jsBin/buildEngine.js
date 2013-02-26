var builder = require("./buildLibrary.js");

var files = [];
var addEl = function( el ){ files.push( el ); };

files.push( "srcEngine/conf/gameConf.js" );
builder.getFileList("srcEngine").forEach( addEl );
builder.getFileList("srcEngine/util").forEach( addEl );
builder.getFileList("srcEngine/model").forEach( addEl );
builder.getFileList("srcEngine/controller").forEach( addEl );
builder.getFileList("srcEngine/stateMachine").forEach( addEl );
builder.getFileList("srcEngine/commands").forEach( addEl );

// TURN DEBUG ON TO HAVE LOG AND RUNTIME CHECKS
files.splice( 0, 0, "srcEngine/conf/turnOnDebug.js" );
builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "jsBin/nightly/normal/engine_debug.js"
);
files.splice( 0, 1 );

// WITH DEBUG ON ==> LEAVES THE STATEMENTS BUT CUTS THE DEBUG === TRUE CHECKS
var ugly_code = builder.uglifyCode( "jsBin/nightly/normal/engine_debug.js" );
builder.writeToFile( ugly_code, "jsBin/nightly/min/engine_debug.js" );
builder.writeToFile( ugly_code.replace("const ","var "), "jsBin/nightly/min/engine_debug_IE.js" );

// TURN DEBUG OFF TO PREVENT LOG AND RUNTIME CHECKS
files.splice( 0, 0, "srcEngine/conf/turnOffDebug.js" );
builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "jsBin/nightly/normal/engine.js"
);

// WITH DEBUG OFF ==> WILL CUT DEBUG STATEMENTS FROM SOURCE
var ugly_code = builder.uglifyCode( "jsBin/nightly/normal/engine.js" );
builder.writeToFile( ugly_code, "jsBin/nightly/min/engine.js" );
builder.writeToFile( ugly_code.replace("const ","var "), "jsBin/nightly/min/engine_IE.js" );


// DEPS
files.splice(0);
builder.getFileList("libJs/engine").forEach( addEl );
builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "jsBin/nightly/normal/engineDeps.js"
);

var ugly_code = builder.uglifyCode( "jsBin/nightly/normal/engineDeps.js" );
builder.writeToFile( ugly_code,"jsBin/nightly/min/engineDeps.js");