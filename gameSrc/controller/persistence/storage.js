/**
 * @class
 */
cwt.Storage = my.Class( /** @lends cwt.Storage.prototype */ {

  STATIC: /** @lends cwt.Storage */ {

    IOS7_WEBSQL_BUGFIX_SIZE: 4,

    STORAGE_MAPS: "MAPS",
    STORAGE_ASSETS: "ASSETS",
    STORAGE_GENERAL: "GENERAL",

    STORAGE_MAPS_SIZE: 10,
    STORAGE_ASSETS_SIZE: 40,
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
     * @param p
     * @param mb
     */
    initialize: function (p, mb) {
      mb.take();

      var storage_type = (cwt.ClientFeatures.touch) ?
        'webkit-sqlite' : 'indexed-db';

      // creates the creator function
      function createStorage (name,size,prop) {
        return function (next) {
          cwt.Storage.create(name,size,storage_type,function ( adapter ) {
            cwt.Storage[prop] = adapter;
            next();
          });
        }
      }

      // create all storages
      callAsSequence([
        createStorage(cwt.Storage.STORAGE_MAPS,cwt.Storage.STORAGE_MAPS_SIZE,"mapStorage"),
        createStorage(cwt.Storage.STORAGE_ASSETS,cwt.Storage.STORAGE_ASSETS_SIZE,"assetsStorage"),
        createStorage(cwt.Storage.STORAGE_GENERAL,cwt.Storage.STORAGE_GENERAL_SIZE,"generalStorage")
      ],function(){
        mb.pass();
      });
    },

    /**
     * Creates a new storage module.
     *
     * @param name
     * @param sizeMb
     * @param storage_type
     * @param cb
     */
    create: function (name, sizeMb, storage_type, cb) {
      var store = new Lawnchair({
          adaptor: storage_type,
          maxSize: (cwt.ClientFeatures.iosWebSQLFix ?
            cwt.Storage.IOS7_WEBSQL_BUGFIX_SIZE : sizeMb ) * 1024 * 1024,
          name: name
        },
        cb
      );
    },

    /**
     * Nukes the storages.
     */
    wipeOutAll: function (cb) {
      function wipeOutStorage(storage) {
        return function (next) {
          storage.clear(next);
        };
      };

      callAsSequence([
        wipeOutStorage(cwt.Storage.generalStorage),
        wipeOutStorage(cwt.Storage.assetsStorage),
        wipeOutStorage(cwt.Storage.mapStorage)
      ],cb);
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