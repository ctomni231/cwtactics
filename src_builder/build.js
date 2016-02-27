/*global require,process,console*/

var DEST_DIRECTORY = "dist";
var GAME_SOURCE_DIRECTORY = "src_engine";
var NEW_GAME_SOURCE_DIRECTORY = "src_new";

var ARG_DEV_BUILD = "-dev";
var ARG_LIVE_BUILD = "-live";

var BASE_CONSTANTS_FILE = "src_const/base.js";
var DEV_CONSTANTS_FILE = "src_const/dev.js";
var LIVE_CONSTANTS_FILE = "src_const/live.js";
var BASE_STUB_FILE = "src_const/stub.js";

var cwtBuild = require("./lib").cwtBuild;
var args = process.argv.slice(2);

var checkDirectory = function() {
  if (process.cwd().indexOf("src_builder") != -1) {
    process.chdir('../');
    console.log("change into root directory");
  }
};

var isDevMode = function(args) {
  return args.indexOf(ARG_DEV_BUILD) != -1;
};

var isLiveMode = function(args) {
  return args.indexOf(ARG_LIVE_BUILD) != -1;
};

var isOldGameMode = function(args) {
  return args.indexOf(ARG_OLD_GAME) != -1;
};

var removeDevMacros = function(string) {
  return string.replace(/(\/\/#MACRO:IF DEV)([\s\S]*)(\/\/#MACRO:ENDIF)/gm, "");
};

var buildGame = function(devMode) {

  var gameSource = new cwtBuild.StringBuilder();
  cwtBuild.readFile(gameSource, BASE_STUB_FILE);
  cwtBuild.readFile(gameSource, BASE_CONSTANTS_FILE);
  cwtBuild.readFile(gameSource, devMode ? DEV_CONSTANTS_FILE : LIVE_CONSTANTS_FILE);
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/util");
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/core");
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/game");
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/states");
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/controller");
  cwtBuild.readFile(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/main.js");

  var cssSource = new cwtBuild.StringBuilder();

  var htmlSource = new cwtBuild.StringBuilder();
  htmlSource.append("<html><head> \r\n");
  htmlSource.append("<link href='game.css' rel='stylesheet' type='text/css' /> \r\n");
  htmlSource.append("<script type='text/javascript' src='game.js'></script>    \r\n");
  htmlSource.append("<script type='text/javascript'>cwt.main();</script>    \r\n");
  htmlSource.append("</head><body></body></html> \r\n");

  console.log("deploy files into " + DEST_DIRECTORY + "/");
  cwtBuild.writeFile(gameSource.toString(), DEST_DIRECTORY + "/game.js");
  cwtBuild.writeFile(cssSource.toString(), DEST_DIRECTORY + "/game.css");
  cwtBuild.writeFile(htmlSource.toString(), DEST_DIRECTORY + "/game.html");
};

var startFlow = function() {
  var devMode = isDevMode(args);
  var liveMode = isLiveMode(args);

  if ((!devMode && !liveMode) || (devMode && liveMode)) {
    console.log("Cannot build game with the given arguments!");
    console.log("");
    console.log("Correct usage:");
    console.log("  node build.js (-dev|-live)");
    return;
  }

  console.log("building");

  checkDirectory();

  cwtBuild.wipeFolderContent(DEST_DIRECTORY);
  buildGame(devMode);

  console.log("completed");
};

startFlow();