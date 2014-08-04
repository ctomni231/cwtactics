var localforage = require("../libJs/localForage");

//
//
var IOS7_WEBSQL_BUGFIX_SIZE = 4;

//
//
var DEFAULT_DB_SIZE = 50;

// configures the localforage library
localforage.config({
  name: "CWT_DATABASE",
  size: (require("./systemFeatures").iosWebSQLFix ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE) * 1024 * 1024
});

// The given **callback** will be invoked with the value saved by the given **key**.
//
exports.get = function (key, callback) {
  localforage.getItem(key, callback);
};

// Saves a **value** with a given **key**. If the **key** exists, then the old value will be overwritten. After the
// save process, the **callback** will be invoked.
//
exports.set = function (key, value, callback) {
  localforage.setItem(key, value, function (res, error) {

    // try a second time when fail at the first time because on ios the question
    // for more storage invokes an error => we don't want to need to reload then
    if (error) {
      localforage.setItem(key, value, callback);
    } else {
      callback(res);
    }
  });
};

// The given **callback** will be invoked with a list of all keys that are saved in the storage.
//
exports.keys = function (callback) {
  localforage.keys(callback);
};

// Clears all values from the storage. The given **callback** will be invoked afterwards.
//
exports.clear = function (callback) {
  localforage.clear(callback);
};

// Removes a **key** including the saved value from the storage. The given **callback** will be invoked afterwards.
//
exports.remove = function (key, callback) {
  localforage.removeItem(key, callback);
};