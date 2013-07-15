var builder = require( "./buildLibrary.js" );

[ "normal", "min" ].forEach( function( folder ){
  var folderComplete = "dist/nightly/" + folder;
  var minimize = ( folder.match( /min$/ ) );
  var dirs, dir, i, e;
  var fileList = [ ];

  // WIPE OUT DIRECTORY CONTENT
  builder.deleteFolderRecursive( folderComplete );
  builder.createFolder( folderComplete );

  [ "srcEngine", "srcWebClient" ].forEach( function( masterDir ){

    // READ ENGINE FILES
    dirs = builder.getFileList( masterDir );
    for( i = 0, e = dirs.length; i < e; i++ ) {
      dir = dirs[i];

      //if( dir === masterDir+"/.DS_Store") continue;
      if( dir.match( /.DS_Store$/ ) ) continue;

      // DO NOT BUILD HTML/CSS
      var mode = 0;
      if( dir.match( /css$/ ) ) mode = 1;
      if( dir.match( /html$/ ) ) mode = 2;

      var ext;
      switch(mode) {

        // JS
        case 0:
          ext = ".js";
          builder.getFileList( dir ).forEach( function( el ){
            if( builder.getExtension( el ) !== ext ) return;

            var code;
            if( !minimize ) code = builder.readAndConcatFiles( [ el ] );
            else code = builder.uglifyCode( el );
            
            builder.writeToFile( code, folderComplete + "/" + fileList.length + ext );
            fileList.push( fileList.length + ext );
          } );
          break;

          // CSS
        case 1:
          ext = ".css";
          builder.getFileList( dir ).forEach( function( el ){
            if( builder.getExtension( el ) !== ext ) return;
            
            var code = builder.readAndConcatFiles( [ el ] );
            
            builder.writeToFile( code, folderComplete + "/" + fileList.length + ext );
            fileList.push( fileList.length + ext );
          } );
          break;

          // HTML
        case 2:
          ext = ".html";
          var htmlFiles = [];
          
          builder.getFileList( dir ).forEach( function( el ){
            if( builder.getExtension( el ) !== ext ) return;
            htmlFiles.push(el);
          } );
          
          var lastHtml = htmlFiles.pop();
          
          var htmlcode = [builder.readAndConcatFiles(htmlFiles)];
          fileList.forEach( function( hel ){
            if( hel.match( /css$/ ) ) htmlcode.push("<link rel=\"stylesheet\" href=\""+hel+"\">\n");
            else if( hel.match( /js/ ) ) htmlcode.push("<script src=\""+hel+"\"></script>\n");
            else throw Error();
          } );
          htmlcode.push(builder.readAndConcatFiles([lastHtml]));
          
          builder.writeToFile( htmlcode.join("\n"), folderComplete + "/cwt.html" );
          fileList.push( "cwt.html" );
          break;
      }
    }

    // MANIFEST FILE

    // HEAD
    var manifestCode = [ "CACHE MANIFEST", "", "# VERSION " + new Date(), "", "CHACHE:" ];

    // CACHE
    fileList.forEach( function( el ){
      manifestCode.push( el );
    } );

    // END
    manifestCode.push( "", "NETWORK:", "*" );

    // WRITE FILE
    builder.writeToFile( manifestCode.join( "\n" ), folderComplete + "/cache.manifest" );
  } );
} );