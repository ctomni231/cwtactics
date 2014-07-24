//
//
var IOS7_WEBSQL_BUGFIX_SIZE = 4;

//
//
var DEFAULT_DB_SIZE = 50;

// configures the localforage library
localforage.config({
  name: "CWT_DATABASE",
  size: (cwt.Config.features.iosWebSQLFix ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE) * 1024 * 1024
});

exports.get = function (key, cb) {
  localforage.getItem(key, cb);
};

// Saves a value with a given key. If the key exists, then the old value will be overwritten. After the
// save process, the callback cb will be invoked.
//
exports.set = function (key, value, cb) {
  localforage.setItem(key, value, function (res, error) {

    // try a second time when fail at the first time because on ios the question
    // for more storage invokes an error => we don't want to need to reload then
    if (error) {
      localforage.setItem(key, value, cb);
    } else {
      cb(res);
    }
  });
};

exports.keys = function (cb) {
  localforage.keys(cb);
};

exports.clear = function (cb) {
  localforage.clear(cb);
};

exports.remove = function (key, cb) {
  localforage.removeItem(key, cb);
};