/**
 * Module description...
 * 
 * @requires jasmine
 * @author BlackCat
 * @since date
 */
define(["sys/test","sys/logger"], function( check, logger){
  
  /*************
   * VARIABLES *
   *************/
  
  var _databaseClosed = false;  
  
  // data blocks
  var _units = {};
  var _tiles = {};
  var _moveTypes = {};
  var _armorTypes = {};
  
  // finalize database after engine initialization
  //event.on("cwt_engine_init",function(){
//	 _databaseClosed = true; 
  //});
  
  
  /******************
   * IMPLEMENTATION *
   ******************/
  
  return {
	  
	  /**
	   * Defines a new unit sheet in the database. The descriptor object will 
	   * be used directly, except it cannot be froozen. If the descriptor 
	   * cannot be froozen, then it's content will be copied into a new 
	   * object specially for the database. <<CHECK THAT! WHAT IS IF YOU
	   * RETURN THE OBJECT FROM DB? (THEN IT WILL BE MODIFIABLE TOO)>> 
	   * 
	   * @param id
	   * @param data
	   * @return true, if the data sheet could be registered, else false
	   */
	  unitSheet: function( data )
	  {
		  logger.info("validating unit sheet...");
		  
		  if( _databaseClosed )
			  throw new Error("database already closed");
			  
		  // every sheet must be validated
		  try
		  {
			check.expect(data.ID).isntPropertyOf(_units);
			
			/*check.expect(data.maxAmmo)
				.isInteger().greaterEq(0).lowerEq(20);
			
			check.expect(data.maxFuel)
				.isInteger().greaterEq(0).lowerEq(99);
			
			check.expect(data.vision)
				.isInteger().greater(0).lowerEq(10);
			
			check.expect(data.weight)
				.isInteger().greater(0).lowerEq(3);
			
			check.atLeastOne(function(){
				check.expect(data.captures).isUndefined();
				check.expect(data.captures).isInteger().greater(0);
			});
			
			//check.expect(data.moveType).isntBlank().isPropertyOf(_moveTypes);
			
			check.expect(data.movepoints)
				.isInteger().greater(0).loweEq(15);*/
			
			check.expect(data.cost).isInteger().greater(0);
		  }
		  catch(e) 
		  {
			if( logger.isErrorEnabled() )
				logger.error("unit sheet is not correct, because of: "+e);
			
			// means a check failed
			return false;
		  }
		  
		  // try to freeze object, if not copy it's content
		  
		  // all tests runs okay, valid sheet
		  _units[data.ID] = data;
		  
		  if( logger.isInfoEnabled() )
			  logger.info("unit sheet "+data.ID+" added to the database");
		  
		  return true;
	  },
	  
	  tileSheet: function()
	  {
		  if( _databaseClosed )
			  throw new Error("database already closed");
	  },
	  
	  moveTypeSheet: function()
	  {
		  if( _databaseClosed )
			  throw new Error("database already closed");
	  },
	  
	  armorSheet: function()
	  {
		  if( _databaseClosed )
			  throw new Error("database already closed");
	  },
	  
	  weaponSheet: function()
	  {
		  if( _databaseClosed )
			  throw new Error("database already closed");
	  },
	
	  /**
	   * Returns an unit sheet.
	   * 
	   * @param type {String} type sheet identifier
	   * @returns type sheet object
	   */
	  unit: function( type )
	  {
		  return _units[ type ];
	  },

	  /**
	   * Returns a tile sheet.
	   * 
	   * @param type {String} type sheet identifier
	   * @returns type sheet object
	   */
	  tile: function( type )
	  {
		  return _tiles[ type ];
	  },
	  
	  /**
	   * Returns a move sheet.
	   * 
	   * @param type {String} type sheet identifier
	   * @returns type sheet object
	   */
	  move: function( type )
	  {
		  return _moveTypes[ type ];
	  },
	  
	  /**
	   * Returns an amour sheet.
	   * 
	   * @param type {String} type sheet identifier
	   * @returns type sheet object
	   */
	  amour: function( type )
	  {
		  return _armorTypes[ type ];
	  }
  };
});