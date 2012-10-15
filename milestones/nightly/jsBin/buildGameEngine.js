console.log('building cwt game engine');

var things = [

  'engine_skeleton.js',

  'utils.js',

  'map.js',
  'sheets.js',

  'move.js',
  'battle.js',
  'property.js',
  'turn.js',
  'persistence.js',

  'clientActions.js'
];

require('./build.js').buildAndWrite(things,'jsBin/nightly/gameEngine',"srcEngine");