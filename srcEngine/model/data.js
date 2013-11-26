// Creates a simple but extend able parser instance to validate javascript objects. This will be
// used to allow modules to set own requirements on object type sheets.
//
model.data_createParser = function( db, list ){
  var parserParts = [ ];
  var listFn = util.isFunction(list);

  // defines the public API
  return {

    // Adds a handler to the parser object.
    //
    addHandler: function( cb ){
      assert( util.isFunction(cb) );

      parserParts.push( cb );
    },
    
    // Parsing function that parses a type sheet and adds it to the type
    // list.
    //
    parse: function( sheet ){
      assert( util.isString(sheet.ID) );
      assert( !db.hasOwnProperty(sheet.ID) );

      // check sheet by calling all parser parts
      for( var i = 0, e = parserParts.length; i < e; i++ ) {
        parserParts[i]( sheet );
      }

      // add sheet to the type list
      if( listFn ) list( sheet );
      else list.push( sheet.ID );

      // add sheet to the database
      db[sheet.ID] = sheet;
    },

    // Parses all objects in a list.
    //
    parseAll: function( list ){
      for( var i = 0, e = list.length; i < e; i++ ) this.parse( list[i] );
    },

    clear: function(){
      list.splice( 0 );

      var keys = Object.keys( db );
      for( var i = 0, e = keys.length; i < e; i++ ) delete db[keys[i]];
    }

  };
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Holds all available unit types
model.data_unitSheets = {};

// Holds a list of available tile types
model.data_unitTypes = [ ];

model.data_simpleAnimatedUnits = {};

// Unit type sheet parser object
model.data_unitParser = model.data_createParser( model.data_unitSheets, function( sheet ){
  model.data_unitTypes.push( sheet.ID );
  if( sheet.assets.simpleAnimated ) model.data_simpleAnimatedUnits[sheet.ID] = true;
} );

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Holds all available tile and property types
model.data_tileSheets = {};

// Holds a list of available tile types
model.data_propertyTypes = [ ];

// Holds a list of available property types
model.data_tileTypes = [ ];

// Tile type sheet parser object
model.data_tileParser = model.data_createParser( model.data_tileSheets,
  function( sheet ){
    if( sheet.capturePoints || sheet.rocketsilo ) model.data_propertyTypes.push( sheet.ID );
    else model.data_tileTypes.push( sheet.ID );
  }
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Holds all available weather types
model.data_weatherSheets = {};

// Holds the default weather type
model.data_defaultWeatherSheet = null;

// Holds all non-defualt weather types
model.data_nonDefaultWeatherTypes = [ ];

// Tile type sheet parser object
model.data_weatherParser = model.data_createParser( model.data_weatherSheets,
  function( sheet ){
    if( sheet.defaultWeather ) model.data_defaultWeatherSheet = sheet;
    else                       model.data_nonDefaultWeatherTypes.push( sheet );
  }
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Holds all available move types
model.data_movetypeSheets = {};

model.data_movetypeTypes = [ ];

model.data_movetypeParser = model.data_createParser(
  model.data_movetypeSheets,
  model.data_movetypeTypes
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

model.data_gameModeSheets = {};

model.data_gameModeTypes = [ ];

model.data_gameModeParser = model.data_createParser(
  model.data_gameModeSheets,
  model.data_gameModeTypes
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

model.data_fractionSheets = {};

model.data_fractionTypes = [ ];

model.data_fractionParser = model.data_createParser(
  model.data_fractionSheets,
  model.data_fractionTypes
);

model.data_fractionParser.addHandler( function( sheet ){
  assert( sheet.hasOwnProperty("music") );
} );

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

model.data_coSheets = {};

model.data_coTypes = [ ];

model.data_coParser = model.data_createParser( model.data_coSheets, model.data_coTypes );

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

model.data_sounds    = null;

model.data_graphics  = null;

model.data_menu      = null;

model.data_maps      = null;

model.data_header    = null;

model.data_assets    = null;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Language model holds all known language keys.
//
model.data_language = {};

// Returns a localized string for a given key or if not exist the key itself.
//
model.data_localized = function( key ){
  var result = model.data_language[key];
  return (result === undefined) ? key : result;
};
