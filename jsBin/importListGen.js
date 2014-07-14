var buildLib = require("./buildLibrary");

var HEAD = "loadFile('../../";
var TAIL = "');";
if (process.argv[2] === "html") {
  HEAD = "<script type='application/javascript' src='../../";
  TAIL = "'></script>";
}

function getFilesOfFolder (folder) {
  buildLib.getFileList(folder).forEach(function (file) {
    if (file.indexOf(".") !== -1) {

      // ignore .DS_Store files
      if (file.indexOf(".DS_Store") === -1) {
          console.log(HEAD+file+TAIL);
      }
    } else {

      // ignore html folder
      if (file.indexOf("html") === -1) {
        getFilesOfFolder(file);
      }
    }
  });
}

getFilesOfFolder("gameSrc");
getFilesOfFolder("libJs");
