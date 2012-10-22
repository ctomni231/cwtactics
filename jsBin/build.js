var fs = require('fs');
var ugly = require('uglify-js');
var pro = ugly.uglify;
var jsp = ugly.parser;

exports.buildAndWrite = function( files, target, src ){

  var all = [];
  files.forEach(function(file, i) {
    all[all.length] = file.match(/.js$/)?
      fs.readFileSync( src+'/'+file ).toString() : file;
  });

  var out;

  // out = fs.openSync( target+".js" , 'w+');
  // fs.writeSync(out, all.join('\n'));

  var ast = jsp.parse(all.join('\n') );
  ast = pro.ast_lift_variables(ast);
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  var final_code = pro.gen_code(ast,{
    max_line_length: 80
  });

  out = fs.openSync( target+"_min.js" , 'w+');
  fs.writeSync(out, final_code );
}

exports.fileConc = function( files, target, src ){
  var all = [];
  files.forEach(function(file, i) {
    all[all.length] = fs.readFileSync( src+'/'+file ).toString();
  });

  var out = fs.openSync( target , 'w+');
  fs.writeSync(out, all.join('\n'));
}

exports.fileCopy = function( files, target, src ){
  files.forEach(function(file, i) {

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
  });
}