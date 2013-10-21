// delete dist
require("./buildLibrary.js").deleteFolderRecursive(	"dist/nightly/game");
require("./buildLibrary.js").createFolder(			"dist/nightly/game");
require("./buildLibrary.js").deleteFolderRecursive(	"dist/nightly/game_dev");
require("./buildLibrary.js").createFolder(			"dist/nightly/game_dev");

// build game
require("./buildEngine.js");
require("./buildClient.js");
