// Creates a simple but extendable parser instance to validate javascript
// objects. This will be used to allow modules to set own requirements
// on object type sheets.
//
model.createDataParser = function(db, list){
  var parserParts = [];
  var listFn = (typeof list === "function");

  return {
    
    addHandler: function(cb){
      if(typeof cb !== "function"){
        model.criticalError(
          constants.error.ILLEGAL_DATA,
          constants.error.ILLEGAL_SHEET_HANDLER );
      }

      parserParts.push(cb);
    },
      
    // parsing function that parses a type sheet and adds it to the type
    // list if no parsing part declines the sheet object by returning
    // `false`
    parse: function(sheet){

      // check identical string first
      if(!util.expectString(sheet, "ID", true)){
        model.criticalError(
          constants.error.ILLEGAL_DATA,
          constants.error.ILLEGAL_SHEET_ID );
      }

      if(db[sheet.ID]){
        model.criticalError(
          constants.error.ILLEGAL_DATA,
          constants.error.ILLEGAL_SHEET_ALREADY_DEFINED );
      }

      // check sheet by calling all parser parts
      for(var i = 0, e = parserParts.length; i < e; i++){
        if(!parserParts[i](sheet)){
          model.criticalError(
            constants.error.ILLEGAL_DATA,
            constants.error.BREAKS_SHEET_CONTRACT );
        }
      }

      // add sheet to the database
      if(listFn) list(sheet);
      else list.push(sheet.ID);
      db[sheet.ID] = sheet;
    },
      
    parseAll: function( list ){
      for( var i=0,e=list.length; i<e; i++ ) this.parse( list[i] );
    },
      
    clear: function(){
      list.splice(0);
      
      var keys = Object.keys( db );
      for( var i=0,e=keys.length; i<e; i++ ) delete db[keys[i]];
    }

  };
};

// ---

// Holds all available unit types
model.unitTypes = {};

// Holds a list of available tile types
model.listOfUnitTypes = [];

// Unit type sheet parser object
model.unitTypeParser = model.createDataParser( model.unitTypes, model.listOfUnitTypes );

// ---

// Holds all available tile and property types
model.tileTypes = {};

// Holds a list of available tile types
model.listOfPropertyTypes = [];

// Holds a list of available property types
model.listOfTileTypes = [];

// Tile type sheet parser object
model.tileTypeParser = model.createDataParser( model.tileTypes,
  function(sheet){
    if(sheet.capturePoints)model.listOfPropertyTypes.push(sheet);
    elsemodel.listOfTileTypes.push(sheet);
  }
);

// ---

// Holds all available weather types
model.weatherTypes = {};

// Holds the default weather type
model.defaultWeatherType = null;

// Holds all non-defualt weather types
model.nonDefaultWeatherType = [];

// Tile type sheet parser object
model.weatherTypeParser = model.createDataParser( model.weatherTypes,
  function(sheet){
    if(sheet.defaultWeather)model.defaultWeatherType = sheet;
    elsemodel.nonDefaultWeatherType.push(sheet);
  }
);

// ---

// Holds all available move types
model.moveTypes = {};

model.listOfMoveTypes = [];

model.moveTypeParser = model.createDataParser( model.moveTypes, model.listOfMoveTypes );

// ---

model.factionTypes = {};

model.listOfFactions = [];

model.factionParser = model.createDataParser( model.factionTypes, model.listOfFactions );

model.factionParser.addHandler(function(){
  if( !util.expectString(sheet, "music", true) ) return false;
});
  
// ---

model.coTypes = {};

model.listOfCoTypes = [];

model.coTypeParser = model.createDataParser( model.coTypes, model.listOfCoTypes );

// ---


model.sounds = null;

model.graphics = null;

model.maps = null;

// Language model holds all known language keys.
//
model.language = {};

// Returns a localized string for a given key or if not exist the key itself.
//
// @param {String} key
//
model.localized = function(key){
  var result = model.language[key];
  return (result === undefined) ? key : result;
};