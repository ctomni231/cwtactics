var builder = require("./buildLibrary.js");

builder.deleteFolderRecursive("../docs");
builder.createFolder("../docs");

builder.doCommand("docco ../gameSrc/*js -t doc.jst -c doc.css -o ../docs", function () {
  builder.doCommand("cp -r doc ../docs/public");
});