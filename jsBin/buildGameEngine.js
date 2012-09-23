console.log('building cwt game engine');

var things = [
  'main.js',
  'system/action.js',
  'system/commandPipe.js',
  'system/logger.js',
  'system/persist.js',
  'system/transaction.js',
  'system/tags.js',
  'controller/model.js',
  'controller/battle.js',
  'controller/db.js',
  'controller/input.js',
  'controller/move.js',
  'controller/properties.js',
  'controller/selector.js',
  'controller/turn.js'
];

require('./build.js').buildAndWrite(things,'jsBin/nightly/gameEngine',"srcEngine");