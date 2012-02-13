/**
 * sheet database service.
 *
 * @namespace
 * @author BlackCat
 * @since 10.02.12
 */
var cwtSheets = {};
require.js(function(){

  /**
   * holds all string based identifiers for sheets with its corresponding index in the data store.
   */
  cwtSheets.sheetKeys = {};

  /**
   * holds all sheets in an array, the id of the sheet is its index in the data store.
   * @type {Array.<object>}
   */
  cwtSheets.sheetData = [];

  /**
   * Registers an sheetID and returns its corresponding integer id.
   *
   * @param {string} sheetId
   */
  cwtSheets._registerId = function( sheetId ){
    if(DEBUG){ /* check type */ }

    var l_nextSheetId = cwtSheets.sheetData.length;
    if(DEBUG) cwtLog.info("register {0} with {1} as id",sheetId,l_nextSheetId);

    // register id
    cwtSheets.sheetKeys[ sheetId ] = l_nextSheetId;

    return l_nextSheetId;
  };

  /**
   * Parses a sheet and adds it to the database.
   *
   * @param {object<string,any>} data
   */
  cwtSheets.parse = function(data){

    if( DEBUG ) cwtLog.info("Parsing sheet object ("+JSON.stringify(data)+")");

    // TRY TO READ SHEET TYPE FROM SHEET ITSELF
    var l_schema = data.sheetType;

    if( typeof l_schema !== 'undefined' ){
      // SHEET HAS TYPE ANNOTATION

      amanda.validate(data,cwtSheets.Schema[l_schema],function(){
        throw Error(JSON.stringify(data)+' is annotated as '+l_schema+' but it is not');
      });

    }
    else{
      // SHEET HAS NO TYPE ANNOTATION, TRY TO FIND IT OUT BE VALIDATING IT OVER EVERY SCHEMA

      var l_schemas = cwtSheets.Schema.keys();
      for( var i=0,e=l_schemas.length;;i++ ){

        // IF NO SCHEMA IS VALID, THEN IT IS AN ILLEGAL SHEET
        if( i == e ) throw Error('no possible schema found for '+JSON.stringify(data));

        // TRY VALIDATION
        amanda.validate(data,cwtSheets.Schema[l_schemas[i]],function(){
          // FAILURE MEANS IT IS NOT A VALID SCHEMA FOR THE GIVEN DATA
          continue;
        });

        // VALID SCHEMA FOUND, ADD DATA TO DATABASE
        cwtSheets.sheetData[ cwtSheets._registerId( data.ID ) ] = data;
        break;
      }
    }
  };

  /**
   * Returns a sheet by its id.
   */
  cwtSheets.sheet = function( id ){
    // ID CAN BE INTEGER OR STRING, IF STRING THEN CONVERT IT TO A VALID INTEGER INDEX
    amanda.validate( id, { type:'number' } ,function(){ id = cwtSheets.sheetKeys[id]; });

    if( DEBUG ) amanda.validate(id, {type:'number', format:'int', minimum:0, maximum:cwtSheets.sheetData.length-1 });

    return cwtSheets.sheetData[id];
  };

  /**
   * different sheet object schemas.
   *
   * @namespace
   */
  cwtSheets.Schema = {};

  /**
   * validator schema for an unit sheet.
   */
  cwtSheets.Schema.UnitSheet = {
    type: 'object',
    properties:{
      ID:        {type:'string', notPropertyOf: cwtSheets.sheetKeys},
      maxAmmo:   {type:'integer', minimum: -1, maximum:99, except:[0]},
      maxFuel:   {type:'integer', minimum: 0, maximum:99},
      moveRange: {type:'integer', minimum: 0, maximum:15},

      //@TODO fix it, only movesheets should be possible
      moveType:  {type:'string', isPropertyOf: cwtSheets.sheetKeys, valueValidsSchema: cwtSheets.Schema.MoveTypeSheet}
    }
  };

  /**
   * vaidator schema for a move type sheet.
   */
  cwtSheets.Schema.MoveTypeSheet= {
    type: 'object',
    properties: {
      ID: {type:'string', notPropertyOf: cwtSheets.sheetKeys}
    }
  };

  /**
   * validator schema for a property sheet.
   */
  cwtSheets.Schema.PropertySheet = {
    type: 'object',
    properties: {
      ID: {type:'string', notPropertyOf: cwtSheets.sheetKeys},
      capturePoints: {format:'int', minimum: 1, maximum:99 }
    }
  };

  cwtSheets.Schema.TileSheet= {
    type: 'object',
    properties: {
      ID: {type:'string', notPropertyOf: cwtSheets.sheetKeys},
      defense: {format:'int', minimum: 0, maximum:5}
    }
  };

  /*
   * debugging output event to make debug printing possible at runtime.
   */
  if (DEBUG){
    cwtEvent.on("debug_printStatus", function () {
      //TODO print nicer output

      cwtLog.info("==Database==");
      cwtLog.info("  Keys:");
      for (var key in cwtSheets.sheetKeys) cwtLog.info("    Key:" + key + " ID:" + cwtSheets.sheetKeys[key]);
      cwtLog.info("  Sheets:");
      for (var i in cwtSheets.sheetData) cwtLog.info("    ID:" + i + " Sheet:" + cwtSheets.sheetData[i]);
    });
  }

});