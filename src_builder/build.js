var DEST_DIRECTORY = "dist";
var GAME_SOURCE_DIRECTORY = "src_engine";
var CLIENT_SOURCE_DIRECTORY = "src_client";

var ARG_DEV_BUILD = "-dev";
var ARG_LIVE_BUILD = "-live";

var BASE_CONSTANTS_FILE = "src_const/base.js";
var DEV_CONSTANTS_FILE = "src_const/dev.js";
var LIVE_CONSTANTS_FILE = "src_const/live.js";

var cwtBuild = require("./lib").cwtBuild;
var args = process.argv.slice(2);

var checkDirectory = function () {
  if (process.cwd().indexOf("/src_builder")) {
    process.chdir('../');
    console.log("change into root directory");
  }
}

var isDevMode = function (args) {
  return args.indexOf(ARG_DEV_BUILD) != -1;
};

var isLiveMode = function (args) {
  return args.indexOf(ARG_LIVE_BUILD) != -1;
};

var removeDevMacros = function (string) {
  return string.replace(/(\/\/#MACRO:IF DEV)([\s\S]*)(\/\/#MACRO:ENDIF)/gm, "");
};

var startFlow = function () {
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

  var gameSource = new cwtBuild.StringBuilder();

  cwtBuild.readFile(gameSource, BASE_CONSTANTS_FILE);
  cwtBuild.readFile(gameSource, devMode ? DEV_CONSTANTS_FILE : LIVE_CONSTANTS_FILE);

  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/libs");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/core");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/util");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/controller");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/model");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/events");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/persistence");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/sheetHandler");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/commands");
  cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/commands_ai");

  if (devMode) {
    cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/tests");
    cwtBuild.readFolder(gameSource, GAME_SOURCE_DIRECTORY + "/tests/core");
  }

  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/libs");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/core");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/controller");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/data");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/gui");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/hooks");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/states");
  cwtBuild.readFolder(gameSource, CLIENT_SOURCE_DIRECTORY + "/stateScope");

  var cssSource = new cwtBuild.StringBuilder();
  cwtBuild.readFolder(cssSource, CLIENT_SOURCE_DIRECTORY + "/css");

  var htmlSource = new cwtBuild.StringBuilder();
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/start.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/errorDialog.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/updatePanel.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/loadScreen.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/mobileScreen.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/mainScreen.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/versusScreen.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/playerSetup.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/setMapping.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/optionScreen.html");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/gameScreen.html");
  htmlSource.append("<link href='game.css' rel='stylesheet' type='text/css' /> \r\n");
  htmlSource.append("<script type='text/javascript' src='game.js'></script>    \r\n");
  cwtBuild.readFile(htmlSource, CLIENT_SOURCE_DIRECTORY + "/html/end.html");

  console.log("deploy files into " + DEST_DIRECTORY + "/");
  cwtBuild.writeFile(gameSource.toString(), DEST_DIRECTORY + "/game.js");
  cwtBuild.writeFile(cssSource.toString(), DEST_DIRECTORY + "/game.css");
  cwtBuild.writeFile(htmlSource.toString(), DEST_DIRECTORY + "/game.html");

  var cacheManifestSource = new cwtBuild.StringBuilder();
  cacheManifestSource.append("CACHE MANIFEST").appendNewLine();
  cacheManifestSource.appendNewLine();
  cacheManifestSource.append("# VERSION: " + (new Date()).getTime()).appendNewLine();;
  cacheManifestSource.appendNewLine();
  cacheManifestSource.append("game.js").appendNewLine();
  cacheManifestSource.append("game.css").appendNewLine();
  cacheManifestSource.append("game.html").appendNewLine();
  cacheManifestSource.appendNewLine();
  cacheManifestSource.append("NETWORK:").appendNewLine();
  cacheManifestSource.append("*");
  cwtBuild.writeFile(cacheManifestSource.toString(), DEST_DIRECTORY + "/cache.manifest");

  console.log("completed");
};

startFlow();
