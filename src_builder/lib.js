var fs = require('fs');
var isWindows = (process.platform === 'win32');

var cwtBuild = {};

cwtBuild.maskPathSlashes = function (path) {
  if (isWindows) {
    return path.replace(/\//g, "\\");
  } else {
    return path;
  }
};

cwtBuild.requireNonNull = function (obj, error) {
  if (obj === undefined || obj == null) {
    throw new Error(error || "ValueNotPresent");
  }
  return obj;
};

cwtBuild.Flow = function () {
  this.jobs = [];
};

cwtBuild.Flow.prototype.doSync = function (job) {
  cwtBuild.requireNonNull(job);
  this.jobs.push(function (next) {
    job();
    next();
  });
  return this;
};

cwtBuild.Flow.prototype.doAsync = function (job) {
  this.jobs.push(cwtBuild.requireNonNull(job));
  return this;
};

cwtBuild.Flow.prototype.execute = function (whenDone) {
  var jobs = this.jobs;
  var currentIndex = 0;

  function invokeNext() {
    var job;

    if (currentIndex == jobs.length) {
      whenDone();

    } else {
      job = jobs[currentIndex];
      currentIndex++;

      job(invokeNext);
    }
  }

  invokeNext();
};

cwtBuild.wipeFolderContent = function (path) {
  var files = [];
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;

      if (fs.statSync(curPath).isDirectory()) {
        cwtBuild.wipeFolderContent(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  } else {
    fs.mkdirSync(path);
  }
};

cwtBuild.StringBuilder = function () {
  this.strings = [];
};

cwtBuild.StringBuilder.prototype.append = function (str) {
  this.strings.push(cwtBuild.requireNonNull(str));
  return this;
};

cwtBuild.StringBuilder.prototype.appendNewLine = function () {
  this.strings.push("\n");
  return this;
};

cwtBuild.StringBuilder.prototype.toString = function () {
  return this.strings.join("");
};

cwtBuild.readFolderFileList = function (path) {
  var result = fs.readdirSync(path);
  for (var i = 0, e = result.length; i < e; i++) {
    result[i] = path + "/" + result[i];
  }

  return result;
};

/**
 * 
 * @param   {cwtBuild.StringBuilder} builder string builder
 * @param   {string}                 path    path that will be readed
 * @param   {function()}             filter  if filter returns false, then the current selected file will be ignored
 * @returns {cwtBuild.StringBuilder} builder  
 */
cwtBuild.readFolder = function (builder, path, filter) {
  cwtBuild.readFolderFileList(path).forEach(function (file, i) {
    if (!filter || !filter(file)) {
      if (fs.lstatSync(file).isFile()) {
        cwtBuild.readFile(builder, file);
        builder.append("\r\n");
      }
    }
  });
  return builder;
};

cwtBuild.appendCodeHeader = function (builder) {
  builder.append("gameServices = {}; \r\n");
};

cwtBuild.readFile = function (builder, path) {
  var content, dotJsIndex;

  content = fs.readFileSync(path).toString();

  dotJsIndex = path.indexOf(".js");
  if (dotJsIndex != -1 && dotJsIndex == path.length - 3) {
    builder.append("(function(gameServices){");
    builder.append("\r\n");
    builder.append(content);
    builder.append("\r\n");
    builder.append("})(gameServices);");
    builder.append("\r\n");
  } else {
    builder.append(content);
  }
  return builder;
};

cwtBuild.writeFile = function (code, path) {
  var out = fs.openSync(path, 'w+');
  fs.writeSync(out, code);
  fs.closeSync(out);
};

exports.cwtBuild = cwtBuild;
