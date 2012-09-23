console.log('building default mod');

var things = [
  'awds.js',
  'movetypes.js',
  'tiles.js',
  'units.js',
  'weapons.js'
];

require('./build.js').buildAndWrite(things,'jsBin/nightly/defaultMod',"mod");