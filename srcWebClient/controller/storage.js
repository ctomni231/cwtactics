//
//
controller.storage_SIZES = {
  maps:   10,
  assets: 40,
  general: 5
};

//
//
controller.storage_NAMES = {
  maps:    "MAPS",
  assets:  "ASSETS",
  general: "GENERAL"
};

controller.storage_type = (browser.mobile)? 'webkit-sqlite':'indexed-db';

// Creates a new
//
controller.storage_create = function( name, sizeMb, cb ){
  var store = new Lawnchair({
      adaptor : controller.storage_type,
      maxSize : sizeMb*1024*1024,
      name    : name
    },
    function(){
      cb({
        get     : function( key, cb ){        store.get( key, cb ); },
        has     : function( key, cb ){        store.exists( key, cb ); },
        set     : function( key, value, cb ){ store.save({ key : key, value : value }, cb ); },
        keys    : function( cb ){             store.keys(cb); },
        clear   : function( cb ){             store.nuke(cb); },
        remove  : function( key, cb ){        store.remove( key, cb ); }
      });
    }
  );
};

// Initializes the storage system.
//
controller.storage_initialize = function( p,mb ){
  mb.take();

  jWorkflow
    .order(function( p,b ){
      b.take();
      controller.storage_create(
        controller.storage_NAMES.maps,
        controller.storage_SIZES.maps,
        function( str ){
          controller.storage_maps = str;
          b.pass();
        }
      );
    })
    .andThen(function( p,b ){
      b.take();
      controller.storage_create(
        controller.storage_NAMES.assets,
        controller.storage_SIZES.assets,
        function( str ){
          controller.storage_assets = str;
          b.pass();
        }
      );
    })
    .andThen(function( p,b ){
      b.take();
      controller.storage_create(
        controller.storage_NAMES.general,
        controller.storage_SIZES.general,
        function( str ){
          controller.storage_general = str;
          b.pass();
        }
      );
    })
    .start(function( r ){
      if( r ) ; // ERROR

      mb.pass();
    });
};

// Storage for maps.
//
controller.storage_maps    = null;

// Storage for assets data like images and sounds.
//
controller.storage_assets  = null;

// Storage for general data like settings.
//
controller.storage_general = null;

// Link to `controller.storage_general`. Deprecated!
//
controller.storage         = null;