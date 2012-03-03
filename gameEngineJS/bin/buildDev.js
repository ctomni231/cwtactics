console.log('building cwt debug');

var things = [
  'main.js',
  'var DEBUG = true;'
];

require('./build.js').buildAndWrite(things,'dist/cwt_dev.js');