console.log('building dependencies for cwt game engine');

var things = [
  'fsm.js',
  'amanda.js',
  'graph.js',
  'astar.js'
];

require('./build.js').buildAndWrite(things,'jsBin/nightly/gameEngineDeps',"libJs");