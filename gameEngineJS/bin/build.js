var fs = require('fs');

exports.buildAndWrite = function( files, target ){

  var all = [];
  files.forEach(function(file, i) {
    all[all.length] = file.match(/.js$/)? fs.readFileSync('src/'+file ).toString() : file;
  });

  var out = fs.openSync( target , 'w+');
  fs.writeSync(out, all.join('\n'));
}