const fs = require('fs');
const util = require('util');
const isWindows = (process.platform === 'win32');
const readline = require('readline');
const es6CS = require("es6-class");
const es6AF = require("es6-arrow-function");
const es6OS = require("es6-object-short");
const es6OC = require("es6-object-concise");
const es6DP = require("es6-default-params");

const ARG_TRACE_MODE = "-trace";

exports.log_message = function(msg) {
  console.log("[BUILD] " + msg);
};

exports.in_program_arguments = function(arg) {
  return process.argv.indexOf(arg) != -1;
};

exports.is_in_trace_mode = function() {
  return exports.in_program_arguments(ARG_TRACE_MODE);
};

exports.maskPathSlashes = function(path) {
  if (isWindows) {
    return path.replace(/\//g, "\\");
  } else {
    return path;
  }
};

exports.requireNonNull = function(obj, error) {
  if (obj === undefined || obj == null) {
    throw new Error(error || "ValueNotPresent");
  }
  return obj;
};


exports.wipeFolderContent = function(path) {
  var files = [];
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;

      if (fs.statSync(curPath).isDirectory()) {
        exports.wipeFolderContent(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  } else {
    fs.mkdirSync(path);
  }
};

exports.StringBuilder = function() {
  this.strings = [];
};

exports.StringBuilder.prototype.append = function(str) {
  this.strings.push(exports.requireNonNull(str));
  return this;
};

exports.StringBuilder.prototype.appendNewLine = function() {
  this.strings.push("\n");
  return this;
};

exports.StringBuilder.prototype.toString = function() {
  return this.strings.join("");
};

exports.readFolderFileList = function(path) {
  var result = fs.readdirSync(path);
  for (var i = 0, e = result.length; i < e; i++) {
    result[i] = path + "/" + result[i];
  }

  return result;
};

/**
 *
 * @param   {exports.StringBuilder} builder string builder
 * @param   {string}                 path    path that will be readed
 * @param   {function()}             filter  if filter returns false, then the current selected file
 *                                           will be ignored
 * @returns {exports.StringBuilder} builder
 */
exports.readFolder = function(builder, path, filter) {
  exports.readFolderFileList(path).forEach(function(file, i) {
    if (!filter || !filter(file)) {
      if (fs.lstatSync(file).isFile()) {
        exports.readFile(builder, file);
        builder.append("\r\n");
      }
    }
  });
  return builder;
};

exports.readFile = function(builder, path) {
  builder.append(fs.readFileSync(path).toString());
  return builder;
};

exports.writeFile = function(code, path) {
  var out = fs.openSync(path, 'w+');
  fs.writeSync(out, code);
  fs.closeSync(out);
};

exports.convertCodeFromES6toES5 = function(code) {
  try {
    code = es6CS.compile(code).code;
    code = es6AF.compile(code).code;
    code = es6OS.compile(code).code;
    code = es6OC.compile(code).code;
    code = es6DP.compile(code).code;

    return code;

  } catch (e) {
    exports.log_message("ERROR: cannot convert es6 source back to es5 [" + e.message + "]");
    exports.writeFile(buffer, DESTINATION_DIRECTORY + "/error_source.js");
    const errorLine = parseInt(e.message.substr(5, e.message.indexOf(":") - 5), 10);

    var lineCounter = 0;
    readline.createInterface({
      input: fs.createReadStream(DESTINATION_DIRECTORY + "/error_source.js")
    }).on('line', function(line) {
      lineCounter++;
      if ((errorLine > 0 && lineCounter == errorLine - 1) || (lineCounter == errorLine) || (lineCounter == errorLine + 1)) {
        exports.log_message("ERROR: ...[" + lineCounter + "] " + line);
      }
    }).on("end", function() {
      process.exit();
    });
  }
}

exports.JSCacheReader = function(cachePath, wipe) {
  this.path = cachePath;
  this.cache = {};
  if (!wipe) {
    try {
      var buffer = new exports.StringBuilder();
      exports.readFile(buffer, ".cwt-build-cache");
      this.cache = JSON.parse(buffer.toString());
    } catch (e) {
      exports.log_message("no or invalid code cache found, generating new one");
    }
  }
};

exports.JSCacheReader.prototype.readFile = function(buffer, path) {
  var cacheEntry = this.cache[path];
  var cacheLastModified = cacheEntry ? cacheEntry.lastModified : 0;
  var fileLastModified = fs.lstatSync(path).mtime.getTime();

  if (fileLastModified > cacheLastModified) {
    if (exports.is_in_trace_mode()) {
      exports.log_message("generating new cache for " + path);
    }

    var code = fs.readFileSync(path).toString();
    code = exports.convertCodeFromES6toES5(code);
    
    buffer.append(code);
    this.cache[path] = {
      code: code,
      lastModified: fileLastModified
    }

  } else {
    if (exports.is_in_trace_mode()) {
      exports.log_message("using cached code for " + path);
    }

    buffer.append(cacheEntry.code);
  }
};

exports.JSCacheReader.prototype.readFolder = function(buffer, path) {
  exports.readFolderFileList(path).forEach((function(file, i) {
    if (fs.lstatSync(file).isFile()) {
      this.readFile(buffer, file);
    }
  }).bind(this));
};

exports.JSCacheReader.prototype.flushCacheToDisk = function() {
  exports.writeFile(JSON.stringify(this.cache), this.path);
};
