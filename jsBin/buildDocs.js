// delete dist
require("./buildLibrary.js").deleteFolderRecursive(	"dist/nightly/docs");
require("./buildLibrary.js").createFolder(			"dist/nightly/docs");
require("./buildLibrary.js").deleteFolderRecursive(	"dist/nightly/docsClient");
require("./buildLibrary.js").createFolder(			"dist/nightly/docsClient");

// build docs
require("./buildEngineDocs.js");
require("./buildClientDocs.js");
