const log = require("./log").log;
const io = require("./io");
const fs = require('fs');

exports.readCacheFile = function(file) {
  try {
    return JSON.parse(fs.readFileSync(file).toString());
  } catch (e) {
    return {};
  }
};

exports.writeCacheFile = function(file, cache) {
  io.writeCodeToFile(file, JSON.stringify(cache));
};

exports.jsPreProcessor = function(cache, file) {
  var cacheEntry = cache[file];
  var cacheLastModified = cacheEntry ? cacheEntry.lastModified : 0;
  var lastModified = fs.lstatSync(file).mtime.getTime();
  return lastModified === cacheLastModified ? cacheEntry.code : null;
};

exports.jsPostProcessor = function(cache, file, code) {
  var lastModified = fs.lstatSync(file).mtime.getTime();
  cache[file] = {
    code,
    lastModified
  }
  return code;
};