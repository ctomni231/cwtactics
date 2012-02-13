var fs = require('fs');
var sys = require('sys');
var uglify = require('uglify-js');

desc('Uglify JS');

task('concat',[], function(){

});

task('minify', [], function(params) {
  var files = ['jquery-1.5.min.js',
    'jquery.easing.1.3.js',
    'jquery.boxy.js',
    'jquery.form.js',
    'date.js',
    'util.js',
    'layout.js'];

  var all = '';
  files.forEach(function(file, i) {
    if (file.match(/^.*js$/)) {
      all += fs.readFileSync('public/js/'+file).toString();
    }
  });

  var ast = uglify.parser.parse(all);
  var out = fs.openSync('public/js/all.js', 'w+');
  ast = uglify.uglify.ast_mangle(ast);
  ast = uglify.uglify.ast_squeeze(ast);
  fs.writeSync(out, uglify.uglify.gen_code(ast));
});