/**
 * @class
 */
cwt.Storage = my.Class(/** @lends cwt.Storage.prototype */ {

  STATIC: /** @lends cwt.Storage */ {

    /**
     * @constant
     */
    IOS7_WEBSQL_BUGFIX_SIZE: 4,

    /**
     * @constant
     */
    STORAGE_MAPS: "MAPS",

    /**
     * @constant
     */
    STORAGE_ASSETS: "ASSETS",

    /**
     * @constant
     */
    STORAGE_GENERAL: "GENERAL",

    /**
     * @constant
     */
    STORAGE_MAPS_SIZE: 10,

    /**
     * @constant
     */
    STORAGE_ASSETS_SIZE: 40,

    /**
     * @constant
     */
    STORAGE_GENERAL_SIZE: 5,

    /**
     * Storage for general aw2 like settings.
     *
     * @type {cwt.Storage}
     */
    generalStorage: null,

    /**
     * Storage for maps.
     *
     * @type {cwt.Storage}
     */
    mapStorage: null,

    /**
     * Storage for assets aw2 like images and sounds.
     *
     * @type {cwt.Storage}
     */
    assetsStorage: null,

    /**
     * Initializes the storage system.
     *
     * @param {Function} callback
     */
    initialize: function (callback) {
      var storage_type = (cwt.ClientFeatures.touch) ? 'webkit-sqlite' : 'indexed-db';
      var createInstance = function (name, sizeMb, storage_type, cb) {
        var store = new Lawnchair({
            adaptor: storage_type,
            maxSize: (cwt.ClientFeatures.iosWebSQLFix ?
              cwt.Storage.IOS7_WEBSQL_BUGFIX_SIZE : sizeMb ) * 1024 * 1024,
            name: name
          },
          cb
        );
      };

      // creates the creator function
      function createStorage(name, size, prop) {
        return function (next) {
          createInstance(name, size, storage_type, function (adapter) {
            cwt.Storage[prop] = adapter;
            next();
          });
        }
      }

      // create all storage object
      callAsSequence([
          createStorage(cwt.Storage.STORAGE_MAPS, cwt.Storage.STORAGE_MAPS_SIZE, "mapStorage"),
          createStorage(cwt.Storage.STORAGE_ASSETS, cwt.Storage.STORAGE_ASSETS_SIZE, "assetsStorage"),
          createStorage(cwt.Storage.STORAGE_GENERAL, cwt.Storage.STORAGE_GENERAL_SIZE, "generalStorage")
        ], function () {
          if (callback) {
            callback();
          }
        }
      );

      // remove initializer function (never called again)
      delete cwt.Storage.initialize;
    },

    /**
     * Nukes the storage objects.
     *
     * @param {Function} callback
     */
    wipeOutAll: function (callback) {
      function wipeOutStorage(storage) {
        return function (next) {
          storage.clear(next);
        };
      };

      callAsSequence([
        wipeOutStorage(cwt.Storage.generalStorage),
        wipeOutStorage(cwt.Storage.assetsStorage),
        wipeOutStorage(cwt.Storage.mapStorage)
      ], callback );
    }
  },

  constructor: function (store) {
    this.store = store;
  },

  /**
   *
   * @param key
   * @param cb
   */
  get: function (key, cb) {
    this.store.get(key, cb);
  },

  /**
   *
   * @param key
   * @param cb
   */
  has: function (key, cb) {
    this.store.exists(key, cb);
  },

  /**
   *
   * @param key
   * @param cb
   */
  exists: function (key, cb) {
    this.store.exists(key, cb);
  },

  /**
   * Saves a value with a given key. If the key exists, then the old value
   * will be overwritten. After the save process, the callback cb will be
   * invoked.
   *
   * @param {String} key
   * @param {*} value
   * @param {Function} cb
   */
  set: function (key, value, cb) {
    this.store.save({ key: key, value: value }, cb, /* error function */ function () {

      // try a second time when fail at the first time because
      // on ios the question for more storage invokes an error
      //  => we don't want to need to reload then
      this.store.save({ key: key, value: value }, cb);
    });
  },

  /**
   *
   * @param cb
   */
  keys: function (cb) {
    this.store.keys(cb);
  },

  /**
   *
   * @param cb
   */
  clear: function (cb) {
    this.store.nuke(cb);
  },

  /**
   *
   * @param key
   * @param cb
   */
  remove: function (key, cb) {
    this.store.remove(key, cb);
  }
});