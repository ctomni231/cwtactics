var builder = require( "./buildLibrary.js" );

builder.doCommand( "docker -o "+builder.DIST_DIR+"/docs -i srcEngine -u -n -c tango --extras fileSearch" );
