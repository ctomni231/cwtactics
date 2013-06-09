var builder = require("./buildLibrary.js");

builder.fileCopy( "mod/awds/mod.json", "jsBin/nightly/min/awds.json" );
builder.fileCopy( "mod/awds/mod.json", "jsBin/nightly/normal/awds.json" );