console.log('building cwt');

var things = [
  'main.js'
];

require('./build.js').buildAndWrite(things,'dist/cwt.js');