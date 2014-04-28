var buildLib = require("./buildLibrary");

// var HEAD = "<script type='application/javascript' src='../../";
// var TAIL = "'></script>";

var HEAD = "loadFile('../../";
var TAIL = "');";

function getFilesOfFolder (folder) {
  buildLib.getFileList(folder).forEach(function (file) {
    if (file.indexOf(".") !== -1) {
      console.log(HEAD+file+TAIL);
    } else {
      getFilesOfFolder(file);
    }
  });
}

getFilesOfFolder("gameSrc");
getFilesOfFolder("libJs");