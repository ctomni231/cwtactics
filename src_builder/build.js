/*global require,process,console*/

var build_tools = require("./lib").cwtBuild;

var DESTINATION_DIRECTORY = "dist";
var SOURCE_DIRECTORY = "src_new";

var USER_INTERFACE_THREAD_JS_FILE = "game_th_main.js";
var GAME_THREAD_JS_FILE = "game_th_game.js";
var GAME_JS_FILE = "game.js";
var GAME_CSS_FILE = "game.css";
var GAME_HTML_FILE = "game.html";

var ARG_AUTOTEST = "-autotest";
var ARG_DEV_BUILD = "-dev";
var ARG_LIVE_BUILD = "-live";
var ARG_DUAL_CORE = "-dualcore";

var VAR_DUAL_CODE_MODE = "DUALCORE_MODE";

var BASE_CONSTANTS_FILE = "src_const/base.js";
var DEV_CONSTANTS_FILE = "src_const/dev.js";
var LIVE_CONSTANTS_FILE = "src_const/live.js";
var BASE_STUB_FILE = "src_const/stub.js";

function log_message(msg) {
  console.log("[BUILD] " + msg);
}

function check_working_directory() {
  if (process.cwd().indexOf("src_builder") != -1) {
    process.chdir('../');
    log_message("change into root directory");
  }
}

function in_program_arguments(arg) {
  return process.argv.indexOf(arg) != -1;
}

function is_in_development_mode() {
  return in_program_arguments(ARG_DEV_BUILD);
}

function is_in_live_mode() {
  return in_program_arguments(ARG_LIVE_BUILD);
}

function is_in_autotest_mode() {
  return in_program_arguments(ARG_AUTOTEST);
}

function is_in_workers_mode() {
  return in_program_arguments(ARG_DUAL_CORE);
}

function check_program_arguments() {
  var counter;

  counter = 0 + (is_in_live_mode() ? 1 : 0) + (is_in_development_mode() ? 1 : 0);
  if (counter !== 1) {
    print_program_info();
    process.exit();
  }
}

function print_program_info() {
  log_message("cannot build game with the given arguments!");
  log_message("");
  log_message("correct usage:");
  log_message("  node build.js (" + ARG_DEV_BUILD + "|" + ARG_LIVE_BUILD + ") (" + ARG_AUTOTEST + ")? (" + ARG_DUAL_CORE + ")?");
  log_message("");
  log_message("parameters:");
  log_message(ARG_DEV_BUILD + " :: All development statements will be included in the build");
  log_message(ARG_LIVE_BUILD + " :: The build does not contains any development statements");
  log_message(ARG_AUTOTEST + " :: The build will run acceptance tests on startup");
  log_message(ARG_DUAL_CORE + " :: The build will be optimized for multicore systems");
}

function cleanup_dist_folder() {
  build_tools.wipeFolderContent(DESTINATION_DIRECTORY);
}

function insert_core_files_into_buffer(buffer) {
  build_tools.readFile(buffer, BASE_STUB_FILE);
  build_tools.readFile(buffer, BASE_CONSTANTS_FILE);
  buffer.append("cwt.CONST_" + VAR_DUAL_CODE_MODE + " = " + (is_in_workers_mode() ? "true" : "false") + "; \r\n");
  build_tools.readFile(buffer, is_in_development_mode() ? DEV_CONSTANTS_FILE : LIVE_CONSTANTS_FILE);
  build_tools.readFolder(buffer, SOURCE_DIRECTORY + "/core");
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/events/events.js");
}

function insert_game_files_into_buffer(buffer) {
  build_tools.readFolder(buffer, SOURCE_DIRECTORY + "/game");
  build_tools.readFolder(buffer, SOURCE_DIRECTORY + "/game/commands");
}

function insert_user_interface_files_into_buffer(buffer) {
  build_tools.readFolder(buffer, SOURCE_DIRECTORY + "/controller/states");
  build_tools.readFolder(buffer, SOURCE_DIRECTORY + "/controller/input");
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/controller/main.js");
}

function insert_test_files_into_buffer(buffer) {
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/test/test_core.js");
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/test/test_commands.js");
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/test/game_test.js");
}

function write_main_game_js_file() {
  var buffer;

  log_message("creating bundled game source");
  buffer = new build_tools.StringBuilder();

  insert_core_files_into_buffer(buffer);
  insert_game_files_into_buffer(buffer);
  insert_user_interface_files_into_buffer(buffer);
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/events/fake_handler.js");
  if (is_in_autotest_mode()) {
    insert_test_files_into_buffer(buffer);
  }

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + GAME_JS_FILE);
}

function write_client_thread_js_file() {
  var buffer;

  log_message("creating frontend thread source");
  buffer = new build_tools.StringBuilder();

  insert_core_files_into_buffer(buffer);
  insert_user_interface_files_into_buffer(buffer);
  buffer.append("cwt.CONST_GAME_TH_FILE = '" + GAME_THREAD_JS_FILE + "';");
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/events/controller_handler.js");
  if (in_program_arguments(ARG_AUTOTEST)) {
    insert_test_files_into_buffer(buffer);
  }

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + USER_INTERFACE_THREAD_JS_FILE);
}

function write_game_thread_js_file() {
  var buffer;

  log_message("creating game thread source");

  buffer = new build_tools.StringBuilder();
  insert_core_files_into_buffer(buffer);
  insert_game_files_into_buffer(buffer);
  build_tools.readFile(buffer, SOURCE_DIRECTORY + "/events/game_handler.js");

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + GAME_THREAD_JS_FILE);
}

function write_game_files() {
  if (is_in_workers_mode()) {
    write_game_thread_js_file();
    write_client_thread_js_file();
  } else {
    write_main_game_js_file();
  }
}

function write_game_css_file() {
  var buffer;

  log_message("creating game style sheet");
  buffer = new build_tools.StringBuilder();

  // still empty :[

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + GAME_CSS_FILE);
}

function write_game_html_file() {
  var buffer;

  log_message("creating game html");

  buffer = new build_tools.StringBuilder();

  buffer.append("<html><head> \r\n");
  buffer.append("<link href='" + GAME_CSS_FILE + "' rel='stylesheet' type='text/css' /> \r\n");

  if (is_in_development_mode()) {
    buffer.append("<div id='fpsCounter' style='position: absolute; top: 10px; lef: 10px;'></div>\r\n");
  }

  if (in_program_arguments(ARG_DUAL_CORE)) {
    buffer.append("<script type='text/javascript' src='" + USER_INTERFACE_THREAD_JS_FILE + "'></script>    \r\n");
  } else {
    buffer.append("<script type='text/javascript' src='" + GAME_JS_FILE + "'></script>    \r\n");
  }

  buffer.append("<script type='text/javascript'>cwt.main();</script>    \r\n");
  buffer.append("</head><body></body></html> \r\n");

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + GAME_HTML_FILE);
}

function build_game() {
  check_program_arguments();

  log_message("building CustomWars: Tactics");

  log_message("checking environment");
  check_working_directory();

  log_message("preparing folders");
  cleanup_dist_folder();

  log_message("deploying files");
  write_game_files();
  write_game_css_file();
  write_game_html_file();

  log_message("done");
}

build_game();