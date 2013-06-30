// build modification file
var builder = require("./buildLibrary.js");

builder.fileCopy( "mod/awds/mod.json", "dist/nightly/min/awds.json" );
builder.fileCopy( "mod/awds/mod.json", "dist/nightly/normal/awds.json" );