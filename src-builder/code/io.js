const fs = require('fs');
const optional = require("./optional").optional;

var simpleReader = {

  _fileList(path) {
    var result = fs.readdirSync(path);
    for (var i = 0, e = result.length; i < e; i++) {
      result[i] = path + "/" + result[i];
    }
    return result;
  },

  readFile(buffer, file) {
    const preResult = this.preProcessor(file);
    const post = () => this.postProcessor(file, fs.readFileSync(file).toString());
    buffer.push(optional(preResult).orElseGet(post));
    return this;
  },

  readFolder(buffer, folder, filter) {
    this._fileList(folder).forEach((file, i) => {
      if (!filter || !filter(file)) {
        if (fs.lstatSync(file).isFile()) {
          this.readFile(buffer, file);
          buffer.push("\r\n");
        }
      }
    });
    return this;
  },

  readFilesToBuffer(buffer, files) {
    files.forEach(file => this.readFile(buffer, file));
    return this;
  },

  readFoldersToBuffer(buffer, directories) {
    directories.forEach(dir => this.readFolder(buffer, dir));
    return this;
  }
};

exports.produceReader = function(preProcessor, postProcessor) {
  return Object.assign(Object.create(simpleReader), {
    preProcessor: optional(preProcessor).orElse(file => null),
    postProcessor: optional(postProcessor).orElse((file, code) => code)
  });
};

exports.writeCodeToFile = function(path, code) {
  var out = fs.openSync(path, 'w+');
  fs.writeSync(out, code);
  fs.closeSync(out);
};

exports.bufferToCode = (buffer) => buffer.join("");

exports.deleteFolderContent = function(path) {
  var files = [];
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      var curPath = path + "/" + file;

      if (fs.statSync(curPath).isDirectory()) {
        exports.deleteFolderContent(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  } else {
    fs.mkdirSync(path);
  }
};

var folderView = {
  filePath(file) {
    return this.folder + "/" + file;
  },

  subFolderPath(folder) {
    return this.folder + "/" + folder;
  },

  path() {
    return this.folder;
  }
};

exports.folderView = function(folder, file) {
  return Object.assign(Object.create(folderView), {
    folder: folder
  });
};