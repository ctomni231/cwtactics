exports.getUiFolders = function(sourceFolder, constantsFolder, mode, multicore) {
  var folders = [];
  folders.push(constantsFolder.path());
  folders.push(constantsFolder.subFolderPath(mode === "dev" ? "dev" : "live"));
  folders.push(sourceFolder.subFolderPath("core"));
  folders.push(sourceFolder.subFolderPath("controller"));
  folders.push(sourceFolder.subFolderPath("controller/core"));
  folders.push(sourceFolder.subFolderPath("controller/input"));
  folders.push(sourceFolder.subFolderPath("controller/states"));
  if (multicore) folders.push(sourceFolder.subFolderPath("controller/multicore"));
  return folders;
};

exports.getGameFolders = function(sourceFolder, constantsFolder, mode, multicore) {
  var folders = [];
  folders.push(constantsFolder.path());
  folders.push(constantsFolder.subFolderPath(mode === "dev" ? "dev" : "live"));
  folders.push(sourceFolder.subFolderPath("core"));
  folders.push(sourceFolder.subFolderPath("game"));
  folders.push(sourceFolder.subFolderPath("game/model"));
  folders.push(sourceFolder.subFolderPath("game/modelSerializer"));
  if (multicore) folders.push(sourceFolder.subFolderPath("game/multicore"));
  if (mode == "dev") {
    folders.push(sourceFolder.subFolderPath("test"));
    folders.push(sourceFolder.subFolderPath("test/game-test"));
  }
  return folders;
};
