const io = require("./code/io");
const log = require("./code/log").log;
const content = require("./code/contentfolders");
const parameter = require("./code/paramters").analyeParameter;
const esNextTranspiler = require("./code/esNext").convertToES2015;
const cache = require("./code/cache");
const watcher = require("./code/watcher").produceFileWatcher;

process.on('uncaughtException', err => log("failed to build game => " + err.message));

const helpWanted = parameter("help", "flag", false);

if (helpWanted) {
  var charString = (key) => ("         " + key).slice(-10);
  var printParameterLine = (key, values, doc) => log([charString(key), charString(values), doc].join(" - "));

  log("node build.js ...parameters");
  log("");
  log("parameters:");
  printParameterLine("mode", "dev|live", "no difference atm...");
  printParameterLine("watch", "flag", "the program invokes a new build on file change");
  printParameterLine("singlecore", "flag", "the game will not be optimised for multi-core processors");
  printParameterLine("nocache", "flag", "no cached es6 code will be used from previous builds (enabled mode=live)");

  process.exit();
}

const builderFolder = io.folderView("src-builder");

if (process.cwd().indexOf(builderFolder.path()) != -1) process.chdir('../');

const buildMode = parameter("mode", "value", "dev", ["dev", "live"]);
const watchMode = parameter("watch", "flag", false);
const workerMode = !parameter("singlecore", "flag", false);
const traceMode = parameter("trace", "flag", false);
const noCacheMode = parameter("nocache", "flag", buildMode === "live");

const constantsFolder = io.folderView("src-constants");
const sourceFolder = io.folderView("src-cwt");
const destinationFolder = io.folderView("dist");

const jsCacheFile = builderFolder.filePath("cwt-code-cache.json");

const uiFolders = content.getUiFolders(sourceFolder, constantsFolder, buildMode, workerMode);
const gameFolders = content.getGameFolders(sourceFolder, constantsFolder, buildMode, workerMode);
const htmlFolder = io.folderView(sourceFolder.subFolderPath("html"));

const jsCache = noCacheMode ? {} : cache.readCacheFile(jsCacheFile);
const jsPreProcessors = [(file) => null];
const jsPostProcessors = [(file, code) => "(function(cwt) {\n" + code + "\n}(cwt));\n", esNextTranspiler];

if (!noCacheMode) {
  jsPreProcessors.push(cache.jsPreProcessor.bind(null, jsCache));
  jsPostProcessors.push(cache.jsPostProcessor.bind(null, jsCache));
}

const codeCreateCwtObject = "var cwt = cwt || {};\n";

const jsReader = io.produceReader(
  (file) => jsPreProcessors.reduce((prev, processor) => processor(file), file),
  (file, code) => jsPostProcessors.reduce((prevCode, processor) => processor(file, prevCode), code)
);

const htmlReader = io.produceReader();

const startBuild = function() {
  try {
    log("---- STARTED BUILD ----");
    log("preparing folders");
    io.deleteFolderContent(destinationFolder.path());

    log("building controller");
    var uiCodeBuffer = [codeCreateCwtObject];
    jsReader.readFoldersToBuffer(uiCodeBuffer, uiFolders);
    io.writeCodeToFile(destinationFolder.filePath("ui.js"), io.bufferToCode(uiCodeBuffer));

    log("building game");
    var gameCodeBuffer = [codeCreateCwtObject];
    jsReader.readFoldersToBuffer(gameCodeBuffer, gameFolders);
    io.writeCodeToFile(destinationFolder.filePath("game.js"), io.bufferToCode(gameCodeBuffer));

    log("building browser css");
    var cssBuffer = [];
    htmlReader.readFilesToBuffer(cssBuffer, [htmlFolder.filePath("game.css")]);
    io.writeCodeToFile(destinationFolder.filePath("game.css"), io.bufferToCode(cssBuffer));

    log("building browser html");
    var htmlStubBuffer = [];
    var htmlScriptsBuffer = [];
    htmlReader.readFilesToBuffer(htmlStubBuffer, [htmlFolder.filePath("stub.html")]);
    htmlReader.readFilesToBuffer(htmlScriptsBuffer, [htmlFolder.filePath(workerMode ? "multicore.html" : "singlecore.html")]);
    var html = io.bufferToCode(htmlStubBuffer).replace("$SCRIPTS$", io.bufferToCode(htmlScriptsBuffer));
    io.writeCodeToFile(destinationFolder.filePath("game.html"), html);

    if (!noCacheMode) {
      log("update js cache");
      cache.writeCacheFile(jsCacheFile, jsCache);
    }

    log("successfully created game");
  } catch (e) {
    log("failed to create game => " + e.message);
  }
};

log("build mode " + buildMode + " selected");
if (watchMode) {
  log("watching for file changes");
  watcher(sourceFolder.path(), startBuild, true);

} else {
  startBuild();
}