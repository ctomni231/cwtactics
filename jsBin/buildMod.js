var builder = require("./buildLibrary.js");

var files = [];
var addEl = function( el ){ files.push( el ); };

builder.getFileList("mod").forEach( addEl );

builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "jsBin/nightly/normal/mod.js"
);

builder.writeToFile(
  builder.readAndConcatFiles( files ),
  "jsBin/nightly/min/mod.js"
);