var fs = require('fs');
var ugly = require('uglify-js');

exports.getExtension = function(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

exports.deleteFolderRecursive = function(path) {
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

exports.createFolder = function(path) {
  fs.mkdirSync(path);
};

exports.getFileList = function( dir ){
  var result = fs.readdirSync( dir );
  for( var i=0,e=result.length; i<e; i++ ){
    result[i] = dir+"/"+result[i];
  }

  return result;
};

exports.readAndConcatFiles = function( files ){
  var all = [];
  files.forEach(function(file, i) {
    if( file.match(/.DS_Store$/) ) return;
    //all[all.length] = file.match(/.js$/)? fs.readFileSync( file ).toString(): "";
    all[all.length] = fs.readFileSync( file ).toString();
  });

  return all.join('\n');
};

exports.readAndConcatHTMLFiles = function( files ){
  var all = [];
  files.forEach(function(file, i) {
    if( file.match(/.DS_Store$/) ) return;
    all[all.length] = file.match(/.html$/)?
      fs.readFileSync( file ).toString(): "";
  });

  return all.join('\n');
};

exports.uglifyCode = function( file ){
  return ugly.minify( file ).code;
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