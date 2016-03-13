/*global require,process,console*/

var DEST_DIRECTORY = "dist";
var GAME_SOURCE_DIRECTORY = "src_engine";
var NEW_GAME_SOURCE_DIRECTORY = "src_new";
var DUALCORE_DIRECTORY = "dualcore";

var MAIN_THREAD_FILE = "thread_main.js";
var GAME_THREAD_FILE = "thread_game.js";

var ARG_AUTOTEST_BUILD = "-test";
var ARG_DEV_BUILD = "-dev";
var ARG_LIVE_BUILD = "-live";
var ARG_DUAL_CORE = "-dualcore";

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

var calledWithArgument = function(arg) {
  return args.indexOf(arg) != -1;
};

var isOldGameMode = function(args) {
  return args.indexOf(ARG_OLD_GAME) != -1;
};

var removeDevMacros = function(string) {
  return string.replace(/(\/\/#MACRO:IF DEV)([\s\S]*)(\/\/#MACRO:ENDIF)/gm, "");
};

function print_program_info() {
  console.log("Cannot build game with the given arguments!");
  console.log("");
  console.log("Correct usage:");
  console.log("  node build.js (-dev|-live) [-test] [-dualcore]");
  console.log("");
  console.log("Parameters:");
  console.log("dev      - All development statements will be included in the build");
  console.log("live     - The build does not contains any development statements");
  console.log("test     - The build contains the acceptance test system which tests the game on startup");
  console.log("dualcore - The build file will be optimized for multicore systems (uses WebWorker-API)");
}

var buildGame = function(devMode) {
  var workerSource;

  var gameSource = new cwtBuild.StringBuilder();
  cwtBuild.readFile(gameSource, BASE_STUB_FILE);
  cwtBuild.readFile(gameSource, BASE_CONSTANTS_FILE);
  gameSource.append("var DUALCORE_MODE=" + (calledWithArgument(ARG_DUAL_CORE) ? "true" : "false") + "; \r\n");
  cwtBuild.readFile(gameSource, devMode ? DEV_CONSTANTS_FILE : LIVE_CONSTANTS_FILE);
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/util");
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/core");

  if (calledWithArgument(ARG_DUAL_CORE)) {
    workerSource = new cwtBuild.StringBuilder();
    cwtBuild.readFile(workerSource, BASE_STUB_FILE);
    cwtBuild.readFile(workerSource, BASE_CONSTANTS_FILE);
    workerSource.append("var DUALCORE_MODE=true; \r\n");
    cwtBuild.readFile(workerSource, devMode ? DEV_CONSTANTS_FILE : LIVE_CONSTANTS_FILE);
    cwtBuild.readFolder(workerSource, NEW_GAME_SOURCE_DIRECTORY + "/util");
    cwtBuild.readFolder(workerSource, NEW_GAME_SOURCE_DIRECTORY + "/core");
    cwtBuild.readFile(workerSource, NEW_GAME_SOURCE_DIRECTORY + "/events/events.js");
    cwtBuild.readFile(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/events/events.js");
    cwtBuild.readFolder(workerSource, NEW_GAME_SOURCE_DIRECTORY + "/game");
  } else {
    cwtBuild.readFile(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/events/events.js");
    cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/game");
  }

  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/states");
  cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/controller");

  /*
  if (calledWithArgument(ARG_DUAL_CORE)) {
    cwtBuild.readFolder(workerSource, NEW_GAME_SOURCE_DIRECTORY + "/commands");
  } else {
    cwtBuild.readFolder(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/commands");
  }
  */
  cwtBuild.readFile(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/main.js");

  if (calledWithArgument(ARG_AUTOTEST_BUILD)) {
    cwtBuild.readFile(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/test/test_core.js");
    cwtBuild.readFile(gameSource, NEW_GAME_SOURCE_DIRECTORY + "/test/game_test.js");
  }

  var cssSource = new cwtBuild.StringBuilder();

  var htmlSource = new cwtBuild.StringBuilder();
  htmlSource.append("<html><head> \r\n");
  htmlSource.append("<link href='game.css' rel='stylesheet' type='text/css' /> \r\n");
  if (devMode) {
    htmlSource.append("<div id='fpsCounter' style='position: absolute; top: 10px; lef: 10px;'></div>\r\n");
  }
  htmlSource.append("<script type='text/javascript' src='game.js'></script>    \r\n");
  if (calledWithArgument(ARG_DUAL_CORE)) {
    cwtBuild.readFile(workerSource, NEW_GAME_SOURCE_DIRECTORY + "/" + DUALCORE_DIRECTORY + "/game_core.js");
    htmlSource.append("<script type='text/javascript'>cwt.game_worker = new Worker('game-worker.js');</script>    \r\n");
    htmlSource.append("<script type='text/javascript'>    \r\n");
    cwtBuild.readFile(htmlSource, NEW_GAME_SOURCE_DIRECTORY + "/" + DUALCORE_DIRECTORY + "/main_core.js");
    htmlSource.append("</script>    \r\n");
  }
  htmlSource.append("<script type='text/javascript'>cwt.main();</script>    \r\n");
  htmlSource.append("</head><body></body></html> \r\n");

  console.log("deploy files into " + DEST_DIRECTORY + "/");
  cwtBuild.writeFile(gameSource.toString(), DEST_DIRECTORY + "/game.js");
  cwtBuild.writeFile(cssSource.toString(), DEST_DIRECTORY + "/game.css");
  cwtBuild.writeFile(htmlSource.toString(), DEST_DIRECTORY + "/game.html");
  if (calledWithArgument(ARG_DUAL_CORE)) {
    cwtBuild.writeFile(workerSource.toString(), DEST_DIRECTORY + "/game-worker.js");
  }
};

var startFlow = function() {
  var devMode = isDevMode(args);
  var liveMode = isLiveMode(args);

  if ((!devMode && !liveMode) || (devMode && liveMode)) {
    print_program_info();
    return;
  }

  console.log("building");

  checkDirectory();

  cwtBuild.wipeFolderContent(DEST_DIRECTORY);
  buildGame(devMode);

  console.log("completed");
};

startFlow();