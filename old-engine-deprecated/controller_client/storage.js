// Sizes in megabytes for the different storage modules.
//
controller.storage_SIZES = {
  maps: 10,
  assets: 40,
  general: 5
};

// Internal names of the storage modules.
//
controller.storage_NAMES = {
  maps: "MAPS",
  assets: "ASSETS",
  general: "GENERAL"
};

// Storage for maps.
//
controller.storage_maps = null;

// Storage for assets data like images and sounds.
//
controller.storage_assets = null;

// Storage for general data like settings.
//
controller.storage_general = null;

// Creates a new storage module.
//
controller.storage_create = function (name, sizeMb, storage_type, cb) {
  var store = new Lawnchair({
      adaptor: storage_type,
      maxSize: sizeMb * 1024 * 1024,
      name: name
    },
    function () {
      cb({
        get: function (key, cb) {
          store.get(key, cb);
        },
        has: function (key, cb) {
          store.exists(key, cb);
        },
        exists: function (key, cb) {
          store.exists(key, cb);
        },
        set: function (key, value, cb) {
          store.save({
            key: key,
            value: value
          }, cb);
        },
        keys: function (cb) {
          store.keys(cb);
        },
        clear: function (cb) {
          store.nuke(cb);
        },
        remove: function (key, cb) {
          store.remove(key, cb);
        }
      });
    }
  );
};


// Nukes the storage.
//
controller.storage_wipeOut = function (cb) {
  function wipeoutStorage(flow, storage) {
    flow.andThen(function (_, b) {
      b.take();
      storage.clear(function () {
        b.pass();
      });
    });
  };

  var flow = jWorkflow.order();

  // clear storage blocks
  if (controller.storage_general) wipeoutStorage(flow, controller.storage_general);
  if (controller.storage_assets) wipeoutStorage(flow, controller.storage_assets);
  if (controller.storage_maps) wipeoutStorage(flow, controller.storage_maps);

  flow.start(function () {
    if (cb) cb();
  });
};
