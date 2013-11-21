// delete dist
require("./buildLibrary.js").deleteFolderRecursive(	"dist/nightly/game");
require("./buildLibrary.js").createFolder(			"dist/nightly/game");
require("./buildLibrary.js").deleteFolderRecursive(	"dist/nightly/game_dev");
require("./buildLibrary.js").createFolder(			"dist/nightly/game_dev");

// build game
var flow = require("./workflow.js").order(
  function(){
    console.log("building game -> start");
  })

  .andThen(function( p,b ){
    require("./buildEngine.js").doIt(p,b);
  })
  .andThen(function( p,b ){
    require("./buildClient.js").doIt(p,b);
  })

  .start(function(){
    console.log("building game -> complete");
  });