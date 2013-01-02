var fs = require('fs');
var ugly = require('uglify-js');

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
    all[all.length] = file.match(/.js$/)?
      fs.readFileSync( file ).toString(): "";
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
  fs.writeSync(out, code );
};

exports.fileCopy = function( file, target ){
  if( file.substring( file.length-3, file.length ) === 'png'){
    console.log("using image workaround");
    fs.readFile( src+'/'+file , function(err, original_data){
      var base64Image = original_data.toString('base64');
      var decodedImage = new Buffer(base64Image, 'base64');
      fs.writeFile( target+'/'+file , decodedImage, function(err) {});
    });
  }
  else{
    var fin = fs.readFileSync( src+'/'+file ).toString();
    var fout = fs.openSync( target+'/'+file, 'w+');
    fs.writeSync(fout, fin);
  }
};