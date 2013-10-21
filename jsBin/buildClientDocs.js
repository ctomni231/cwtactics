var builder = require( "./buildLibrary.js" );

builder.doCommand( "docker -o "+builder.DIST_DIR+"/docsClient -i srcWebClient -u -n -c tango --extras fileSearch" );
