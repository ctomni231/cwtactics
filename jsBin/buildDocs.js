var builder = require("./buildLibrary.js");

builder.deleteFolderRecursive("../doc");
builder.createFolder("../doc");

builder.doCommand(
  "node /Volumes/Home/alex/node_modules/jsdoc/jsdoc.js " +
    "../gameSrc " +
    "-r " +
    "-c doc.json " +
   // "-t /Volumes/Home/alex/node_modules/jsdoc/templates/jaguarjs-jsdoc-master " +
    "-d ./../doc "
);
