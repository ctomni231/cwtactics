var buildLib = require("./buildLibrary.js");
var fs = require("fs");

console.log("starting convert procedure");

buildLib.getFileList("../gameSrc").forEach(function (dir) {
  if(dir.indexOf(".DS_Store") !== -1) return;
  if(dir.indexOf(".idea") !== -1) return;
  if(dir.indexOf(".md") !== -1) return;

  console.log("checking directory "+dir);

  buildLib.getFileList(dir).forEach(function (file) {
    if(file.indexOf(".js") === -1) return;

    console.log("converting file "+file);

    var content = fs.readFileSync( file ).toString();
    content = content
      .replace(/\/[*][*]/g,  "//"  )
      .replace(/\n\s+[*]\//g,"\n//")
      .replace(/\n\s+[*]/g,  "\n//");

    buildLib.writeToFile(content,file);
  });
});
