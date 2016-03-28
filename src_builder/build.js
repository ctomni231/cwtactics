/*global require,process,console*/

const DESTINATION_DIRECTORY = "dist";
const SOURCE_DIRECTORY = "src_new";

const USER_INTERFACE_THREAD_JS_FILE = "game_th_main.js";
const GAME_THREAD_JS_FILE = "game_th_game.js";
const GAME_JS_FILE = "game.js";
const GAME_CSS_FILE = "game.css";
const GAME_HTML_FILE = "game.html";

const ARG_AUTOTEST = "-test";
const ARG_DEV_BUILD = "-dev";
const ARG_LIVE_BUILD = "-live";
const ARG_DUAL_CORE = "-multicore";
const ARG_CLEAN_CACHE = "-wipecache";

const VAR_DUAL_CODE_MODE = "DUALCORE_MODE";

const BASE_CONSTANTS_FILE = "src_const/base.js";
const DEV_CONSTANTS_FILE = "src_const/dev.js";
const LIVE_CONSTANTS_FILE = "src_const/live.js";
const BASE_STUB_FILE = "src_const/stub.js";

const build_tools = require("./lib");
var reader;

function check_working_directory() {
  if (process.cwd().indexOf("src_builder") != -1) {
    process.chdir('../');
    build_tools.log_message("change into root directory");
  }
}

function is_in_development_mode() {
  return build_tools.in_program_arguments(ARG_DEV_BUILD);
}

function is_in_live_mode() {
  return build_tools.in_program_arguments(ARG_LIVE_BUILD);
}

function is_in_autotest_mode() {
  return build_tools.in_program_arguments(ARG_AUTOTEST);
}

function is_in_workers_mode() {
  return build_tools.in_program_arguments(ARG_DUAL_CORE);
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
  build_tools.log_message("cannot build game with the given arguments!");
  build_tools.log_message("");
  build_tools.log_message("correct usage:");
  build_tools.log_message("  node build.js (" + ARG_DEV_BUILD + "|" + ARG_LIVE_BUILD + ") (" + ARG_AUTOTEST + ")? (" + ARG_DUAL_CORE + ")?");
  build_tools.log_message("");
  build_tools.log_message("parameters:");
  build_tools.log_message("-dev        => All development statements will be included in the build");
  build_tools.log_message("-live       => The build does not contains any development statements");
  build_tools.log_message("-test       => The build will run acceptance tests on startup");
  build_tools.log_message("-multicore  => The build will be optimized for multicore systems");
  build_tools.log_message("-wipecache  => The build will create a new code cache for the ESNext convertion");
  build_tools.log_message("-trace      => The builder will log out more information... build will may be slower with this option");
}

function cleanup_dist_folder() {
  build_tools.wipeFolderContent(DESTINATION_DIRECTORY);
}

function insert_core_files_into_buffer(buffer) {
  reader.readFile(buffer, BASE_STUB_FILE);
  reader.readFile(buffer, BASE_CONSTANTS_FILE);
  buffer.append("cwt.CONST_" + VAR_DUAL_CODE_MODE + " = " + (is_in_workers_mode() ? "true" : "false") + "; \r\n");
  reader.readFile(buffer, is_in_development_mode() ? DEV_CONSTANTS_FILE : LIVE_CONSTANTS_FILE);
  reader.readFolder(buffer, SOURCE_DIRECTORY + "/core");
  reader.readFile(buffer, SOURCE_DIRECTORY + "/events/events.js");
}

function insert_game_files_into_buffer(buffer) {
  reader.readFolder(buffer, SOURCE_DIRECTORY + "/game");
  reader.readFolder(buffer, SOURCE_DIRECTORY + "/game/commands");
  reader.readFolder(buffer, SOURCE_DIRECTORY + "/game/model");
}

function insert_user_interface_files_into_buffer(buffer) {
  reader.readFolder(buffer, SOURCE_DIRECTORY + "/controller/states");
  reader.readFolder(buffer, SOURCE_DIRECTORY + "/controller/input");
  reader.readFile(buffer, SOURCE_DIRECTORY + "/controller/main.js");
}

function insert_test_files_into_buffer(buffer) {
  //reader.readFile(buffer, SOURCE_DIRECTORY + "/test/test_core.js");
  //reader.readFile(buffer, SOURCE_DIRECTORY + "/test/test_commands.js");
  //reader.readFile(buffer, SOURCE_DIRECTORY + "/test/game_test.js");

  reader.readFile(buffer, SOURCE_DIRECTORY + "/test/CommandTest.js");
  reader.readFile(buffer, SOURCE_DIRECTORY + "/test/GameConstructionTest.js");
}

function write_main_game_js_file() {
  var buffer;

  build_tools.log_message("creating bundled game source");
  buffer = new build_tools.StringBuilder();

  insert_core_files_into_buffer(buffer);
  insert_game_files_into_buffer(buffer);
  insert_user_interface_files_into_buffer(buffer);
  reader.readFile(buffer, SOURCE_DIRECTORY + "/events/fake_handler.js");
  if (is_in_autotest_mode()) {
    insert_test_files_into_buffer(buffer);
  }

  build_tools.writeFile(buffer, DESTINATION_DIRECTORY + "/" + GAME_JS_FILE);
}

function write_client_thread_js_file() {
  var buffer;

  build_tools.log_message("creating frontend thread source");
  buffer = new build_tools.StringBuilder();

  insert_core_files_into_buffer(buffer);
  insert_user_interface_files_into_buffer(buffer);
  buffer.append("cwt.CONST_GAME_TH_FILE = '" + GAME_THREAD_JS_FILE + "';");
  reader.readFile(buffer, SOURCE_DIRECTORY + "/events/controller_handler.js");
  if (in_program_arguments(ARG_AUTOTEST)) {
    insert_test_files_into_buffer(buffer);
  }

  build_tools.writeFile(buffer, DESTINATION_DIRECTORY + "/" + USER_INTERFACE_THREAD_JS_FILE);
}

function write_game_thread_js_file() {
  var buffer;

  build_tools.log_message("creating game thread source");

  buffer = new build_tools.StringBuilder();
  insert_core_files_into_buffer(buffer);
  insert_game_files_into_buffer(buffer);
  reader.readFile(buffer, SOURCE_DIRECTORY + "/events/game_handler.js");

  build_tools.writeFile(buffer, DESTINATION_DIRECTORY + "/" + GAME_THREAD_JS_FILE);
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

  build_tools.log_message("creating game style sheet");
  buffer = new build_tools.StringBuilder();

  if (is_in_autotest_mode()) {
    build_tools.readFile(buffer, SOURCE_DIRECTORY + "/test/ext/qunit.css");
  }

  // still empty :[

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + GAME_CSS_FILE);
}

function write_game_html_file() {
  var buffer;

  build_tools.log_message("creating game html");

  buffer = new build_tools.StringBuilder();

  buffer.append("<html><head> \r\n");
  buffer.append("<link href='" + GAME_CSS_FILE + "' rel='stylesheet' type='text/css' /> \r\n");

  if (is_in_autotest_mode()) {
    testbuffer = new build_tools.StringBuilder();
    build_tools.readFile(testbuffer, SOURCE_DIRECTORY + "/test/ext/qunit.js");
    build_tools.readFile(testbuffer, SOURCE_DIRECTORY + "/test/ext/jshamcrest.js", true);
    build_tools.readFile(testbuffer, SOURCE_DIRECTORY + "/test/ext/jsmockito.js");
    testbuffer.append("JsMockito.Integration.QUnit();");
    build_tools.writeFile(testbuffer.toString(), DESTINATION_DIRECTORY + "/test.js");
    buffer.append("<script type='text/javascript' src='test.js'></script>    \r\n");
  }

  if (build_tools.in_program_arguments(ARG_DUAL_CORE)) {
    buffer.append("<script type='text/javascript' src='" + USER_INTERFACE_THREAD_JS_FILE + "'></script>    \r\n");
  } else {
    buffer.append("<script type='text/javascript' src='" + GAME_JS_FILE + "'></script>    \r\n");
  }

  buffer.append("<script type='text/javascript'>cwt.main();</script>    \r\n");
  buffer.append("</head><body> \r\n");

  if (is_in_development_mode()) {
    buffer.append("<div id='fpsCounter' style='position: absolute; top: 10px; lef: 10px;'></div>\r\n");
  }

  if (is_in_autotest_mode()) {
    build_tools.readFile(buffer, SOURCE_DIRECTORY + "/test/ext/htmlCode.html");
  }

  buffer.append("</body></html> \r\n");

  build_tools.writeFile(buffer.toString(), DESTINATION_DIRECTORY + "/" + GAME_HTML_FILE);
}

function build_game() {
  check_program_arguments();

  build_tools.log_message("building 'CustomWars: Tactics'");

  build_tools.log_message("checking environment");
  check_working_directory();
  reader = new build_tools.JSCacheReader(".cwt-build-cache", build_tools.in_program_arguments(ARG_CLEAN_CACHE));

  build_tools.log_message("preparing folders");
  cleanup_dist_folder();

  build_tools.log_message("deploying files");
  write_game_files();
  write_game_css_file();
  write_game_html_file();

  build_tools.log_message("caching compiled code");
  reader.flushCacheToDisk();

  build_tools.log_message("done");
}

build_game();