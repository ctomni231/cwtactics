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

exports.deleteFolderRecursive = function( path ) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                exports.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.getFileList = function( dir ){
  var result = fs.readdirSync( dir );
  for( var i=0,e=result.length; i<e; i++ ){
    result[i] = dir+"/"+result[i];
  }

  return result;
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
