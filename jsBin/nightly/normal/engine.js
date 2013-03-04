var CLIENT_DEBUG = true;
var DEBUG 		 = true;

/** @constant */
var CWT_ACTIONS_BUFFER_SIZE = 200;

/**
 * The greatest possible map width.
 *
 * @config
 */
var CWT_MAX_MAP_WIDTH = 100;

/**
 * The greatest possible map height.
 *
 * @config
 */
var CWT_MAX_MAP_HEIGHT = 100;

/**
 * Maximum amount of players in the game.
 *
 * @config
 */
var CWT_MAX_PLAYER = 5;

/**
 * The maximum amount of units a player can hold.
 *
 * @config
 */
var CWT_MAX_UNITS_PER_PLAYER = 50;

/**
 * The maximum amount of properties on a map.
 *
 * @config
 */
var CWT_MAX_PROPERTIES = 200;

/**
 * The maximum range to select a target from a selection range.
 *
 * @config
 */
var CWT_MAX_SELECTION_RANGE = 15;

/**
 * The maximum move range for an unit object.
 *
 * @config
 */
var CWT_MAX_MOVE_RANGE = 15;

/**
 * This constant can be overwritten for a custom size, but this must be done
 * before the engine will be initialized.
 *
 * @config
 */
var CWT_MAX_BUFFER_SIZE = 200;



/** 
 * Represents an inactive identical number.
 *
 * @constant 
 */ 
var CWT_INACTIVE_ID = -1;

/**
 * The engine version tag.
 *
 * @constant 
 */ 
var CWT_VERSION = "Milestone 2.7";

/**
 * The model layer holds all necessary data for a game round. This layer can be
 * extended to store additional data for game rounds.
 * </br></br>
 * If you extend this layer you should follow two rules. At first remember that
 * every property of this layer will be saved in a save game. The current
 * persistence layer implementation uses a json algorithm to serialize all model
 * data. This means you cannot store cyclic data structures in the model layer.
 * Furthermore you should not place functions in this layer because this would
 * not follow the specification of this layer.
 *
 * @namespace
 */
var model      = {};

/**
 * This is the main access layer for the custom wars tactics game client. All
 * data changing actions will be invoked from this layer.
 *
 * The layer itself is build as state machine which represents a player action.
 * Every action starts by a selection of a tile. Which the selected object will
 * be choosen by the state of the tile. An empty tile leads to a map action. An
 * empty (owned) property leads to a property actions like buying an unit. The
 * last option will be choosen if the tile is occupied by an own unit.
 *
 * @namespace
 */
var controller  = {};

/**
 * @namespace
 */
var view        = {};

/**
 * Some useful utility functions are stored in this layer. This layer contains
 * the logging functions of custom wars tactics. These functions are
 * overwritable to have a custom log behaviour for the game client. As example
 * if you use a graphical logging solution like BlackbirdJs.
 *
 * @namespace
 */
var util        = {};

/**
 * Injects a modification file into the engine.
 *
 * @param {String} modName name of the mod which must be represent as 
 *                         file in the main context
 */
util.injectMod = function( modName ){
  util.raiseError("inject mod function is not re-defined in the client");
};



/**
 * Fills an array with a value. Works also for matrix objects.
 *
 * @param arr an array or matrix created by {@link util.list} or {@link util.matrix}
 * @param defaultValue he default value that will be inserted into the array/matrix
 */
util.fill = function( arr, defaultValue ){
  var isFN = typeof defaultValue === 'function';

  if( arr.__matrixArray__ === true ){

    // COMPLEX ARRAY (MATRIX) OBJECT
    for(var i = 0, e = arr.length; i < e; i++){
      for(var j = 0, ej = arr.length; j < ej; j++){
        if( isFN ) arr[i][j] = defaultValue( i,j );
        else       arr[i][j] = defaultValue;
      }
    }
  }
  else{

    // SIMPLE ARRAY OBJECT
    for(var i = 0, e = arr.length; i < e; i++){
      if( isFN ) arr[i] = defaultValue( i );
      else       arr[i] = defaultValue;
    }
  }
};

/**
 * Creates a list and fills it with default values.
 *
 * @param {Number} len the length of the created list
 * @param defaultValue the default value that will be inserted into the list slots 
 */
util.list = function( len, defaultValue ){
  if( defaultValue === undefined ){ defaultValue = null; }

  var isFN = typeof defaultValue === 'function';
  var warr = [];
  for (var i = 0; i < len; i++) {
    if( isFN ) warr[i] = defaultValue( i );
    else       warr[i] = defaultValue;
  }

  return warr;
};

/**
 * Creates a matrix (table) and fills it with default values.
 *
 * @param {Number} w width of the matrix
 * @param {Number} h height of the matrix
 * @param defaultValue the default value that will be inserted into the cells 
 */
util.matrix = function( w, h, defaultValue ){

  if( defaultValue === undefined ){ defaultValue = null; }

  var isFN = typeof defaultValue === 'function';
  var warr = [];
  for (var i = 0; i < w; i++) {

    warr[i] = [];
    for (var j = 0; j < h; j++) {

      if( isFN ) warr[i][j] = defaultValue( i,j );
      else       warr[i][j] = defaultValue;
    }
  }

  // meta data
  warr.__matrixArray__ = true;

  return warr;
};
/** 
 * Contains all active languages.
 */
util.i18n_data = { en:{} };

/** 
 * The active language object for the game.
 *
 * @default english
 */
util.i18n_lang = util.i18n_data.en;

/**
 * Returns a localized string for a given key or if not exist the key itself.
 *
 * @param {String} key
 */
util.i18n_localized = function( key ){
  var result = this.i18n_lang[key];
  return ( result === undefined )? key: result;
};

/**
 * Sets the active language.
 *
 * @param {String} langKey
 */
util.i18n_setLanguage = function( langKey ){
  if( !util.i18n_data.hasOwnProperty( langKey ) ){
    throw Error("unknown language");
  }
  else{
    util.i18n_lang = util.i18n_data[langKey];
  }
};

/**
 * Appends data to a given language.
 *
 * @param {String} langKey
 * @param {Object} data
 */
util.i18n_appendToLanguage = function( langKey, data ){

  // CREATE LANG NAMESPACE IF NOT EXISTS
  if( !util.i18n_data.hasOwnProperty( langKey ) ){
    util.i18n_data[ langKey ] = {};
  }

  // APPEND NEW KEYS
  var langNs = util.i18n_data[ langKey ];
  var keys = Object.keys( data );
  for( var i=0,e=keys.length; i<e; i++ ){
    langNs[ keys[i] ] = data[ keys[i] ];
  }
};
/**
 * Raises an error in the active Javascript environment.
 *
 * @param {...Object} reason A number of arguments that will be used as error message.
 *                           If an argument isn't a String then it will be converted to
 *                           String by the toString() function.
 */
util.raiseError = function( reason ){
  
  if( arguments.length === 0 ){
    reason = "CustomWars Debug:: An error was raised";
  }
  else if( arguments.length > 1 ){
    reason = Array.prototype.join.call( arguments, " " );
  }
    
  throw Error( reason );
};

/**
 * Logging function.
 *
 * @param {...Object} reason A number of arguments that will be used as message.
 *                           If an argument isn't a String then it will be converted to
 *                           String by the toString() function.
 * @config
 */
util.log = function( msg ){
  if( arguments.length > 1 ){
    msg = Array.prototype.join.call( arguments, " " );
  }

  console.log( msg );
}

/**
 * Overwritable logging function.
 *
 * @deprecated will be removed in version 0.3
 */
util.logInfo = function(){
  util.log.apply( this, arguments );
};
/** 
 * Creates a ring buffer with a fixed size.
 */
util.createRingBuffer = function( size ){

  var buffer = {

    push: function (msg){
      if ( this._data[ this._wInd ] !== null) {
        throw Error("message buffer is full");
      }

      /*
       if (util.DEBUG) {
       util.logInfo("adding message (", util.objectToJSON(msg), ") to buffer");
       }
       */

      // WRITE MSG AND INCREASE COUNTER
      this._data[ this._wInd ] = msg;
      this._wInd++;
      if ( this._wInd === this._size ) {
        this._wInd = 0;
      }
    },

    /**
     * Returns true if the ring buffer is empty else false.
     *
     */
    isEmpty: function () {
      return ( this._data[ this._rInd ] === null );
    },

    pop: function () {
      if( this._data[ this._rInd ] === null) {
        throw Error("message buffer is empty");
      }
      var msg = this._data[ this._rInd ];

      // INCREASE COUNTER AND FREE SPACE
      this._data[ this._rInd ] = null;
      this._rInd++;
      if (this._rInd === this._size ) {
        this._rInd = 0;
      }

      return msg;
    },

    clear: function(){
      this._rInd = 0;
      this._wInd = 0;
      for( var i=0; i<size; i++ ){
        this._data[i] = null;
      }
    }
  };

  buffer._rInd = 0;
  buffer._wInd = 0;
  buffer._data = util.list( size, null );
  buffer._size = size;

  return buffer;
};
/** 
 * @constant 
 */
util.FUNCTION_TRUE_RETURNER = function(){ return true; };

/** 
 * @constant 
 */
util.FUNCTION_FALSE_RETURNER = function(){ return false; };
/**
 * Contains the fog data map. A value 0 means a tile is not visible. A value
 * greater than 0 means it is visible for n units ( n = fog value of the tile ). 
 */
model.fogData = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, 0 );
/**
 * Rule object holder.
 */
model.ruleTable = {};

/**
 * Data level rules.
 */
model.ruleTable.dataLevel = {

  funds:                  1000,

  noUnitsLeftLoose:       false,

  autoSupplyAtTurnStart:  true,

  cityRepair:             20,

  captureWinLimit:        0,

  turnTimeLimit:          3000000,
  dayLimit:               0,
  daysOfPeace:            0,

  unitLimit:              50,

  blockedUnits:           [],
  
  /** attack damage modifier */
  att:100,

  /** defense damage modifier */
  def:100,

  /** counter attack damage modifier */
  cAtt:100,

  /** the funds returned by owned properties */
  funds:1000,

  /** the vision modifier */
  vision: 0,
  
  /** the move range modifier */
  moveRange: 0,
  
  /** days to regenerate silos, -1 if no regeneration should be done */
  siloRegeneration:-1,

  /** is fog enabled? */
  fogEnabled:true,
  
  /** is a silo usable? */
  usableSilo:true,
  
  resupplyUnitOnAlliedProperties: true,
  
  healUnitsOnProperties: true,
  
  healUnitsOnAlliedProperties: true
};

model.ruleTable.mapLevel = Object.create( model.ruleTable.dataLevel );
model.ruleTable.roundLevel = Object.create( model.ruleTable.mapLevel );
model.ruleTable.playerLevel = Object.create( model.ruleTable.roundLevel );

/**
 * Main rule object.
 */
model.rules = model.ruleTable.playerLevel;

/**
 * Unites modification rules and custom rules to a valid game round rule
 * object.
 */
model.setRulesByOption = function( options ){
  var modRules = model.sheets.defaultRules;
  var rules = model.rules;

  var keys = Object.keys( modRules );
  for( var i=0,e=keys.length; i<e; i++ ){

    var key = keys[i];

    // TAKE EITHER MOD DEFAULT VALUES OR CUSTOM VALUES
    if( options.hasOwnProperty(key) ){
      rules[key] = options[key];
    } else{
      rules[key] = modRules[key];
    }
  }
};

model.setRule = function( str ){
  var tokens = str.split(" ");
  
  var property = tokens[0];
  var value = tokens[1];
  
  switch( property ){
      
    case "siloRegenerationDays":
      model.rules.siloRegeneration = model.daysToTurns( value );
      break;
      
    case "siloRegenerationTurns":
      model.rules.siloRegeneration = value;
      break;
      
    default: util.raiseError("unknown gamerule", property); 
  }
};
/**
 * Map table that holds all known tiles.
 */
model.map = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Returns the current active map height.
 */
model.mapHeight = -1;

/**
 * Returns the current active map width.
 */
model.mapWidth = -1;

/**
 * Returns the distance of two positions.
 *
 * @param {Number} sx
 * @param {Number} sy
 * @param {Number} tx
 * @param {Number} ty
 */
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 * Returns the move code from a tile ax,ay to bx,by.
 * 
 * @param {Number} ax
 * @param {Number} ay
 * @param {Number} bx
 * @param {Number} by
 */
model.moveCodeFromAtoB = function( ax,ay, bx,by ){
  if( model.distance( ax,ay, bx,by ) !== 1 ){
    util.raiseError("both positions haven't a distance of 1");
  }

  // MUST FIT
  if( bx < ax ){ return model.MOVE_CODE_LEFT; }
  if( bx > ax ){ return model.MOVE_CODE_RIGHT; }
  if( by < ay ){ return model.MOVE_CODE_UP; }
  if( by > ay ){ return model.MOVE_CODE_DOWN; }

  util.unexpectedSituationError();
};

model.isValidPosition = function( x,y ){
  return ( x >= 0 && y >= 0 && x < model.mapWidth && y < model.mapHeight );
};

/**
 * Returns true if an own unit, in relationship to a given player id, is on a
 * tile at a given position x,y.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @returns {Boolean}
 */
model.thereIsAnOwnUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid === unit.owner );
};

/**
 * Returns true if an allied unit, in relationship to a given player id, is on 
 * a tile at a given position x,y.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @returns {Boolean}
 */
model.thereIsAnAlliedUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team === model.players[unit.owner].team);
};

/**
 * Returns true if an enemy unit, in relationship to a given player id, is on a
 * tile at a given position x,y.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @returns {Boolean}
 */
model.thereIsAnEnemyUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team !== model.players[unit.owner].team );
};
/**
 * Code of the move up command
 * @constant
 */
model.MOVE_CODE_UP    = 0;

/**
 * Code of the move right command
 * @constant
 */
model.MOVE_CODE_RIGHT = 1;

/**
 * Code of the move down command
 * @constant
 */
model.MOVE_CODE_DOWN  = 2;

/**
 * Code of the move left command
 * @constant
 */
model.MOVE_CODE_LEFT  = 3;

/**
 * Injects movable tiles into a action data memory object.
 * 
 * @param data action data memory
 */
model.fillMoveMap = function( data ){
  var unit   = data.sourceUnit;
  var type   = model.sheets.unitSheets[unit.type];
  var mType  = model.sheets.movetypeSheets[ type.moveType ];
  var player = model.players[unit.owner];
  var range  = type.moveRange;
  var x = data.sourceX;
  var y = data.sourceY;
  var wth = model.weather.ID;
  
  // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
  if( unit.fuel < range ) range = unit.fuel;

  // ADD START TILE TO MAP
  data.setSelectionCenter( x,y,CWT_INACTIVE_ID );
  data.setSelectionValueAt( x,y,range );

  // FILL MAP ( ONE STRUCT IS X;Y;LEFT_POINTS )
  var toBeChecked = [ x,y,range ];
  var checker = [
    -1,-1,
    -1,-1,
    -1,-1,
    -1,-1
  ];

  while( true ){
    var cHigh      = -1;
    var cHighIndex = -1;

    for( var i=0,e=toBeChecked.length; i<e; i+=3 ){
      var leftPoints = toBeChecked[i+2];

      if( leftPoints !== undefined && leftPoints !== null ){
        if( cHigh === -1 || leftPoints > cHigh ){
          cHigh = leftPoints;
          cHighIndex = i;
        }
      }
    }
    if( cHighIndex === -1 ) break;

    var cx = toBeChecked[cHighIndex];
    var cy = toBeChecked[cHighIndex+1];
    var cp = toBeChecked[cHighIndex+2];

    // CLEAR
    toBeChecked[cHighIndex  ] = null;
    toBeChecked[cHighIndex+1] = null;
    toBeChecked[cHighIndex+2] = null;

    // SET NEIGHTBOURS
    if(cx>0                 ){ checker[0] = cx-1; checker[1] = cy; }
    else{                      checker[0] = -1  ; checker[1] = -1; }
    if(cx<model.mapWidth-1  ){ checker[2] = cx+1; checker[3] = cy; }
    else{                      checker[2] = -1  ; checker[3] = -1; }
    if(cy>0                 ){ checker[4] = cx; checker[5] = cy-1; }
    else{                      checker[4] = -1; checker[5] = -1;   }
    if(cy<model.mapHeight-1 ){ checker[6] = cx; checker[7] = cy+1; }
    else{                      checker[6] = -1; checker[7] = -1;   }

    // CHECK NEIGHBOURS
    for( var n=0; n<8; n += 2 ){
      if( checker[n] === -1 ) continue;

      var tx = checker[n  ];
      var ty = checker[n+1];

      var cost = model.moveCosts( mType, model.map[ tx ][ ty ], wth );
      if( cost !== 0 ){

        var cunit = model.unitPosMap[tx][ty];
        if( cunit !== null &&
            model.fogData[tx][ty] > 0 &&
            !cunit.hidden &&
            model.players[cunit.owner].team !== player.team ){
          continue;
        }

        var rest = cp-cost;
        if( rest >= 0 &&
          rest > data.getSelectionValueAt(tx,ty) ){

          // ADD TO MOVE MAP
          data.setSelectionValueAt( tx,ty,rest );

          // ADD TO CHECKER
          for( var i=0,e=toBeChecked.length; i<=e; i+=3 ){
            if( toBeChecked[i] === null ||i===e ){
              toBeChecked[i  ] = tx;
              toBeChecked[i+1] = ty;
              toBeChecked[i+2] = rest;
              break;
            }
          }
        }
      }
    }
  }

  // CONVERT LEFT POINTS TO MOVE COSTS
  for( var x=0,xe=model.mapWidth; x<xe; x++ ){
    for( var y=0,ye=model.mapHeight; y<ye; y++ ){
      if( data.getSelectionValueAt(x,y) !== -1 ){
        var cost = model.moveCosts( mType, model.map[x][y], wth );
        data.setSelectionValueAt( x, y, cost );
      }
    }
  }
};

/**
 * Appends a tile to the move path of a given action data memory object.
 *
 * @param data action data memory
 * @param tx target x coordinate
 * @param ty target y coordinate
 * @param code move code to the next tile
 */
model.addCodeToPath = function( data, tx, ty, code ){
  var fuelLeft = data.sourceUnit.fuel;
  var fuelUsed = 0; 
  var movePath = data.movePath;
  movePath.push( code );
  var points =  model.sheets.unitSheets[ data.sourceUnit.type ].moveRange;

  if( fuelLeft < points ) points = fuelLeft;

  var cx = data.sourceX;
  var cy = data.sourceY;
  for( var i=0,e=movePath.length; i<e; i++ ){

    switch( movePath[i] ){
      case model.MOVE_CODE_UP: cy--; break;
      case model.MOVE_CODE_DOWN: cy++; break;
      case model.MOVE_CODE_LEFT: cx--; break;
      case model.MOVE_CODE_RIGHT: cx++; break;
      default : util.raiseError();
    }

    fuelUsed += data.getSelectionValueAt(cx,cy);
  }

  // GENERATE NEW PATH IF THE OLD IS NOT POSSIBLE
  if( fuelUsed > points ){
    model.setPathByRecalculation( data, tx,ty );
  }
};

/**
 * Regenerates a path from the source position of an action data memory object
 * to a given target position.
 * 
 * @param data action data memory
 * @param tx target x coordinate
 * @param ty target y coordinate
 */
model.setPathByRecalculation = function( data, tx,ty ){
  var stx = data.sourceX;
  var sty = data.sourceY;
  var movePath = data.movePath;

  if ( DEBUG ){
    util.log( "searching path from (", stx, ",", sty, ") to (", tx, ",", ty, ")" );
  }

  var graph = new Graph( data.selectionData );

  var dsx = stx - data.selectionCX;
  var dsy = sty - data.selectionCY;
  var start = graph.nodes[ dsx ][ dsy ];

  var dtx = tx - data.selectionCX;
  var dty = ty - data.selectionCY;
  var end = graph.nodes[ dtx ][ dty ];

  var path = astar.search(graph.nodes, start, end);

  if ( DEBUG ){
    util.log("calculated way is", path);
  }

  var codesPath = [];
  var cx = stx;
  var cy = sty;
  var cNode;

  for (var i = 0, e = path.length; i < e; i++) {
    cNode = path[i];

    var dir;
    if (cNode.x > cx) dir = model.MOVE_CODE_RIGHT;
    else if (cNode.x < cx) dir = model.MOVE_CODE_LEFT;
    else if (cNode.y > cy) dir = model.MOVE_CODE_DOWN;
    else if (cNode.y < cy) dir = model.MOVE_CODE_UP;
    else {
      util.raiseError();
    }

    codesPath.push(dir);

    cx = cNode.x;
    cy = cNode.y;
  }

  movePath.splice(0);
  for( var i=0,e=codesPath.length; i<e; i++ ){
    movePath[i] = codesPath[i];
  }
};

/**
 * List that contains all player instances. An inactive player is marked 
 * with {@link CWT_INACTIVE_ID} as team number.
 */
model.players = util.list( CWT_MAX_PLAYER+1, function( index ){
  var neutral = (index === CWT_MAX_PLAYER );
  return {
    gold: 0,
    team: ( neutral )? 9999 : CWT_INACTIVE_ID,
    name: ( neutral )? "NEUTRAL" : null,
    
    mainCo: null,
    sideCo: null,
    power: 0
  };
});

/**
 * Returns true if the given id is a neutral player, else false.
 * 
 * @param {Number} id player id
 * @deprecated will be removed with version 0.3 because the neutral player will
 *             be dropped.
 */
model.isNeutralPlayer = function( id ){
  return model.neutralPlayerId === id;
};

/**
 * Extracts the identical number from an player object.
 *
 * @param player
 */
model.extractPlayerId = function( player ){
  if( player === null ){
    util.raiseError("player argument cannot be null");
  }

  var players = model.players;
  for( var i=0,e=players.length; i<e; i++ ){
    if( players[i] === player ) return i;
  }

  util.raiseError( "cannot find player", players );
};

/**
 * Returns the neutral player id.
 * 
 * @deprecated will be dropped in version 0.3
 */
model.neutralPlayerId = model.players.length-1;

/**
 * Returns true if player id A is in the same team 
 * as player id B, else false. 
 * 
 * @param {Number} pidA player id
 * @param {Number} pidB player id
 */
model.alliedPlayers = function( pidA, pidB ){
  return model.players[pidA].team === model.players[pidB].team;
};

/**
 * Returns true if player id A is not in the same 
 * team as player id B, else false. 
 * 
 * @param {Number} pidA player id
 * @param {Number} pidB player id
 */
model.enemyPlayers = function( pidA, pidB ){
  return model.players[pidA].team !== model.players[pidB].team;
};
/**
 * List of all available properties of a game round. If a property is not 
 * used it will be marked with an owner value {@link CWT_INACTIVE_ID}.
 */
model.properties = util.list( CWT_MAX_PROPERTIES+1, function(){
  return {
    capturePoints: 20,
    owner: -1,
    type: null
  };
});

/**
 * Matrix that has the same metrics as the game map. Every property will be 
 * placed in the cell that represents its position. A property will be 
 * accessed by model.propertyPosMap[x][y].
 */
model.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH,
  CWT_MAX_MAP_HEIGHT,
  null
);

/**
 * Returns true if the tile at position x,y is a property, else false.
 * 
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.tileIsProperty = function( x,y ){
  var prop = model.propertyPosMap[x][y];
  return prop !== null;
};

/**
 * Extracts the identical number from a property object.
 *
 * @param property
 */
model.extractPropertyId = function( property ){
  if( property === null ){
    util.raiseError("property argument cannot be null");
  }

  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  util.raiseError("cannot find property",property );
};

/**
 * Counts all properties owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countProperties = function( pid ){

  var n = 0;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i].owner === pid ){
      n++;
    }
  }

  return n;
};
/**
 * Two objects which have the same owner.
 *
 * @constant
 * @deprecated will be removed in version 0.3
 */
model.RELATIONSHIP_SAME_OWNER = 0;

/**
 * Two objects which have differnt of the same team.
 *
 * @constant
 * @deprecated will be removed in version 0.3
 */
model.RELATIONSHIP_ALLIED = 1;

/**
 * Two objects which have differnt owners of different teams.
 *
 * @constant
 * @deprecated will be removed in version 0.3
 */
model.RELATIONSHIP_ENEMY = 2;

/**
 * Two objects which have no relationship because one or both of them
 * hasn't an owner.
 *
 * @constant
 * @deprecated will be removed in version 0.3
 */
model.RELATIONSHIP_NONE = 3;

/**
 * @constant
 * @deprecated will be removed in version 0.3
 */
model.RELATIONSHIP_SAME_OBJECT = 4;


/**
 * Returns the relationship between two player identicals.
 *
 * @deprecated will be removed in version 0.3
 *
 * @param pidA player id or ownable object
 * @param pidB player id or ownable object
 */
model.relationshipBetween = function( pidA, pidB ){
  if( pidA === null || pidB === null ){
    return model.RELATIONSHIP_NONE;
  }

  if( typeof pidA !== 'number' &&  typeof pidB !== 'number'
    && pidA === pidB ) return model.RELATIONSHIP_SAME_OBJECT;

  if( typeof pidA !== 'number' ) pidA = pidA.owner;
  if( typeof pidB !== 'number' ) pidB = pidB.owner;

  if( pidA === pidB ) return model.RELATIONSHIP_SAME_OWNER;
  else {
    var tidA = model.players[ pidA ];
    var tidB = model.players[ pidB ];
    if( tidA === tidB ){
      return model.RELATIONSHIP_ALLIED;
    }
    else return model.RELATIONSHIP_ENEMY;
  }
};

/**
 * Represents the current action day in the game. The day attribute increases
 * everytime if the first player starts its turn.
 */
model.day = 0;

/**
 * Holds the identical number of the current turn owner.
 */
model.turnOwner = -1;

/**
 * Holds the identical numbers of all objects that can act during the turn.
 * After a unit has acted, it should be removed from this list with
 * {@link data.markAsUnusable}.
 */
model.leftActors = util.list( CWT_MAX_UNITS_PER_PLAYER, false );

/**
 * Returns true if the selected uid can act in the current active turn,
 * else false.
 *
 * @param uid selected unit identical number
 */
model.canAct = function( uid ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  // NOT THE OWNER OF THE CURRENT TURN
  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){

    return false;
  }

  var index = uid - startIndex;
  return model.leftActors[ index ] === true;
};

/**
 * Returns true if the given player id is the current turn owner.
 *
 * @param pid player id
 */
model.isTurnOwner = function( pid ){
  return model.turnOwner === pid;
};

/**
 * 
 *
 * @param {Number} v number in days
 */
model.daysToTurns = function( v ){
  return model.players.length*v;
};

/**
 *
 */
model.weather = null;

/**
 *
 */
model.weatherDays = 0;
/**
 * Contains all data sheets of the game.
 * 
 * @namespace
 */
model.sheets = {};

/**
 * Amanda validator object.
 * 
 * @private
 */
model.sheets._dbAmanda = amanda("json");

/** @constant */
model.sheets.UNIT_TYPE_SHEET = 0;

/** @constant */
model.sheets.TILE_TYPE_SHEET = 1;

/** @constant */
model.sheets.WEAPON_TYPE_SHEET = 2;

/** @constant */
model.sheets.WEATHER_TYPE_SHEET = 3;

/** @constant */
model.sheets.MOVE_TYPE_SHEET = 4;

/** @constant */
model.sheets.RULESET = 5;

/** @constant */
model.PRIMARY_WEAPON_TAG = "mainWeapon";

/** @constant */
model.SECONDARY_WEAPON_TAG = "subWeapon";

/**
 * Holds all known unit game.
 */
model.sheets.unitSheets = {};

/**
 * Holds all known tile game.
 */
model.sheets.tileSheets = {};

/**
 * Holds all known weapon game.
 */
model.sheets.weaponSheets = {};

/**
 * Holds all known weather game.
 */
model.sheets.weatherSheets = {};

/**
 * Holds all known move type game.
 */
model.sheets.movetypeSheets = {};

/**
 * Contains the loaded modification rules.
 */
model.sheets.defaultRules = null;

/**
 * Different sheet validators.
 *
 * @namespace
 */
model.sheets.typeSheetValidators = {

  /** Schema for the rule object. */
  rulesValidator: {
    type: 'object',
    properties:{
      funds:            { type:'integer', minimum:0, maximum:99999 },
      noUnitsLeftLoose: { type:'boolean' },
      captureWinLimit:  { type:'integer', minimum:0, maximum:99999 },
      turnTimeLimit:    { type:'integer', minimum:0, maximum:3600000 },
      dayLimit:         { type:'integer', minimum:0, maximum:99999 },
      unitLimit:        { type:'integer', minimum:1, maximum:50    },
      blockedUnits:     { type:'array' }
    }
  },

  /** Schema for an unit sheet. */
  unitValidator: {
    type: 'object',
    properties:{
      ID: { type:'string', except:[], required:true },
      cost: { type:'integer', minimum:0 },
      fuelConsumption: { type:'integer', minimum:0 },
      maxAmmo: { type:'integer', minimum:0, maximum:99 },
      maxFuel: { type:'integer', minimum: 0, maximum:99, required:true },
      moveRange: { type:'integer', minimum: 0, maximum:15, required:true },
      moveType: { type:'string', required:true },
      weight: { type:'integer', required:true }
    }
  },

  /** Schema for a tile sheet. */
  tileValidator: {
    type: 'object',
    properties: {
      ID: { type:'string', except:[], required:true },
      capturePoints: { type:'integer', minimum: 1, maximum:99 },
      defense: { type:'integer', minimum: 0, maximum:5 }
    }
  },

  /** Schema for a weapon sheet. */
  weaponValidator: {
    type: 'object',
    properties:{
      ID: { type:'string', except:[], required:true },
      noMoveAndFire: { type:'boolean' }
    }
  },

  /** Schema for a weather sheet. */
  weatherValidator: {
    type: 'object',
    properties:{
      ID: { type:'string', except:[], required:true },
      visionChange: { type:'integer' }
    }
  },

  /** Schema for a move type sheet. */
  movetypeValidator: {
    type: 'object',
    properties: {
      ID: { type:'string', except:[], required:true },
      costs: {
        type: "object",
        properties:{
          type: "object",
          patternProperties: {
            '[.]*': { type:"integer", minimum:0 } 
          }
        }
      }
    }
  }
};

// DO NOT SERIALIZE SHEETS
model.sheets.toJSON = function(){ return undefined; }

/**
 * Parses a data object into the database. The data object must be
 * a valid javascript object. The type decide what kind of the the
 * data object is.
 */
model.parseSheet = function( data, type ){
  var schema, db, excList;
  var id = data.ID;
  var validators = model.sheets.typeSheetValidators;

  // FIND SCHEMA AND DATA LIST
  switch( type ){

    case model.sheets.UNIT_TYPE_SHEET:
      schema =  validators.unitValidator;
      db = model.sheets.unitSheets;
      excList = validators.unitValidator.properties.ID.except;
      break;

    case model.sheets.TILE_TYPE_SHEET:
      schema =  validators.tileValidator;
      db = model.sheets.tileSheets;
      excList = validators.tileValidator.properties.ID.except;
      break;

    case model.sheets.WEAPON_TYPE_SHEET:
      schema =  validators.weaponValidator;
      db = model.sheets.weaponSheets;
      excList = validators.weaponValidator.properties.ID.except;
      break;

    case model.sheets.WEATHER_TYPE_SHEET:
      schema =  validators.weatherValidator;
      db = model.sheets.weatherSheets;
      excList = validators.weatherValidator.properties.ID.except;
      break;

    case model.sheets.MOVE_TYPE_SHEET:
      schema =  validators.movetypeValidator;
      db = model.sheets.movetypeSheets;
      excList = validators.movetypeValidator.properties.ID.except;
      break;

    case model.sheets.RULESET:
      schema =  validators.rulesValidator;
      break;

    default: util.raiseError("unknow type",type);
  }

  // CHECK IDENTICAL STRING FIRST
  if( type !== model.sheets.RULESET &&
    db.hasOwnProperty(id) ) util.raiseError(id,"is already registered");

  // VALIDATE SHEET
  model.sheets._dbAmanda.validate( data, schema, function(e){
    if( e ) util.raiseError( "failed to parse sheet due", e.getMessages() );
  });

  if( type === model.sheets.RULESET ) model.sheets.defaultRules = data;
  else{
    db[id] = data;

    // REGISTER ID IN EXCEPTION LIST
    excList.push(id);
  }

};

/**
 * Returns all known type game of units.
 */
model.getListOfUnitTypes = function(){
  return Object.keys( model.sheets.unitSheets );
};

/**
 * Returns all known type game of properties.
 */
model.getListOfPropertyTypes = function(){
  var tiles = model.sheets.tileSheets;
  var l = Object.keys( tiles );
  var r = [];
  for( var i=l.length-1; i>=0; i-- ){
    if( tiles[l[i]].capturePoints > 0 ){
      r.push( l[i] );
    }
  }
  return r;
};

/**
 * Returns all known type game of tiles.
 */
model.getListOfTileTypes = function(){
  var tiles = model.sheets.tileSheets;
  var l = Object.keys( tiles );
  var r = [];
  for( var i=l.length-1; i>=0; i-- ){
    if( tiles[l[i]].capturePoints === undefined ){
      r.push( l[i] );
    }
  }
  return r;
};

/**
 * Returns the primary weapon of an unit.
 *
 * @param unit unit object
 */
model.primaryWeaponOfUnit = function( unit ){
  if( DEBUG && unit === null ) util.raiseError();

  if( typeof unit === 'number' ){
    unit = model.units[unit];
  }

  var type = model.sheets.unitSheets[ unit.type ][ model.PRIMARY_WEAPON_TAG ];
  return (type !== undefined )? model.sheets.weaponSheets[ type ] : null;
};

/**
 * Returns the secondary weapon of an unit.
 *
 * @param unit
 */
model.secondaryWeaponOfUnit = function( unit ){
  if( DEBUG && unit === null ) util.raiseError();

  if( typeof unit === 'number' ){
    unit = model.units[unit];
  }

  var type = model.sheets.unitSheets[ unit.type ][ model.SECONDARY_WEAPON_TAG ];
  return (type !== undefined )? model.sheets.weaponSheets[ type ] : null;
};

/**
 * Returns the base damage from a weapon sheet against an unit type.
 *
 * @param weapon weapon sheet object
 * @param {String} uType unit type
 */
model.getBaseDamage = function( weapon, uType ){
  if( DEBUG && weapon === null ) util.raiseError();
  if( DEBUG && uType === null ) util.raiseError();

  var dmg;

  dmg = weapon.damages[ uType ];
  if( dmg !== undefined ) return dmg;

  dmg = weapon.damages[ "*" ];
  if( dmg !== undefined ) return dmg;

  return 0;
};

/**
 * Returns the costs for a movetype to move onto a tile type.
 *
 * @param movetype move type object
 * @param {String} tiletype tile type
 */
model.moveCosts = function( movetype, tiletype, wth ){
  var c;
  var set = movetype.costs[ wth ];

  c = set[ tiletype ];
  if( c === undefined ) c = set["*"];

  return c;
};
/**
 * Contains all regenerating silos. Every silo will be added if the 
 * regeneration is enabled. The number stored in a property symbolizes 
 * the number of days since the silo was registered as regenerate able.
 */
model.regeneratingSilos = {};
/**
 * Retuns a list of loaded unit ids by a given transporter id.
 *
 * @param {Number} tid transporter id
 */
model.getLoadedIds = function( tid ){
  var loaded = [];
  var pid = model.units[ tid ].owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        loaded.push( i );
      }
    }
  }

  return loaded;
};

/**
 * Has a transporter unit with id tid loaded units? Returns true if yes, else
 * false.
 *
 * @param {Number} tid transporter id
 */
model.hasLoadedIds = function( tid ){
  var pid = model.units[ tid ].owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        return true;
      }
    }
  }

  return false;
};

/**
 * Returns true if the unit with the id lid is loaded by a transporter unit
 * with id tid.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.isLoadedBy = function( lid, tid ){
  return model.units[ lid ].loadedIn === tid;
};

/**
 * Loads the unit with id lid into a tranporter with the id tid.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.loadUnitInto = function( lid, tid ){
  if( !model.canLoad( lid,tid ) ){
    util.logError("transporter unit",tid,"cannot load unit",lid);
  }

  model.units[ lid ].loadedIn = tid;
};

/**
 * Unloads the unit with id lid from a tranporter with the id tid.
 *
 * @param {Number} lid
 * @param {Number} tid
 */
model.unloadUnitFrom = function( lid, tid ){
  model.units[ lid ].loadedIn = -1;
};

/**
 * Returns true if a tranporter with id tid can load the unit with the id
 * lid. This function also calculates the resulting weight if the transporter
 * would load the unit. If the calculated weight is greater than the maxiumum
 * loadable weight false will be returned.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.canLoad = function( lid, tid ){
  if( lid === tid ) util.raiseError();
  
  var tp = model.units[ tid ];
  var lu = model.units[ lid ];

  // CALCULATE CURRENT LOADED WEIGHT
  var cW = 0;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*tp.owner,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        cW += model.sheets.unitSheets[ model.units[ i ].type ].weight;
      }
    }
  }

  // CALCULATE FUTURE WEIGHT
  cW += model.sheets.unitSheets[ lu.type ].weight;

  var tps = model.sheets.unitSheets[ tp.type ].transport;
  if( cW > tps.maxWeight ) return false;

  // IS UNIT TYPE LOADABLE
  var unitSh = model.sheets.unitSheets[ model.units[ lid ].type ];
  var tpsL = tps.canLoad;

  // ID
  if( tpsL.indexOf( model.units[ lid ].type ) !== -1 ) return true;

  // MOVETYPE
  if( tpsL.indexOf( unitSh.moveType ) !== -1 ) return true;

  // ALL TYPE
  if( tpsL.indexOf("*") !== -1 ) return true;

  return false;
};

/**
 * Returns true if the unit with id tid is a traensporter, else false.
 *
 * @param {Number} tid transporter id
 */
model.isTransport = function( tid ){
  return model.sheets.unitSheets[
    model.units[ tid ].type ].transport !== undefined;
};

/**
 * Matrix with the same metrics like the map. Every unit is placed into the 
 * cell that represents its position.
 */
model.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * List of all unit objects. An inactive unit is marked with 
 * {@link CWT_INACTIVE_ID} as owner.
 */
model.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER, function(){
  return {
    x:0,
    y:0,
    hp: 99,
    ammo: 0,
    fuel: 0,
    type: null,
    loadedIn: -1,
    hidden: false,
    owner: CWT_INACTIVE_ID
  };
});

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
model.extractUnitId = function( unit ){
  if( unit === null ){
    util.raiseError("unit argument cannot be null");
  }

  var units = model.units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  util.raiseError("cannot find unit", unit );
};

/**
 * Returns true if a player with a given player id has free slots for new units.
 * 
 * @param {Number} pid player id
 * @returns {Boolean}
 */
model.hasFreeUnitSlots = function( pid ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  for( var i=0, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){ return true; }
  }

  return false;
};

/**
 * Returns true if a given position is occupied by an unit, else false.
 *
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.tileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return false;
  else return model.extractUnitId( unit );
};

/**
 * Counts all units that are owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countUnits = function( pid ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  var n = 0
  for( var i=startIndex, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      n++;
    }
  }

  return n;
};

/**
 *
 */
model.unitHpPt = function( unit ){
  return parseInt( unit.hp/10 )+1;
};

/**
 *
 */
model.unitHpPtRest = function( unit ){
  var pt = parseInt( unit.hp/10 )+1;
  return unit.hp - pt;
};

/**
 *
 */
model.ptToHp = function( pt ){
  return (pt*10);
};
/**
 * Wrapper object to make actions locally callable without invoking a transaction context nor being
 * evaluated over the action stack.
 * 
 * Note that the client expects actions to be invoked over the action stack. Only smaller actions like
 * wait should be invoked directly, all other things should be pushed into the action stack.
 * 
 * @namespace
 */
controller.actions = {};

/** 
 * Contains all known action objects.
 *  
 * @private 
 */
controller.actionObjects_ = {};

/**
 * Registers an internal non user callable action.
 *
 * @param impl action implementation
 */
controller.engineAction = function( impl ){
  
  // CHECKS
  if( !impl.hasOwnProperty("key") ) util.raiseError("action key isn't defined");
  if( controller.actionObjects_.hasOwnProperty( impl.key ) ) util.raiseError("action key is already registered");
  if( !impl.hasOwnProperty("name") ) util.raiseError("action name isn't defined");
  if( !impl.hasOwnProperty("action") ) util.raiseError("action implementation isn't defined");
  if( !impl.hasOwnProperty("condition") ) impl.condition = false;
  if( !impl.hasOwnProperty("shared") ) impl.shared = false;
  
  // REGISTER PROGRAMATIC LINK
  var key = impl.key;
  controller.actions[ impl.name ] = function(){
    var cmd = controller.actionObjects_[ key ];
    cmd.action.apply( cmd, arguments );
  };
  
  controller.actionObjects_[ key ] = impl;
};

/**
 * Registers an user callable action.
 *
 * @param impl action implementation
 */
controller.userAction = function( impl ){
  
  // CHECKS
  if( !impl.hasOwnProperty("condition") ) impl.condition = util.FUNCTION_TRUE_RETURNER;
  if( !impl.hasOwnProperty("prepareMenu") ) impl.prepareMenu = null;
  if( !impl.hasOwnProperty("prepareTargets") ) impl.prepareTargets = null;
  if( !impl.hasOwnProperty("isTargetValid") ) impl.isTargetValid = null;
  if( !impl.hasOwnProperty("multiStepAction") ) impl.multiStepAction = false;
  if( !impl.hasOwnProperty("shared") ) impl.shared = true;
  if( impl.prepareTargets !== null && !impl.hasOwnProperty("targetSelectionType") ) impl.targetSelectionType = "A";
  
  if( !impl.hasOwnProperty("createDataSet") ) util.raiseError("action data set creation handler isn't defined");
  if( impl.prepareTargets !== null && impl.isTargetValid !== null ){
    util.raiseError("only one selection type can be used in an action");
  }
  
  controller.engineAction( impl );
};

/**
 * A client action is always a locally invoked action.
 * 
 * @param impl action implementation
 */
controller.clientAction = function( impl ){
  impl.shared = false;
  
  controller.userAction( impl );
};

/**
 * Returns an action object for a given action key.
 * 
 * @param {String} actionKey action key
 */
controller.getActionObject = function( actionKey ){
  return controller.actionObjects_[actionKey];
};
/** 
 * Action buffer object that holds all actions that aren't invoked yet.
 * 
 * @private 
 */
controller.actionBuffer_ = util.createRingBuffer( CWT_ACTIONS_BUFFER_SIZE );

/**
 * Pushes an action into the buffer and invokes a transaction process if the action
 * is marked as shared.
 * 
 * @example 
 *  data format
 *  [ parameters... , actionKey ]
 */
controller.pushSharedAction = function(){
  var cmd = controller.actionObjects_[ arguments[arguments.length-1] ];
  if( cmd.shared && controller.isNetworkGame() ){
    this.sendNetworkMessage_( arguments );
  }
  
  controller.pushAction.apply( this, arguments );
};

/**
 * Pushes an action into the buffer.
 * 
 * @example 
 *  data format
 *  [ parameters... , actionKey ]
 */
controller.pushAction = function(){
  if( DEBUG ){
    util.log("push action",JSON.stringify(arguments),"into action stack");
  }

  controller.actionBuffer_.push( arguments );
};

/**
 * Returns true if no action is in the action 
 * stack, else false.
 */
controller.noNextActions  = function(){
  return controller.actionBuffer_.isEmpty();
};

/**
 * Pops the oldest action from the buffer and evaluates it. After the evaluation this 
 * function returns the action. If no action is in the buffer, null will be returned.
 */
controller.doNextAction = function (){
  if( controller.actionBuffer_.isEmpty() ){
    return null;
  }

  var data = controller.actionBuffer_.pop();
  if( DEBUG ){
    util.log("evaluate action",JSON.stringify(data));
  }

  var cmd = controller.actionObjects_[ data[data.length-1] ];
  cmd.action.apply( cmd, data );
  
  return data;
};
/**
 *
 * Every loader must be configured to load a map from a given map specification
 * into the actual model. If an outdated map specification us used, the model
 * must be prepared to work with the current model.
 * 
 * @namespace
 */
controller.serializationHandler = {

  /**
   * API
   * 
   * @namespace
   */
  "interface":{

    /**
     * Saves the domain model.
     */
    save: null,

    /**
     * Loads a model into the domain model.
     *
     * @param {object} data
     */
    load: null,

    /**
     * Serializes an unit object.
     *
     * @param {object} unit
     */
    serializeUnit: null,

    /**
     * Deserializes an unit object and prepares the model.
     *
     * @param {Array} data
     */
    deserializeUnit: null,

    /**
     * Serializes an player object.
     *
     * @param {object} player
     */
    serializePlayer: null,

    /**
     * Deserializes an player object and prepares the model.
     *
     * @param {Array} data
     */
    deserializePlayer: null,

    /**
     * Serializes a property object.
     *
     * @param {object} property
     */
    serializeProperty: null,

    /**
     * Deserializes an property object and prepares the model.
     *
     * @param {Array} data
     */
    deserializeProperty: null
  },

  // #########################################################################

  /**
   * Map serialization transfer functions for the milestone 2.6
   * map specifications.
   * 
   * @namespace
   */
  "2.6":{

    save: function(){
      var dom = {};

      // META DATA
      dom.day = model.day;
      dom.turnOwner = model.turnOwner;
      dom.mapWidth = model.mapWidth;
      dom.mapHeight = model.mapHeight;

      // MAP
      dom.map = [];
      var mostIdsMap = {};
      var mostIdsMapCurIndex = 0;
      for( var x=0,xe=model.mapWidth; x<xe; x++ ){

        dom.map[x] = [];
        for( var y=0,ye=model.mapHeight; y<ye; y++ ){

          var type = dom.map[x][y];

          if( !mostIdsMap.hasOwnProperty(type) ){
            mostIdsMap[type] = mostIdsMapCurIndex;
            mostIdsMapCurIndex++;
          }

          dom.map[x][y] = mostIdsMap[type];
        }
      }

      // ADD TYPE MAP
      dom.typeMap = [];
      var typeKeys = Object.keys( mostIdsMap );
      for( var i=0,e=typeKeys.length; i<e; i++ ){
        dom.typeMap[ mostIdsMap[typeKeys[i]] ] = typeKeys[i];
      }

      // UNITS
      dom.units = [];
      for( var i=0,e=model.units.length; i<e; i++ ){
        if( model.units[i].owner !== CWT_INACTIVE_ID ){
          dom.units.push( this.serializeUnit(model.units[i]) );
        }
      }

      // PROPERTIES
      dom.properties = [];
      for( var i=0,e=model.properties.length; i<e; i++ ){
        if( model.properties[i].owner !== CWT_INACTIVE_ID ){
          dom.properties.push( this.serializeProperty(model.properties[i]) );
        }
      }

      // PLAYERS
      dom.players = [];
      for( var i=0,e=model.players.length; i<e; i++ ){
        if( model.players[i].team !== CWT_INACTIVE_ID ){
          dom.players.push( this.serializePlayer(model.players[i]) );
        }
      }

      // ACTORS
      dom.actors = [];
      for( var i=0,e=model.leftActors.length; i<e; i++ ){
        if( model.leftActors[i] ){
          dom.actors.push( i );
        }
      }

      dom.rules = {};
      var keys = Object.keys( model.rules );
      for( var i= 0,e=keys.length; i<e; i++ ){
        var key = keys[i];
        dom.rules[ key ] = model.rules[ key ];
      }

      return dom;
    },

    load: function( data ){

      model.day = data.day;
      model.turnOwner = data.turnOwner;
      model.mapWidth = data.mapWidth;
      model.mapHeight = data.mapHeight;

      // MAP
      for( var x=0,xe=model.mapWidth; x<xe; x++ ){
        for( var y=0,ye=model.mapHeight; y<ye; y++ ){
          model.unitPosMap[x][y] = null;
          model.propertyPosMap[x][y] = null;
          model.map[x][y] = data.typeMap[ data.map[x][y] ];
        }
      }

      // UNITS
      for( var i=0,e=model.units.length; i<e; i++ ){
        model.units[i].owner = CWT_INACTIVE_ID;
      }

      for( var i=0,e=data.units.length; i<e; i++ ){
        this.deserializeUnit( data.units[i] );
      }

      // PROPERTIES
      for( var i=0,e=model.properties.length; i<e; i++ ){
        model.properties[i].owner = CWT_INACTIVE_ID;
      }

      for( var i=0,e=data.properties.length; i<e; i++ ){
        this.deserializeProperty( data.properties[i] );
      }

      // PLAYERS
      for( var i=0,e=model.players.length; i<e; i++ ){
        model.players[i].team = CWT_INACTIVE_ID;
      }

      for( var i=0,e=data.players.length; i<e; i++ ){
        this.deserializePlayer( data.players[i] );
      }

      // ACTORS
      for( var i=0,e=model.leftActors.length; i<e; i++ ){
        model.leftActors[i] = false;
      }

      for( var i=0,e=data.leftActors.length; i<e; i++ ){
        model.leftActors[ data.leftActors[i] ] = true;
      }

      model.setRulesByOption( data.rules );

    },

    serializeUnit: function( unit ){

      return [
        model.extractUnitId(unit),
        unit.type,
        unit.x,
        unit.y,
        unit.hp,
        unit.ammo,
        unit.fuel,
        unit.loadedIn,
        unit.owner
      ];
    },

    deserializeUnit: function( data ){

      // GET UNIT
      var id = data[0];
      var unit = model.units[id];

      // INJECT DATA
      unit.type     = data[1];
      unit.x        = data[2];
      unit.y        = data[3];
      unit.hp       = data[4];
      unit.ammo     = data[5];
      unit.fuel     = data[6];
      unit.loadedIn = data[7];
      unit.owner    = data[8];

      model.unitPosMap[ data[2] ][ data[3] ] = unit;
    },

    serializePlayer: function( player ){

      return [
        player.extractPlayerId( player ),
        player.name,
        player.gold,
        player.team
      ];
    },

    deserializePlayer: function( data ){

      // GET PLAYER
      var id = data[0];
      var player = model.players[id];

      // INJECT DATA
      player.name = data[1];
      player.gold = data[2];
      player.team = data[3];
    },

    serializeProperty: function( property ){

      // SEARCH POSITION
      var px,py;
      var found = false;
      for( var x=0; x<model.mapWidth && !found; x++ ){
        for( var y=0; y<model.mapHeight && !found; y++ ){
          if( model.propertyPosMap[x][y] === property ){
            px = x;
            py = y;
            found = true;
          }
        }
      }

      return [
        model.extractPropertyId( property ),
        px,
        py,
        property.type,
        property.capturePoints,
        property.owner
      ];
    },

    deserializeProperty: function( data ){

      // GET PROPERTY
      var id = data[0];
      var property = model.properties[id];

      // INJECT DATA
      property.type          = data[3];
      property.capturePoints = data[4];
      property.owner         = data[5];

      model.propertyPosMap[ data[1] ][ data[2] ] = property;
    }
  }
 
};

/**
 * Current active serialization handler version.
 * 
 * @constant
 */
controller.CURRENT_SERIALIZATION_HANDLER = "2.6";

/**
 * Returns the correct {@link controller.serializationHandler} object for the given 
 * version.
 * 
 * @param {String} version 
 * @returns serialization handler object
 */
controller.getActiveSerializationHandler = function( version ){
  if( arguments.length === 1 ){
    if( DEBUG &&  !controller.serializationHandler.hasOwnProperty( version ) ){
      util.raiseError("unknown map format");
    }

    return controller.serializationHandler[ version ];
  }
  else return controller.serializationHandler[ controller.CURRENT_SERIALIZATION_HANDLER ];
};
/**
 * Returns true if the current session a network session, else false.
 */
controller.isNetworkGame = function(){
  return false;
};

/**
 * Parses a network message and invokes the action stack with the 
 * decoded message as argument.
 * 
 * @config
 */
controller._parseNetworkMessage = function( msg ){
  //var data = JSON.parse( msg );
  util.unexpectedSituationError();
};

/**
 * Encodes an argument array and sends it to the server instance.
 *
 * @config
 */
controller.sendNetworkMessage_ = function( args ){
  //var msg = JSON.stringify( arguments );
  util.unexpectedSituationError();
};

controller.eventScripts_ = {};

controller.scripts_ = {};

controller.SCRIPT_TRIGGER = {
  MOVE_ON_TILE :  0,
  MOVE_OFF_TILE : 1,
  UNIT_ATTACKED : 2
};

controller.SCRIPT_ACTIONS = {
  LOG : 0
};

controller.addScriptEvent = function( id, trigger, action ){
  controller.eventScripts_[trigger] = [];
  controller.eventScripts_[trigger].push( action );
};

controller.triggerScriptEvent = function( name, obj ){

};


/**
 *
 *
 *
 */
controller.ruleInterpreter = function( value, rules ){
  for( var i=0,e=rules.length; i<e; i++ ){
    
    var ruleAst = rules[i];
    var key = ruleAst[0];
    switch( key ){
      
      case 0:
        value += ruleAst[1];
        break;
      
      case 1:
        value *= ruleAst[1];
        break;
        
      case 2:
        value = ruleAst[1];
        break;
        
    }
  }
    
  return value;
};
/**
 * The central finite state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine = /** @lends controller.stateMachine */ {
  
  /**
   * Represents a breaking transition event. To break a transition it should
   * be used in an event function of a state implementation.
   * 
   * @constant
   * @example 
   *    action: function(){
   *        return this.BREAK_TRANSITION;
   *    }
   */
  BREAK_TRANSITION: "__BREAK_TRS__",
  
  /**
   * Current active state.
   */
  state:     "NONE",
  
  /**
   * State history that contains a queue of the state flow.
   * 
   * @type Array
   */
  history:[],
  
  /**
   * Represents a return to last state event. To return to the last state it 
   * should be used in an event function of a state implementation. 
   * 
   * @constant
   * @example 
   *    cancel: function(){
   *        return this.lastState;
   *    }
   */
  lastState: "__LAST_STATE_TRS__",
  
  /**
   * State machine construction diagram object. Every state and transition will 
   * be defined in this descriptor object.
   * 
   * @namespace
   */
  structure: {},
  
  /**
   * Invokes an event in the current active state.
   * 
   * @param {String} ev event name
   * @param {...Object} arguments for the event
   */
  event: function( ev ){
    if( DEBUG ) util.log("got event",ev);
    
    var stateEvent = this.structure[ this.state ][ ev ];
    if( stateEvent === undefined ){
      util.raiseError("missing event",ev,"in state",this.state);
    }
    
    var nextState = stateEvent.apply( this, arguments );
    if( nextState !== undefined ){
      if( nextState !== this.BREAK_TRANSITION ){
        
        var goBack = nextState === this.lastState;
        if( goBack ){
          if( this.history.length === 1 ) nextState = "IDLE";
          else nextState = this.history.pop();
        }
        
        var nextStateImpl = this.structure[ nextState ];
        if( nextStateImpl === undefined ){
          util.raiseError("state",nextState,"is not defined");
        }
        
        if( nextStateImpl.onenter !== undefined ){
          
          var breaker = nextStateImpl.onenter.apply( this, arguments );
          if( breaker === this.BREAK_TRANSITION ){
            
            // BREAK TRANSITION
            return;
          }
          else if( breaker !== undefined ){
            
            
          }
        }
        
        if( !goBack ){
          this.history.push( this.state );
        }
        
        this.state = nextState;
        if( DEBUG ) util.log("changed state to",nextState);
        
        if( nextStateImpl.actionState !== undefined ){
          this.event.call( this, "actionState" );
        }
        
      }
      else if( ev === "actionState" ){
        util.raiseError("an action state cannot return a break transition"); 
      }
    }
    else {
      util.raiseError("an event must return a transition command"); 
    }
  }
};
/**
 * Action process data memory object. It is used as data holder to transport
 * data between the single states of the state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine.data = {

   /**
    * Sets a position in the data object. The target name of the position will
    * be determined by the tags array.
    * 
    * @private
    * @param {Array} tags list of the position property names
    * @param {Number} x x coordinate
    * @param {Number} y y coordinate
    */
  setPosition_: function( tags, x,y ){
    var refObj;

    this[tags[0]] = x;
    this[tags[1]] = y;
    var isValid = (x !== -1 && y !== -1);
    var inFog = isValid? (model.fogData[x][y] === 0) : false;

    // ----- UNIT -----
    refObj = isValid? model.unitPosMap[x][y] : null;
    if( isValid && !inFog && refObj !== null && 
        ( !refObj.hidden || refObj.owner === model.turnOwner || model.players[ refObj.owner ].team == model.players[ model.turnOwner ].team ) ){
      
      this[tags[2]] = refObj;
      this[tags[3]] = model.extractUnitId(refObj);
    }
    else{
      this[tags[2]] = null;
      this[tags[3]] = -1;
    }

    // ----- PROPERTY -----
    refObj = isValid? model.propertyPosMap[x][y] : null;
    if( isValid && !inFog && refObj !== null ){
      this[tags[4]] = refObj;
      this[tags[5]] = model.extractPropertyId(refObj);
    }
    else{
      this[tags[4]] = null;
      this[tags[5]] = -1;
    }
  },

  /** X coordinate of the source position */
  sourceX:0,
  
  /** Y coordinate of the source position */
  sourceY:0,
  
  /** Unit object at the source position */        
  sourceUnit:null,
  
  /** Unit id at the source position */
  sourceUnitId:-1,
  
  /** Property object at the source position */
  sourceProperty:null,
  
  /** Property id at the source position */
  sourcePropertyId:-1,

  /** Property names of the source position */
  sourceTags_: [ "sourceX","sourceY","sourceUnit","sourceUnitId","sourceProperty","sourcePropertyId" ],

  /**
   * Sets the source position.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  setSource: function( x,y ){
    this.setPosition_( this.sourceTags_, x,y );
  },

  /** X coordinate of the target position */
  targetX:0,
  
  /** Y coordinate of the target position */
  targetY:0,
  
  /** Unit object at the target position */         
  targetUnit:null,
  
  /** Unit id at the target position */ 
  targetUnitId:-1,
  
  /** Property object at the target position */         
  targetProperty:null,
          
  /** Property id at the target position */ 
  targetPropertyId:-1,
          
  /** Property names of the target position */
  targetTags_: [ "targetX","targetY","targetUnit","targetUnitId","targetProperty","targetPropertyId" ],
          
  /**
   * Sets the target position.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  setTarget: function( x,y ){
    this.setPosition_( this.targetTags_, x,y );
  },

  /** X coordinate of the selection position */
  selectionX:0,
          
  /** Y coordinate of the selection position */
  selectionY:0,
  
  /** Unit object at the selection position */         
  selectionUnit:null,
          
  /** Unit id at the selection position */ 
  selectionUnitId:-1,
          
  /** Property object at the selection position */
  selectionProperty:null,
          
  /** Property id at the selection position */
  selectionPropertyId:-1,

  /** Property names of the selection position */
  selectionTags_: [ "selectionX","selectionY","selectionUnit","selectionUnitId","selectionProperty","selectionPropertyId" ],
          
  /**
   * Sets the selection position.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  setSelectionTarget: function( x,y ){
    this.setPosition_( this.selectionTags_, x,y );
  },

  // -------------------------------------------------

  /**
   * Move path of a selected unit.
   */
  movePath: [],

  /**
   * Cleans the move path from move codes.
   */
  cleanMovepath: function(){
    this.movePath.splice(0);
  },

  /**
   * Clones the path and returns the created array.
   */
  cloneMovepath: function(){
    var path = [];
    for( var i=0,e=this.movePath.length; i<e; i++ ){
      path[i] = this.movePath[i];
    }

    return path;
  },

  // -------------------------------------------------

  /**
   * Selection action key.
   */
  action: null,
          
  /**
   * Selected sub action object.
   */
  subaction: null,
          
  /**
   * Action object that represents the selected action.
   */
  actionObject: null,

  // -------------------------------------------------

  /**
   * X coordinate of the selection data.
   */
  selectionCX:0,
  
  /**
   * Y coordinate of the selection data.
   */        
  selectionCY:0,
          
  /**
   * Data matrix of the selection data.
   */
  selectionData: util.matrix(
    CWT_MAX_SELECTION_RANGE*4+1,
    CWT_MAX_SELECTION_RANGE*4+1,
    0
  ),
  
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} defValue value that will be set into every cell of the matrix
   */
  setSelectionCenter: function( x,y, defValue ){
    var data = this.selectionData;
    var e = data.length;
    var cx = x;
    var cy = y;
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        data[x][y] = defValue;
      }
    }

    // right bounds are not important
    this.selectionCX = Math.max(0, cx - CWT_MAX_SELECTION_RANGE*2);
    this.selectionCY = Math.max(0, cy - CWT_MAX_SELECTION_RANGE*2);
  },

  /**
   * Returns the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  getSelectionValueAt: function( x,y ){
    var data = this.selectionData;
    var cy = this.selectionCY;
    var cx = this.selectionCX;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;

    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
      return -1;
    }
    else return data[x][y];
  },
 
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} value value that will be set
   */
  setSelectionValueAt: function( x,y, value ){
    var data = this.selectionData;
    var cy = this.selectionCY;
    var cx = this.selectionCX;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;

    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
      util.raiseError();
    }
    else data[x][y] = value;
  },

  /**
   * Prepares the selection for a the saved action key and returns the correct selection state key.
   */
  prepareSelection: function(){
    var x = this.targetX;
    var y = this.targetY;

    this.setSelectionCenter( x,y, -1 );
    this.actionObject.prepareTargets( this );

    return ( this.actionObject.targetSelectionType === "A" )? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
  },

  // -------------------------------------------------

  /**
   * Menu list that contains all menu entries. This implementation is a cached list. The 
   * symantic size of the menu is marked by {@link controller.stateMachine.data.menuSize}.
   * 
   * @example
   *   data is [ entryA, entryB, entryC, null, null ]
   *   size is 3
   */
  menu: util.list( 20, null ),
          
  /**
   * Size of the menu.
   */
  menuSize:0,

  /**
   * Adds an object to the menu.
   * 
   * @param {Object} entry
   */
  addEntry: function( entry ){
    if( this.menuSize === this.menu.length ){
      util.raiseError();
    }

    this.menu[ this.menuSize ] = entry;
    this.menuSize++;
  },

  /**
   * Cleans the menu.
   */
  cleanMenu: function(){
    this.menuSize = 0;
  },

  /**
   * Prepares the menu for a given source and target position.
   */
  prepareMenu: function(){
    var commandKeys = Object.keys( controller.actionObjects_ );

    // ----- UNIT -----
    var unitActable = true;
    var selectedUnit = this.sourceUnit;
    if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ){
      unitActable = false;
    }
    else if( !model.canAct( this.sourceUnitId ) ) unitActable = false;

    // ----- PROPERTY -----
    var propertyActable = true;
    var property = this.sourceProperty;
    if( selectedUnit !== null ) propertyActable = false;
    if( property === null || property.owner !== model.turnOwner ){
      propertyActable = false;
    }

    for( var i=0,e=commandKeys.length; i<e; i++ ){
      var action = controller.getActionObject( commandKeys[i] );

      // IS USER CALLABLE ACTION ?
      if( !action.condition ) continue;

      // PRE DEFINED CHECKERS
      if( action.unitAction === true && !unitActable ) continue;
      if( action.propertyAction === true && !propertyActable ) continue;

      // CHECK CONDITION
      if( action.condition( this ) ){
        this.addEntry( commandKeys[i] );
      }
    }
  },
  
  // -------------------------------------------------
  
  inMultiStep: false

};
/**
 * @private
 */
controller._turnTimerTime = 0;

/**
 * Resets the turn timer.
 */
controller.resetTurnTimer = function(){
  controller._turnTimerTime = 0;
};

/**
 * Updates the turn timer.
 * 
 * @param {Number} delta time since last call
 */
controller.updateTurnTimer = function( delta ){
  if(controller._turnTimerTime >= 0 && model.rules.turnTimeLimit > 0 ){
    controller._turnTimerTime += delta;
    if( controller._turnTimerTime > model.rules.turnTimeLimit ){

      controller._turnTimerTime = -1;
      controller.pushSharedAction("NXTR");
    }
  }
};
/**
 * Action menu state that generates a list of possible action for a 
 * selected target tile.
 */
controller.stateMachine.structure.ACTION_MENU = {
  
    onenter: function(){
      
      this.data.cleanMenu();
      this.data.prepareMenu();

      if( this.data.menuSize === 0 ){        
        this.data.setTarget( -1,-1 );
        return this.BREAK_TRANSITION;
      }
    },
  
    action:function( ev, index ){
      var action = this.data.menu[ index ];
      var actObj = controller.getActionObject( action );
      
      this.data.action = action;
      this.data.actionObject = actObj;

      if( actObj.prepareMenu !== null ){
        return "ACTION_SUBMENU";
      }
      else if( actObj.isTargetValid !== null ){
        return "ACTION_SELECT_TILE";
      }
      else if( actObj.prepareTargets !== null && actObj.targetSelectionType === "A" ){
        return this.data.prepareSelection();
      }
      else return "FLUSH_ACTION";
    },

    cancel:function(){
      this.data.setTarget(-1,-1);
      return this.lastState;
    }
}
/**
 * Action sub menu state that generates a list of possible sub actions for 
 * an action to modify the selected action like select an unit that should
 * be unloaded.
 */
controller.stateMachine.structure.ACTION_SUBMENU = {
  
  onenter: function( ev, x,y ){
    if( !this.data.inMultiStep ){
      this.data.cleanMenu();
      controller.getActionObject( this.data.action ).prepareMenu( this.data );
      if( this.data.menuSize === 0 ){        
        util.raiseError("sub menu cannot be empty");
      }
    }
  },
  
  action: function( ev, index ){
    var action = this.data.menu[ index ];
    
    if( action === "done" ){
      return "IDLE";
    }
    
    this.data.subAction = action;
    
    if( this.data.actionObject.prepareTargets !== null && 
        this.data.actionObject.targetSelectionType === "B" ){
      
      return this.data.prepareSelection();
    }
    else return "FLUSH_ACTION";
  },
  
  
  cancel: function(){
    if( this.data.inMultiStep ) return this.lastState;
    
    this.data.cleanMenu();
    this.data.prepareMenu();
    
    return this.lastState;
  }
}
/**
 * Action state that converts the collected action data from client
 * to sharable transactions and pushes them into the action stack.
 */
controller.stateMachine.structure.FLUSH_ACTION = {
  
  actionState: function(){
    var trapped = false;
    if( this.data.movePath !== null ){
      var way = this.data.movePath;
      
      var cx = this.data.sourceX;
      var cy = this.data.sourceY;
      for( var i=0,e=way.length; i<e; i++ ){
        
        switch( way[i] ){
          case model.MOVE_CODE_DOWN  : cy++; break;
          case model.MOVE_CODE_UP    : cy--; break;
          case model.MOVE_CODE_LEFT  : cx--; break;
          case model.MOVE_CODE_RIGHT : cx++; break;
        }
        
        var unit = model.unitPosMap[cx][cy];
        if( unit !== null ){
          
          // TRAPPED ?
          if( model.players[model.turnOwner].team !==
             model.players[unit.owner].team ){
            
            // CONVERT TO TRAP WAIT
            this.data.action = "TRWT";
            this.data.setTarget(cx,cy);
            way.splice( i );
            trapped = true;
          }
        }
      }
    }
    
    // PUSH A COPY INTO THE COMMAND BUFFER
    var action;
    var actObj;
    var actArgs;
    
    if( this.data.movePath.length > 0 ){
      action = "MOVE";
      actObj = controller.getActionObject( action );
      actArgs = actObj.createDataSet( this.data );
      actArgs.push(action);
      controller.pushSharedAction.apply( null, actArgs );
    }
    
    action = this.data.action;
    actObj = this.data.actionObject;
    actArgs = actObj.createDataSet( this.data );
    actArgs.push(action);
    controller.pushSharedAction.apply( null, actArgs );
    
    if( !trapped && actObj.multiStepAction ){
      this.data.inMultiStep = true;
      controller.pushSharedAction.apply( null, ["IVMS"] );
      return "MULTISTEP_IDLE";
    }
    else return "IDLE";
  }
  
};
/**
 * The base state of a game round. An action process starts here, the 
 * action data of the state machine is always empty in this state.
 */
controller.stateMachine.structure.IDLE = {

  onenter: function(){
    this.data.cleanMenu();
    this.data.cleanMovepath();
    this.data.menuSize = 0;
    this.data.inMultiStep = false;
    this.data.action = null;
    this.data.subAction = null;
    this.data.setTarget(-1,-1);
    this.data.setSource(-1,-1);
    this.data.setSelectionTarget(-1,-1);
    this.history.splice(0);
    this.data.inMultiStep = false;
  },

  action: function(ev, x, y){
    var mem = this.data;

    mem.setSource(x, y);

    if ( mem.sourceUnitId !== CWT_INACTIVE_ID && mem.sourceUnit.owner === model.turnOwner && model.canAct(mem.sourceUnitId)){
      this.data.setTarget(x, y);
      this.data.cleanMovepath();
      model.fillMoveMap( this.data );
      return "MOVEPATH_SELECTION";
    } 
    else{
      this.data.setTarget(x,y);
      return "ACTION_MENU";
    }
  },

  cancel: function ( ev,x,y ) {
    return "IDLE_R";
  }

};
/**
 * Available from the {@link controller.stateMachine.structure.IDLE_R} state
 * and generates, if available, an attack range for a selected unit.
 */
controller.stateMachine.structure.IDLE_R = {

  onenter: function( ev, x,y ){
    this.data.setSource(x,y);
    if( this.data.sourceUnit !== null ){

      controller.getActionObject("ATUN").fillAttackableTiles( this.data );
    }
    else return this.BREAK_TRANSITION;
  },

  cancel: function () {
    return "IDLE";
  }

};
 controller.stateMachine.structure.MOVEPATH_SELECTION = {
  
    onenter: function( ev, x,y ){},
  
    action: function( ev,x,y ){
      if( this.data.getSelectionValueAt(x,y) < 0){
        if( CLIENT_DEBUG ){
          util.log("break event because selection is not in the map");
        }

        return this.BREAK_TRANSITION;
      }

      var ox = this.data.targetX;
      var oy = this.data.targetY;
      var dis = model.distance( ox,oy, x,y );

      this.data.setTarget( x,y );

      if( dis === 0 ){
        return "ACTION_MENU";
      }
      else if( dis === 1 ){

        // ADD TILE TO PATH
        var code = model.moveCodeFromAtoB( ox,oy, x,y );
        model.addCodeToPath( this.data, x,y, code );
        return this.BREAK_TRANSITION;
      }
      else{

        // GENERATE PATH
        model.setPathByRecalculation( this.data, x,y );
        return this.BREAK_TRANSITION;
      }
    },

    cancel: function(){

      this.data.setTarget(-1,-1);
      return this.lastState;
    }
  
}
controller.stateMachine.structure.MULTISTEP_IDLE = {
  
    nextStep: function(){

      var action = this.data.action;
      var actObj = this.data.actionObject;

      this.data.cleanMenu();
      this.data.cleanMovepath();

      actObj.prepareMenu( this.data );
      this.data.addEntry("done");
      
      this.data.inMultiStep = true;

      return ( this.data.menuSize > 1 )? "ACTION_SUBMENU": "IDLE";

    }
  
};
/**
 * The start state of the cwt state machine.
 */
controller.stateMachine.structure.NONE = {
    
    start: function(){
      return "IDLE";
    }
  
};
/**
 * The client selects a target tile in this step. The selected action generates a map of
 * selectable tiles. This selection will be invoked before(!) the sub menu.
 */
controller.stateMachine.structure.ACTION_SELECT_TARGET_A = {
    
    action: function( ev,x,y ){
      
      if( this.data.getSelectionValueAt(x,y) < 0){
        if( CLIENT_DEBUG ){
          util.log("break event because selection is not in the map");
        }

        return this.BREAK_TRANSITION;
      }

      this.data.setSelectionTarget(x,y);
      return "FLUSH_ACTION";
    },

    cancel: function(){
      return this.lastState;
    }
  
};
/**
 * The client selects a target tile in this step. The selected action generates a map of
 * selectable tiles. This selection will be invoked after(!) the sub menu.
 */
controller.stateMachine.structure.ACTION_SELECT_TARGET_B = controller.stateMachine.structure.ACTION_SELECT_TARGET_A;
/**
 * The client selects a target tile in this step. Unlike {@link controller.stateMachine.structure.ACTION_SELECT_TARGET_A}
 * and {@link controller.stateMachine.structure.ACTION_SELECT_TARGET_B} this state allows a free selection
 * over the map. Normally this state will be invoked by actions with the isTargetValid attribute. 
 */
controller.stateMachine.structure.ACTION_SELECT_TILE = {
    
    action: function( ev,x,y ){      
      if( this.data.actionObject.isTargetValid( this.data, x,y) ){
        
        this.data.setSelectionTarget(x,y);
        return "FLUSH_ACTION";
      }
      else return this.BREAK_TRANSITION;
    },

    cancel: function(){
      this.data.setSelectionTarget(-1,-1);
      return this.lastState;
    }
  
};
controller.engineAction({

  name:"addVision",
  
  key:"AVIS",
  
  /**
   * Places a visioner object at a given positin with a given range.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} range range of the visioner
   * 
   * @methodOf controller.actions
   * @name addVision
   */
  action: function( x,y, range ){
    if( model.rules.fogEnabled === false ){
      return;
    }
      
    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){
  
      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){
  
        model.fogData[lX][lY]++;
      }
    }
  }
});
controller.userAction({
  
  name:"attackUnit",
  
  key:"ATUN",
  
  unitAction: true,
  hasSubMenu: true,
  
  MOVABLE_CODE: 1,
  MOVABLE_ATTACKABLE_CODE: 2,
  ATTACKABLE_CODE: 3,

  fillAttackableTiles: function( data ){
    var sx = data.sourceX;
    var sy = data.sourceY;
    var unit = data.sourceUnit;
    
    model.fillMoveMap( data );
    
    var sdata = data.selectionData;
    var e = sdata.length;
    var cx = data.selectionCX;
    var cy = data.selectionCY;
    
    // SET MOVE DATA
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        if( sdata[x][y] >= 0 ) sdata[x][y] = this.MOVABLE_CODE;
      }
    }
    
    // GET TARGETS
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        if( sdata[x][y] === this.MOVABLE_CODE ||
            sdata[x][y] === this.MOVABLE_ATTACKABLE_CODE ){
          
          this.markTargets( data, unit, x,y, model.PRIMARY_WEAPON_TAG ); 
          this.markTargets( data, unit, x,y, model.SECONDARY_WEAPON_TAG ); 
          
          // TILE IS PROCESSED
          sdata[x][y] === this.ATTACKABLE_CODE;
        }
      }
    }
  },
  
  counterWeapon: function( xdef, ydef, xatt, yatt ){
    var dis = Math.abs(xdef-xatt) + Math.abs( ydef-yatt );
    if( dis > 1 ) return null; // INDIRECT ATTACK

    var def = model.unitPosMap[xdef][ydef];
    var att = model.unitPosMap[xatt][yatt];
    var defsheet = model.sheets.unitSheets[ def.type ];
    var mainWp = defsheet[model.PRIMARY_WEAPON_TAG];
    var sideWp = defsheet[model.SECONDARY_WEAPON_TAG];

    if( mainWp !== undefined ){
      mainWp = model.sheets.weaponSheets[ mainWp ];
      if( mainWp.usesAmmo === 0 || def.ammo > 0 ){
        var minR = mainWp.minRange;
        var maxR = mainWp.maxRange;
        if( minR === 1 && maxR === 1 && dis === 1 ) return mainWp;
      }
    }

    if( sideWp !== undefined ){
      sideWp = model.sheets.weaponSheets[ sideWp ];
      if( sideWp.usesAmmo === 0 || def.ammo > 0 ){
        var minR = sideWp.minRange;
        var maxR = sideWp.maxRange;
        if( minR === 1 && maxR === 1 && dis === 1 ) return sideWp;
      }
    }

    // NO POSSIBLE COUNTER WEAPON
    return null;
  },
  
  markTargets: function( data, unit, x, y, wpTag ){
    if( arguments.length === 2 ){
      x = unit.x;
      y = unit.y;
    }

    var spid = unit.owner;
    var steam = model.players[ unit.owner ].team;

    var usheet = model.sheets.unitSheets[ unit.type ];
    var wp     = model.sheets.weaponSheets[
      ( wpTag === model.PRIMARY_WEAPON_TAG )?
        usheet[model.PRIMARY_WEAPON_TAG] : usheet[model.SECONDARY_WEAPON_TAG]
      ];

    if( wp === undefined ) return;

    var minR = wp.minRange;
    var maxR = wp.maxRange;

    var lX;
    var hX;
    var lY = y-maxR;
    var hY = y+maxR;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-y );
      lX = x-maxR+disY;
      hX = x+maxR-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){

        if( model.distance( x,y, lX,lY ) >= minR ){
          
          var value = data.getSelectionValueAt( lX,lY );
              
          var tValue = this.ATTACKABLE_CODE;
          if( value === this.MOVABLE_CODE ){
              tValue = this.MOVABLE_ATTACKABLE_CODE;
          }
                 
          data.setSelectionValueAt( lX,lY, tValue );
        }
      }
    }
  },

  hasTargets: function( unit, wpTag, x, y, moved ){
    if( arguments.length === 2 ){
      x = unit.x;
      y = unit.y;
    }

    var spid = unit.owner;
    var steam = model.players[ unit.owner ].team;

    var usheet = model.sheets.unitSheets[ unit.type ];
    var wp     = model.sheets.weaponSheets[
      ( wpTag === model.PRIMARY_WEAPON_TAG )?
        usheet[model.PRIMARY_WEAPON_TAG] : usheet[model.SECONDARY_WEAPON_TAG]
      ];

    if( wp === undefined ) return false;

    if( wp.usesAmmo === 1 && unit.ammo === 0 ) return false;
    
    if( moved && wp.fireType === "INDIRECT" ) return false;
    
    var minR = wp.minRange;
    var maxR = wp.maxRange;

    var lX;
    var hX;
    var lY = y-maxR;
    var hY = y+maxR;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-y );
      lX = x-maxR+disY;
      hX = x+maxR-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){

        if( model.distance( x,y, lX,lY ) >= minR ){
          var tUnit = model.unitPosMap[ lX ][ lY ];
          if( tUnit !== null && tUnit.owner !== spid &&
            model.players[ tUnit.owner ].team !== steam ){

            // IN FOG ?
            if( model.fogData[lX][lY] === 0 ) continue;

            var dmg = model.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){
              return true;
            }
          }
        }
      }
    }
  },

  prepareMenu: function( data ){
    var selectedUnit = data.sourceUnit;
    var x = data.targetX;
    var y = data.targetY;

    // TODO --> MOVED <--
    if( this.hasTargets(selectedUnit,model.PRIMARY_WEAPON_TAG,x,y,true)){
      data.addEntry("mainWeapon");
    }
    if( this.hasTargets(selectedUnit,model.SECONDARY_WEAPON_TAG,x,y,true)){
      data.addEntry("subWeapon");
    }
  },

  targetSelectionType:"B",
  prepareTargets: function( data ){
    var selectedUnit = data.sourceUnit;
    var weapon = data.subAction;
    var tx = data.targetX;
    var ty = data.targetY;

    var wp = ( weapon === 'mainWeapon')?
      model.primaryWeaponOfUnit( selectedUnit ):
      model.secondaryWeaponOfUnit( selectedUnit );

    var spid = selectedUnit.owner;
    var steam = model.players[ selectedUnit.owner ].team;
    var minR = wp.minRange;
    var maxR = wp.maxRange;

    var lX;
    var hX;
    var lY = ty-maxR;
    var hY = ty+maxR;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-ty );
      lX = tx-maxR+disY;
      hX = tx+maxR-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){

        if( model.distance( tx,ty, lX,lY ) >= minR ){
          var tUnit = model.unitPosMap[ lX ][ lY ];
          if( tUnit !== null && tUnit.owner !== spid &&
            model.players[ tUnit.owner ].team !== steam ){

            // IN FOG ?
            if( model.fogData[lX][lY] === 0 ) continue;

            var dmg = model.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){

              if( DEBUG ){
                util.logInfo("found target at (",lX,",",lY,")");
              }

              data.setSelectionValueAt( lX,lY, 1 );
            }
          }
        }
      }
    }
  },

  condition: function( data ){
    var daysOfPeace = model.rules.daysOfPeace;
    if( model.day-1 < daysOfPeace ) return false;

    if( data.targetUnitId !== CWT_INACTIVE_ID && data.targetUnitId !== data.sourceUnitId ) return false;

    var selectedUnit = data.sourceUnit;
    
    var moved = false;
    if( data.movePath.length > 0 ){
      moved = true;
    }
    
    var x = data.targetX;
    var y = data.targetY;

    if(
      ( model.primaryWeaponOfUnit(selectedUnit) !== null &&
        this.hasTargets( selectedUnit,model.PRIMARY_WEAPON_TAG,x,y, moved )) ||
        ( model.secondaryWeaponOfUnit(selectedUnit) !== null &&
          this.hasTargets( selectedUnit,model.SECONDARY_WEAPON_TAG,x,y, moved ))

      ){
      return true;
    }
    else return false;
  },
  
  getEndDamage: function( attacker, wp, defender ){
    
    var BASE = model.getBaseDamage( wp, defender.type );
    
    var AHP = model.unitHpPt( attacker );
    var ACO = 100;
    var LUCK = parseInt( Math.random()*10, 10 );
    
    var DCO = 100;
    
    var ftype;
    if( model.propertyPosMap[defender.x][defender.y] !== null ){
      ftype = model.propertyPosMap[defender.x][defender.y].type;
    }
    else ftype = model.map[defender.x][defender.y];
    
    var DTR = model.sheets.tileSheets[ ftype ].defense;
    var DHP = model.unitHpPt( defender );
    
    // D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]
    var damage = (BASE*ACO/100+LUCK) * (AHP/10) * ( (200-( DCO+(DTR*DHP) ) ) /100 );
    damage = parseInt( damage, 10 );
    
    if( DEBUG ){
      util.log(
        "attacker: ",model.extractUnitId( attacker ),
        "[",BASE,"*",ACO,"/100+",LUCK,"]*(",AHP,"/10)*[(200-(",DCO,"+",DTR,"*",DHP,"))/100]",
        "=",damage
      );
    }
    
    return damage;
  },
  
  createDataSet: function( data ){
    
    var attWp = ( data.subAction === 'mainWeapon')? model.primaryWeaponOfUnit( data.sourceUnit ): model.secondaryWeaponOfUnit( data.sourceUnit );
    var attDmg = this.getEndDamage( data.sourceUnit, attWp, data.selectionUnit );
    
    var defDmg = 0;
    var defWp = this.counterWeapon( data.selectionX, data.selectionY, data.targetX, data.targetY );
    if( defWp !== null ){
      defDmg = this.getEndDamage( data.selectionUnit, defWp, data.sourceUnit );
    }
    
    return [ 
      
      data.sourceUnitId, 
      attDmg,
      attWp.usesAmmo !== 0,
      
      data.selectionUnitId, 
      defDmg,
      ( defWp !== null && defWp.usesAmmo !== 0 )
      
    ];
  },
  
  /**
   * One unit attacks another unit.
   *
   * @param {Number} aid unit id of the attacker
   * @param {Number} admg damage dealt by the attacker
   * @param {Boolean} aUseAmmo if true attacker ammo will be decreased
   * @param {Number} did unit id of the defender
   * @param {Number} ddmg damage dealt by the defender
   * @param {Boolean} dUseAmmo if true defender ammo will be decreased
   * 
   * @methodOf controller.actions
   * @name attackUnit
   */
  action: function( aid, admg, aUseAmmo, did, ddmg, dUseAmmo ){
    
    // ATTACK
    controller.actions.damageUnit( did, admg );
    controller.actions.wait( aid );
    
    if( aUseAmmo ) model.units[aid].ammo--;
    
    var dSheets = model.sheets.unitSheets[ model.units[did].type ];
    controller.actions.givePower( 
      model.units[aid].owner,  
      ( 0.5*parseInt( admg/10, 10 )*dSheets.cost )
    );
    
    // COUNTER ATTACK
    if( model.units[did].owner !== CWT_INACTIVE_ID ){
      controller.actions.damageUnit( aid, ddmg );  
      
      if( dUseAmmo ) model.units[did].ammo--;
      
      var aSheets = model.sheets.unitSheets[ model.units[aid].type ];
      controller.actions.givePower( 
        model.units[did].owner,  
        ( parseInt( admg/10, 10 )*dSheets.cost )
      );
    }
  }
});

/********
 Denoted as xxxXXXX where x = small star and X = big star..for now.
 Every star is worth 9000 fund at the start of the game. Each additional
 use of CO Power(including SCOP) increase the value of each star by 1800
 fund up to the tenth usage, when it won't increase any further.

 Stars on your Charge Meter can be charged in two ways:

 Damaging your oppoent's units. You gain meter equal to half the fund damage
 you deal. Receiving damage from your opponent. You gain meter equal to the
 fund damage you take. Keep in mind that AWBW only keeps track of real numbers
 for the purpose of Charge Meter calculation. That means taking a 57% attack
 and ending up with 5 hp only adds 0.5*full cost of unit to your Charge Meter.
 In Summary, the amount of charge added to your meter can be calculated as:

 (0.5*0.1*Damage Dealt*Cost of Unit X)+(0.1*Damage Received*Cost of Unit Y)


 It should be noted that a COs meter does not charge during the turn they activate a power.

 *****************/
controller.userAction({

  name:"buildUnit",

  key:"BDUN",
  
  propertyAction: true,

  hasSubMenu: true,

  canPropTypeBuildUnitType: function( pType, uType ){
    var pSheet = model.sheets.tileSheets[ pType ];
    var bList = pSheet.builds;
    if( bList === undefined ) return false;
    if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;

    if( bList.indexOf("*") !== -1 ) return true;
    if( bList.indexOf( uType ) !== -1 ) return true;

    var uSheet = model.sheets.unitSheets[ uType ];

    var moveType = uSheet.moveType;
    if( bList.indexOf( moveType ) !== -1 ) return true;

    return false;
  },

  getBuildList: function( pid ){
    var bl = [];
    var types = model.getListOfUnitTypes();
    var property = model.properties[ pid ];
    var propSheet = model.sheets.tileSheets[ property.type ];

    var budget = model.players[ model.turnOwner ].gold;
    for( var i=0,e=types.length; i<e; i++ ){
      if( this.canPropTypeBuildUnitType( property.type, types[i] ) ){
        if( model.sheets.unitSheets[types[i]].cost <= budget ) bl.push( types[i] );
      }
    }
    return bl;
  },

  condition: function( mem ){
    var property = mem.sourceProperty;
    if( model.countUnits(model.turnOwner) >= model.rules.unitLimit ){
      return false;
    }

    return (
      model.hasFreeUnitSlots( model.turnOwner ) &&
        this.getBuildList( model.extractPropertyId( property ) ).length > 0
    );
  },
  
  prepareMenu: function( mem ){
    var property = mem.sourceProperty;
    
    if( DEBUG && property === null ){ 
      util.raiseError();
    }

    var bList = this.getBuildList( mem.sourcePropertyId );
    for( var i=0,e=bList.length; i<e; i++ ){
      mem.addEntry( bList[i] );
    }
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceX, mem.sourceY, mem.subAction ];
  },

  /**
   * Builds an unit.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {String} type type of the unit
   *
   * @methodOf controller.actions
   * @name buildUnit
   */
  action: function( x,y, type ){

    controller.actions.createUnit( x,y, model.turnOwner, type );
    
    var uid = model.extractUnitId( model.unitPosMap[x][y] );
    var pl = model.players[ model.turnOwner ];
    
    pl.gold -= model.sheets.unitSheets[ type ].cost;

    controller.actions.wait( uid );
  }

});
controller.engineAction({

  name:"calculateFog",
  
  key:"CCFO",
  
  /**
   * Calculates the fog map for a given player id.
   *
   * @param {Number} pid player id
   *
   * @methodOf controller.actions
   * @name calculateFog
   */
  action: function( pid, weather ){
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var tid = model.players[pid].team;
    var fogEnabled = model.rules.fogEnabled;
    
    if( weather === undefined ) weather = model.weather.ID;
    
    var visionMod = model.sheets.weatherSheets[weather].visionChange;
    if( visionMod === undefined ){
      visionMod = 0;
    }
    
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        if( !fogEnabled ){
          model.fogData[x][y] = 1;
        }
        else{
          model.fogData[x][y] = 0;
        }
      }
    }
    
    if( fogEnabled ){
      for( x=0 ;x<xe; x++ ){
        for( y=0 ;y<ye; y++ ){
    
            //--------
            var unit = model.unitPosMap[x][y];
            if( unit !== null ){
              var sid = unit.owner;
              if( pid === sid || model.players[sid].team === tid ){
                var vision = model.sheets.unitSheets[unit.type].vision + visionMod;
                if( vision < 0 ) vision = 0;
                
                controller.actions.addVision( x,y, vision );
              }
            }
      
            //--------
            var property = model.propertyPosMap[x][y];
            if( property !== null ){
              var sid = property.owner;
              if( pid === sid || model.players[sid].team === tid ){
                var vision = model.sheets.tileSheets[property.type].vision + visionMod;
                if( vision < 0 ) vision = 0;
                
                controller.actions.addVision( x,y, vision );
              }
            }
        }
      }
    }
  }
  
});
controller.userAction({
  
  name:"captureProperty",

  key:"CTPR",
  
  unitAction: true,
  
  condition: function( mem ){
    return (
      mem.targetProperty !== null && 
      model.turnOwner !== mem.targetProperty.owner &&

      ( mem.targetUnit === null || mem.targetUnit === mem.sourceUnit ) &&

      model.sheets.tileSheets[ mem.targetProperty.type ].capturePoints > 0 &&
      model.sheets.unitSheets[ mem.sourceUnit.type ].captures > 0
    );
  },
  
  createDataSet: function( mem ){
    
    // ONE POINT FOR EVERY 10 HP STARTING WITH 9
    var points = parseInt( mem.sourceUnit.hp/10, 10 ) +1;
    
    return [
      mem.sourceUnitId,
      mem.targetPropertyId,
      mem.targetX,
      mem.targetY,
      points
    ];
  },
  
  /**
   * Captures a property.
   *
   * @param {Number} cid capturer id
   * @param {Number} prid property id
   * @param {Number} px x coordinate
   * @param {Number} py y coordinate
   * @param {Number} points capture points
   *
   * @methodOf controller.actions
   * @name captureProperty
   */
  action: function( cid, prid, px,py, points ){
    var selectedUnit = model.units[cid];
    var property = model.properties[prid];
    var unitSh = model.sheets.unitSheets[ selectedUnit.type ];

    selectedUnit.ST_CAPTURES = true;
    
    property.capturePoints -= points;
    if( property.capturePoints <= 0 ){
      var x = px;
      var y = py;

      if( DEBUG ){
        util.logInfo( "property at (",x,",",y,") captured");
      }

      // ADD VISION
      controller.actions.addVision( x,y, model.sheets.tileSheets[property.type].vision );

      if( property.type === 'HQTR' ){
        var pid = property.owner;
        var oldPlayer = model.players[pid];

        for( var i = pid*CWT_MAX_UNITS_PER_PLAYER,
                 e = i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

          if( model.units[i].owner !== CWT_INACTIVE_ID ){
            controller.pushAction( i, "DEUN" );
          }
        }

        for( var i = 0, e = model.properties.length; i<e; i++ ){
          if( model.properties[i].owner === pid ){
            model.properties[i].owner = -1;
          }
        }

        oldPlayer.team = -1;
        
        property.type = "CITY";

        // check win/loose
        var _teamFound = -1;
        for( var i=0,e=model.players.length; i<e; i++ ){
          var player = model.players[i];
          if( player.team !== -1 ){

            // FOUND AN ALIVE PLAYER
            if( _teamFound === -1 ) _teamFound = player.team;
            else if( _teamFound !== player.team ){
              _teamFound = -1;
              break;
            }
          }
        }

        // NO OPPOSITE TEAMS LEFT ?
        if( _teamFound !== -1 ){
          controller.pushAction("EDGM");
        }
      }

      // set new meta data for property
      property.capturePoints = 20;
      property.owner = selectedUnit.owner;

      var capLimit = model.rules.captureWinLimit;
      if( capLimit !== 0 && capLimit <= model.countProperties() ){
        controller.pushAction("EDGM");
      }
    }

    controller.actions.wait( cid );
  }
  
});
controller.engineAction({

  name:"changeWeather",
  
  key:"CWTH",
  
  /**
   * @methodOf controller.actions
   * @name changeWeather
   */
  action: function( wth, duration ){
    if( DEBUG ){
      util.log( "changing weather to",wth,"for",duration, "days" );
    }
    
    model.weatherDays = duration;
    model.weather = model.sheets.weatherSheets[ wth ];
    
    // WILL BE DONE AUTOMATICALLY
    // controller.pushAction("CCFO");
  }
});
controller.engineAction({

  name:"createUnit",
  
  key:"CRUN",
  
  /**
   * Creates an unit in the unit depot of a given player.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} pid player id of the player
   * @param {String} type type of the unit type
   *
   * @methodOf controller.actions
   * @name createUnit
   */
  action: function( x,y, pid, type ){

    var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
    for( var i=startIndex, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
  
      if( model.units[i].owner === CWT_INACTIVE_ID ){
  
        var typeSheet = model.sheets.unitSheets[ type ];
        var unit = model.units[i];
        unit.owner = pid;
        unit.hp = 99;
        unit.type = type;
        unit.ammo = typeSheet.maxAmmo;
        unit.fuel = typeSheet.maxFuel;
        unit.loadedIn = -1;
        unit.x = x;
        unit.y = y;
        
        model.unitPosMap[x][y] = unit;
        
        // controller.actions.addVision( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision );
        if( pid === model.turnOwner ) controller.pushAction( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision, "AVIS" );
        
        if( DEBUG ){
          util.log("build unit for player",pid,"in slot",i);
        }
        
        return;
      }
    }
  
    if( DEBUG ){
      util.raiseError("cannot build unit for player",pid,"no slots free");
    }
  }
});
controller.engineAction({

  name:"damageUnit",
  
  key:"DMUN",
  
  /**
   * Damages an unit.
   *
   * @param {Number} uid unit id
   * @param {Number} hp health points
   *
   * @methodOf controller.actions
   * @name damageUnit
   */
  action: function( uid, hp ){
    var unit = model.units[uid];
    
    unit.hp -= hp;
    if( unit.hp <= 0 ) controller.pushAction( uid, "DEUN" );
  }
  
});
controller.engineAction({

  name:"destroyUnit",
  
  key:"DEUN",
  
  /**
   * Destroys an unit.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name destroyUnit
   */
  action: function( uid ){
    
    var unit = model.units[uid];
    
    // controller.actions.removeVision( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision );
    if( unit.owner === model.turnOwner ){
      controller.pushAction( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision, "RVIS" );
    }
    
    var pid = unit.owner;
    unit.owner = CWT_INACTIVE_ID;
    if( unit.x !== -1 ) model.unitPosMap[ unit.x ][ unit.y ] = null;
    
    if( model.rules.noUnitsLeftLoose && model.countUnits( pid ) === 0 ){
      controller.pushAction("EDGM");
    }
  }
});
controller.engineAction({

  name: "endGame",

  key: "EDGM",

  /**
   * Ends the game round.
   *
   * @methodOf controller.actions
   * @name endGame
   */
  action: function(){

    if( DEBUG ){
      util.log("the game ends because no opposite players exists");
    }
  }

});
controller.userAction({

  name:"giveMoneyToPlayer",

  key:"GMTP",

  hasSubMenu: true,

  condition: function( mem ){
    if( model.players[ model.turnOwner ].gold < 500 ) return false;

    var property = mem.targetProperty;
    if( property === null ) return false;
    if( property.owner === model.turnOwner ) return false;

    return true;
  },

  prepareMenu: function( mem ){
    var availGold = model.players[ model.turnOwner ].gold;
    if( availGold >= 500 ) mem.addEntry(500);
    if( availGold >= 1000 ) mem.addEntry(1000);
    if( availGold >= 2500 ) mem.addEntry(2500);
    if( availGold >= 5000 ) mem.addEntry(5000);
    if( availGold >= 10000 ) mem.addEntry(10000);
    if( availGold >= 25000 ) mem.addEntry(25000);
    if( availGold >= 50000 ) mem.addEntry(50000);
  },

  createDataSet: function( mem ){
    var obj = mem.targetUnit;
    if( obj === null ){
      obj = mem.targetProperty;
    }

    return [ obj.owner, mem.subAction ];
  },

  /**
   * Transfers money from the gold depot of a player to the gold depot to an other player.
   *
   * @param {Number} pid player id of the target player
   * @param {Number} money money that will be transfered
   *
   * @methodOf controller.actions
   * @name giveMoneyToPlayer
   */
  action: function( pid, money ){
    var sPlayer = model.players[ model.turnOwner ];
    var tPlayer = model.players[ pid ];

    if( money > sPlayer.gold ){
        money = sPlayer.gold;
    }

    // TRANSFER GOLD
    sPlayer.gold -= money;
    tPlayer.gold += money;
  }

});
controller.engineAction({

  name:"givePower",
  
  key:"GIPO",
  
  /**
   * @methodOf controller.actions
   * @name givePower
   */
  action: function( pid, power ){
    model.players[ pid ].power += power;
  }
});
controller.userAction({

  name:"givePropertyToPlayer",

  key:"GPTP",

  propertyAction: true,
  hasSubMenu: true,

  /**
   * @param {controller.stateMachine.data} mem
   * @return {Boolean}
   */
  condition: function( mem ){
    var selected = mem.sourceProperty;
    if( selected === null ) return false;
    if( selected.type === "HQTR" ) return false;
    return true;
  },

  prepareMenu: function( mem ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ){
        mem.addEntry(i);
      }
    }
  },

  createDataSet: function( mem ){
    return [ mem.sourcePropertyId, mem.subAction ];
  },

  /**
   * Transfers a property of a player to an other player.
   *
   * @param {Number} pid property id
   * @param {Number} newOwner the id of the new owner
   *
   * @methodOf controller.actions
   * @name givePropertyToPlayer
   */
  action: function( pid, newOwner ){
    var prop =  model.properties[pid];
    prop.owner = newOwner;
    
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        if( model.propertyPosMap[x][y] === prop ){
          controller.pushAction( x, y, model.sheets.tileSheets[ prop.type ].vision, "RVIS" );
          return;
        }
      }
    }
  }

});
controller.userAction({

  name:"giveUnitToPlayer",

  key:"GUTP",

  unitAction: true,
  hasSubMenu: true,

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    if( selectedUnit === null ) return false;
    if( mem.targetUnit !== null ) return false;
    
    if( model.hasLoadedIds( mem.sourceUnitId ) ) return false; 
    
    var unit = mem.targetUnit;
    return unit !== selectedUnit;
  },

  prepareMenu: function( mem ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ){
        mem.addEntry(i);
      }
    }
  },

  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.subAction ];
  },

  /**
   * Transfers a property of a player to an other player.
   *
   * @param {Number} uid unit id
   * @param {Number} tpid the id of the new owner
   *
   * @methodOf controller.actions
   * @name giveUnitToPlayer
   */
  action: function( uid, tpid ){
    var selectedUnit = model.units[uid];
    var tx = selectedUnit.x;
    var ty = selectedUnit.y;
    var opid = selectedUnit.owner;
    
    selectedUnit.owner = CWT_INACTIVE_ID;
    
    // controller.actions.removeVision( selectedUnit.x, selectedUnit.y, model.sheets[ selectedUnit.type ].vision );
    if( model.players[tpid].team !== model.players[opid].team ){
      controller.pushAction( selectedUnit.x, selectedUnit.y, model.sheets.unitSheets[ selectedUnit.type ].vision, "RVIS" );
    }
    
    model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ] = null;
    
    controller.actions.createUnit( selectedUnit.x, selectedUnit.y, tpid, selectedUnit.type );
    var targetUnit =  model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ];
    targetUnit.hp = selectedUnit.hp;
    targetUnit.ammo = selectedUnit.ammo;
    targetUnit.fuel = selectedUnit.fuel;
    targetUnit.exp = selectedUnit.exp;
    targetUnit.type = selectedUnit.type;
    targetUnit.x = tx;
    targetUnit.y = ty;
    targetUnit.loadedIn = selectedUnit.loadedIn;
  }

});
controller.engineAction({

  name:"healUnit",
  
  key:"HEUN",
  
  /**
   * Heals an unit.
   *
   * @param {Number} uid unit id
   * @param {Number} hp health points
   *
   * @methodOf controller.actions
   * @name healUnit
   */
  action: function( uid, hp ){
    var unit = model.units[uid];
    
    unit.hp += hp;
    if( unit.hp > 99 ) unit.hp = 99;
    
    var num = -1;
    if( unit.hp <= 90 ){
      num = parseInt( unit.hp/10 , 10 )+1;
    }
    unit.ST_HP_NUM = num;
  }
});
controller.userAction({

  name:"hideUnit",
  
  key:"HIUN",
  
  unitAction: true,
  
  condition: function( mem ){
    if( mem.targetUnit !== null ) return false;
    
    var unit = mem.sourceUnit;
    if( unit === null ) return false;
    if( unit.hidden ) return false;
    
    var sheet = model.sheets.unitSheets[ unit.type ];
    
    return sheet.canHide;
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId ];
  },
  
  /**
   * Hides an unit.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name hideUnit
   */
  action: function( uid ){
    model.units[uid].hidden = true;
  }
});
controller.engineAction({

  name:"invokeMultiStepAction",
  key:"IVMS",

  /**
   * Invokes a multi step action.
   *
   * @methodOf controller.actions
   * @name invokeMultiStepAction
   */
  action: function(){
    controller.stateMachine.event("nextStep");
  }
});
controller.userAction({

  name:"join",
  key:"JNUN",
  
  unitAction: true,

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    var targetUnit = mem.targetUnit;
    
    if( selectedUnit === null || 
        targetUnit === null || 
        targetUnit.owner !== model.turnOwner ||
        targetUnit === selectedUnit ) return false;
    
    // NO LOAD MERGE
    if( model.hasLoadedIds( mem.sourceUnitId ) || 
        model.hasLoadedIds( mem.targetUnitId ) ) return false;

    return ( selectedUnit.type === targetUnit.type && targetUnit.hp < 89 );
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.targetUnitId ];
  },

  /**
   * Joins an unit into an other.
   *
   * @param {Number} pid source unit id
   * @param {Number} tid target unit id
   *
   * @methodOf controller.actions
   * @name join
   */
  action: function( sid, tid ){
    var joinSource = model.units[sid];
    var joinTarget = model.units[tid];
    var junitSheet = model.sheets.unitSheets[ joinTarget.type ];

    var sHp = model.unitHpPt( joinSource );
    var tHp = model.unitHpPt( joinSource );
    
    // HEALTH POINTS
    controller.actions.healUnit( tid, model.ptToHp(sHp) );

    // AMMO
    joinTarget.ammo += joinSource.ammo;
    if( joinTarget.ammo > junitSheet.maxAmmo ){
      joinTarget.ammo = junitSheet.maxAmmo;
    }

    // FUEL
    joinTarget.fuel += joinSource.fuel;
    if( joinTarget.fuel > junitSheet.maxFuel ){
      joinTarget.fuel = junitSheet.maxFuel;
    }

    controller.actions.destroyUnit( sid );
    controller.actions.wait( tid );
  }
});
controller.engineAction({

  name: "loadGame",

  key: "LDGM",

  /**
   * Loads a game file into the domain model.
   *
   * @param map map container
   *
   * @methodOf controller.actions
   * @name loadGame
   */
  action: function( map ){

    if( DEBUG ){
      util.log("start loading game instance");
    }

    // LOAD MAP
    var handler = controller.getActiveSerializationHandler( map.format );
    handler.load( map );

    // LOAD RULES
    model.setRulesByOption({});
    
    controller.actions.changeWeather( "SUN", 4+ parseInt( Math.random()*6, 10 ) );
    
    controller.actions.calculateFog( model.turnOwner );
    
    if( DEBUG ){
      util.log("game instance successfully loaded");
    }
  }
});
controller.engineAction({

  name: "loadMod",

  key: "LDMD",

  /**
   * Loads a modification.
   *
   * @methodOf controller.actions
   * @name loadMod
   */
  action: function(){

    for( var i=0,e=CWT_MOD_DEFAULT.movetypes.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.movetypes[i],
        model.sheets.MOVE_TYPE_SHEET
      );
    }

    for( var i=0,e=CWT_MOD_DEFAULT.tiles.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.tiles[i],
        model.sheets.TILE_TYPE_SHEET
      );
    }

    for( var i=0,e=CWT_MOD_DEFAULT.units.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.units[i],
        model.sheets.UNIT_TYPE_SHEET
      );
    }

    for( var i=0,e=CWT_MOD_DEFAULT.weapons.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.weapons[i],
        model.sheets.WEAPON_TYPE_SHEET
      );
    }
    
    for( var i=0,e=CWT_MOD_DEFAULT.weathers.length; i<e; i++ ){
      model.parseSheet(
        CWT_MOD_DEFAULT.weathers[i],
        model.sheets.WEATHER_TYPE_SHEET
      );
    }
    
    var langs = Object.keys( CWT_MOD_DEFAULT.locale );
    for( var i=0,e=langs.length; i<e; i++ ){
      util.i18n_appendToLanguage(
        langs[i],
        CWT_MOD_DEFAULT.locale[langs[i]]
      );
    }

    model.parseSheet( CWT_MOD_DEFAULT.rules, model.sheets.RULESET );
  }
});
controller.userAction({

  name:"loadUnit",

  key:"LODU",

  unitAction: true,

  condition: function( mem ){
    var selectedUnitId = mem.sourceUnitId;
    var transporterId = mem.targetUnitId;
    if( transporterId === -1 || mem.targetUnit.owner !== model.turnOwner){
      return false;
    }

    return (
      model.isTransport( transporterId ) &&
      model.canLoad( selectedUnitId, transporterId )
    );
  },

  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.targetUnitId ];
  },

  /**
   * Loads an unit into a transporter.
   *
   * @param {Number} uid load unit id
   * @param {Number} tid transporter id
   *
   * @methodOf controller.actions
   * @name loadUnit
   */
  action: function( uid, tid ){
    model.loadUnitInto( uid, tid );
  }

});
controller.engineAction({

  name: "makeActable",

  key: "MKAC",
  
  /**
   * Makes an unit id actable.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name makeActable
   */
  action: function( uid ){
    var uid = ( typeof uid === 'number' )? uid : model.extractUnitId( uid );
    var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;
  
    // NOT THE OWNER OF THE CURRENT TURN
    if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER ||
      uid < startIndex ){
  
      util.raiseError("unit owner is not the active player");
    }
  
    model.leftActors[ uid - startIndex ] = true;
  
    if( DEBUG ){
      util.log("unit",uid,"going into wait status");
    }
  }

});
controller.engineAction({

  name: "moveUnit",

  key: "MOVE",

  shared: true,

  createDataSet: function( data ){
    return [ data.cloneMovepath(), data.sourceUnitId, data.sourceX, data.sourceY ];
  },
  
  /**
   * Moves an unit from A to B.
   *
   * @param {Array} way move path of the unit
   * @param {Number} uid moving unit id 
   * @param {Number} x x coordinate of the source
   * @param {Number} y y coordinate of the source
   *
   * @methodOf controller.actions
   * @name moveUnit
   */
  action: function( way, uid, x,y ){
    var cX = x;
    var cY = y;
    var unit = model.units[ uid ];
    var uType = model.sheets.unitSheets[ unit.type ];
    var mType = model.sheets.movetypeSheets[ uType.moveType ];

    // CHECK MOVE WAY END
    var lastIndex = way.length-1;
    var fuelUsed = 0;
    for( var i=0,e=way.length; i<e; i++ ){

      // GET NEW CURRENT POSITION
      switch( way[i] ){

        case model.MOVE_CODE_UP:
          if( cY === 0 ) util.logError(
            "cannot do move command UP because",
            "current position is at the border"
          );
          cY--;
          break;

        case model.MOVE_CODE_RIGHT:
          if( cX === model.mapWidth-1 ) util.logError(
            "cannot do move command RIGHT because",
            "current position is at the border"
          );
          cX++;
          break;

        case model.MOVE_CODE_DOWN:
          if( cY === model.mapHeight-1 )util.logError(
            "cannot do move command DOWN because",
            "current position is at the border"
          );
          cY++;
          break;

        case model.MOVE_CODE_LEFT:
          if( cX === 0 ) util.logError(
            "cannot do move command LEFT because",
            "current position is at the border"
          );
          cX--;
          break;

        default: util.logError("unknown command ",way[i]);
      }

      // IS WAY BLOCKED ? TODO
      if( false && model.isWayBlocked( cX, cY, unit.owner, i == e-1 ) ){

        lastIndex = i-1;

        // GP BACK
        switch( way[i] ){

          case model.MOVE_CODE_UP:
            cY++;
            break;

          case model.MOVE_CODE_RIGHT:
            cX--;
            break;

          case model.MOVE_CODE_DOWN:
            cY--;
            break;

          case model.MOVE_CODE_LEFT:
            cX++;
            break;
        }


        if( lastIndex === -1 ){

          // THAT IS A FAULT
          util.raiseError( "unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!" );
        }

        break;
      }

      // INCREASE FUEL USAGE
      fuelUsed += model.moveCosts( mType, model.map[cX][cY], model.weather.ID );
    }

    unit.fuel -= fuelUsed;
    
    // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN)
    // SOMEWHERE
    if( unit.x !== -1 && unit.y !== -1 ){
      model.unitPosMap[ unit.x ][ unit.y ] = null;
      
      // controller.actions.removeVision( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision );
      controller.pushAction( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision, "RVIS" );
      
      unit.x = -1;
      unit.y = -1;
    }

    // DO NOT SET NEW POSITION IF THE POSITION IS OCCUPIED
    // THE SET POSITION LOGIC MUST BE DONE BY THE ACTION
    if( model.unitPosMap[cX][cY] === null ){
      unit.x = cX;
      unit.y = cY;
      model.unitPosMap[ cX ][ cY ] = unit;
      //controller.actions.addVision(  cX, cY, model.sheets.unitSheets[ unit.type ].vision );
      controller.pushAction( cX,cY, model.sheets.unitSheets[ unit.type ].vision, "AVIS" );
    }

    if( DEBUG ){
      util.log( "moved unit",uid,"from (",x,",",y,") to (",cX,",",cY,")" );
    }
  }

})
controller.engineAction({

  name:"moveVision",
  
  key:"MVIS",
  
  /**
   * Transfers a property of a player to an other player.
   *
   * @param {Number} sx x coordinate of the source
   * @param {Number} sy y coordinate of the source
   * @param {Number} tx x coordinate of the target
   * @param {Number} ty y coordinate of the target
   * @param {Number} range vision range of the visioner
   *
   * @methodOf controller.actions
   * @name moveVision
   */
  action: function( sx,sy, tx,ty, range ){
    controller.actions.removeVision(sx,sy,range);
    controller.actions.addVision(tx,ty,range);
  }
});
controller.userAction({
  
  name: "nextTurn",
  
  key: "NXTR",
  
  condition: function( mem ){
    if( mem.sourceUnit === null ) return true;
    if( mem.sourceUnit.owner === model.turnOwner ){
      return !model.canAct( mem.sourceUnitId );
    }
    else return true;
  },
  
  createDataSet: function( mem ){
    return [];
  },
  
  /**
   * Ends the turn for the current active player.
   *
   * @methodOf controller.actions
   * @name nextTurn
   */
  action: function(){
    var pid = model.turnOwner;
    var oid = pid;
    var wtp;
    
    // FIND NEXT PLAYER
    pid++;
    var turns = 1;
    while( pid !== oid ){
      
      if( pid === CWT_MAX_PLAYER ){
        
        pid = 0;
        model.day++;
        
        model.weatherDays--;
        if( model.weatherDays <= 0 ){
          var days;
          
          var old = model.weather.ID;
          if( old !== "SUN" ){
            days = 4 + parseInt( Math.random()*6, 10 );
            wtp = "SUN";
          }
          else{
            days = 1;
            
            var weatherKeys = Object.keys(model.sheets.weatherSheets);
            var oldIndex = weatherKeys.indexOf( old );
            
            if( oldIndex === -1 ) util.raiseError();
            
            weatherKeys.splice( oldIndex, 1 );
            
            var index = parseInt( Math.random()*weatherKeys.length, 10 );
            wtp = weatherKeys[index];
          }
          
          controller.pushSharedAction( wtp, days, "CWTH" );
        }
        
        var dayLimit = model.rules.dayLimit;
        if( dayLimit !== 0 && model.day === dayLimit ){
          controller.pushSharedAction("EDGM");
        }
      }
      
      if( model.players[pid].team !== CWT_INACTIVE_ID ){
        
        // FOUND NEXT PLAYER
        break;
      }
      
      // INCREASE ID
      pid++;
      turns++;
    }
    if( pid === oid ){
      util.raiseError();
    }
    
    model.turnOwner = pid;
  
    var turnOwnerObj = model.players[pid];  
    var cityRepair = model.rules.cityRepair;
    var fundsValue = model.rules.funds;
    var autoSupply = model.rules.autoSupplyAtTurnStart;
    var autoSupplyAllied = model.rules.resupplyUnitOnAlliedProperties;
    var healUnits = model.rules.healUnitsOnProperties;
    var healUnitsAllied = model.rules.healUnitsOnAlliedProperties;
  
    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex, e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
      var unit = model.units[i];
      
      model.leftActors[i-startIndex] = (unit !== null);
      
      if( unit !== null && unit.x !== -1  && unit.owner !== CWT_INACTIVE_ID ){
        
        // RESUPPLY APCR
        if( autoSupply && model.sheets.unitSheets[unit.type].hasOwnProperty("supply") ){
          controller.pushAction( i, unit.x, unit.y, "TSSP" );
        }
        
        // RESUPPLY CITY
        var property = model.propertyPosMap[ unit.x ][ unit.y ]
        if( property !== null && property.owner !== CWT_INACTIVE_ID ){
          
          var alliedProp = (model.players[property.owner].team === turnOwnerObj.team);
          
          if( property.owner === pid || ( autoSupplyAllied && alliedProp ) ){
            controller.pushAction( i, "RFRS" );
          }
          
          if( healUnits && unit.hp < 99 ){
            if( property.owner === pid || ( healUnitsAllied && alliedProp ) ){
              controller.pushAction( i, 20, "HEUN" );
            }
          }
        }
      }
    }
    
    for( var i=0,e=CWT_MAX_PROPERTIES; i<e; i++ ){
      
      if( model.properties[i].type === "SILO_EMPTY" ){
        controller.actions.siloRegeneration(i,turns);
      }
      
      // FUNDS
      if( model.properties[i].owner === pid ){
        turnOwnerObj.gold += fundsValue;
      }
    }
    
    controller.actions.calculateFog( pid, wtp );
    
    controller.resetTurnTimer();
  }
  
});
controller.engineAction({

  name:"refillRessources",

  key:"RFRS",

  /**
   * Refills ressources of an unit.
   *
   * @param {Number} x x coordinate of the supplier
   * @param {Number} y y coordinate of the supplier
   * 
   * @methodOf controller.actions
   * @name supplyTurnStart
   */
  action: function( uid ){
    var unit = model.units[uid];
    var uSheet = model.sheets.unitSheets[ unit.type ];
    unit.ammo = uSheet.maxAmmo;
    unit.fuel = uSheet.maxFuel;
  }
});
controller.engineAction({

  name:"removeVision",
  
  key:"RVIS",

  /**
   * Removes a visioner at a given position with a given range.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} range vision range of the visioner
   *
   * @methodOf controller.actions
   * @name removeVision
   */
  action: function( x,y, range ){
    if( model.rules.fogEnabled === false ){
      return;
    }
  
    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){
  
      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){
        
        model.fogData[lX][lY]--;
      }
    }
  }
});
controller.engineAction({

  name: "saveGame",

  key: "SAGA",

  /**
   * Saves the game round.
   *
   * @methodOf controller.actions
   * @name saveGame
   */
  action: function(){
    if( DEBUG ){
      util.log("start saving game instance");
    }

    var handler = controller.getActiveSerializationHandler();
    var json = handler.save();
    json = JSON.stringify( json, null, "\t" ); // SERIALIZE IT

    // data.setSubAction( json );

    if( DEBUG ){
      util.log("game instance successfully saved");
    }
  }
});
controller.userAction({

  name:"silofire",

  key:"SLFR",

  unitAction: true,

  _doDamage: function( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        unit.hp -= 20;
        if( unit.hp < 9 ) unit.hp = 9;
      }
    }
  },

  isTargetValid: function( mem, x,y ){
    return model.isValidPosition(x,y);
  },

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    var selectedProperty = mem.targetProperty;

    if( selectedProperty === null || selectedProperty.owner !== model.turnOwner ) return false;

    if( mem.targetUnit !== null ) return false;

    if( selectedUnit.type !== "INFT" && selectedUnit.type !== "MECH" ){
      return false;
    }

    return ( selectedProperty.type === "SILO" );
  },

  createDataSet: function( mem ){
    return [ 
      mem.sourceUnitId, 
      mem.targetX, mem.targetY, 
      mem.targetPropertyId, 
      mem.selectionX, mem.selectionY
    ];
  },

  action: function( uid, sx,sy, prid, tx,ty ){
    var dmgF = this._doDamage;
    var x = tx;
    var y = ty;

    // RANGE OF TWO -> CIRCLE SHAPE
    dmgF( x  ,y-2 );
    dmgF( x-1,y-1 );
    dmgF( x  ,y-1 );
    dmgF( x+1,y-1 );
    dmgF( x-2,y   );
    dmgF( x-1,y   );
    dmgF( x  ,y   );
    dmgF( x+1,y   );
    dmgF( x+2,y   );
    dmgF( x-1,y+1 );
    dmgF( x  ,y+1 );
    dmgF( x+1,y+1 );
    dmgF( x  ,y+2 );

    // SET EMPTY TYPE
    var px = sx;
    var py = sy;
    model.propertyPosMap[px][py].type = "SILO_EMPTY";
    controller.actions.wait( uid );
  }

});
controller.engineAction({

  name:"siloRegeneration",
  
  key:"SIRE",
  
  /**
   * Invokes a day tick for an empty silo.
   *
   * @param {Number} pid property id
   *
   * @methodOf controller.actions
   * @name siloRegeneration
   */
  action: function( pid, turns ){
    
    var maxDays = model.rules.siloRegeneration;
    if( maxDays === -1 ) return;
    
    if( model.regeneratingSilos.hasOwnProperty(pid) ){
      model.regeneratingSilos[pid] += turns;
    }
    else model.regeneratingSilos[pid] = turns;
    
    if( model.regeneratingSilos[pid] >= maxDays ){
      delete model.regeneratingSilos[pid];
      model.properties[pid].type = "SILO";
    }
  }
});
controller.engineAction({

  name: "startGame",

  key: "STGM",

  /**
   * Starts the game round.
   *
   * @methodOf controller.actions
   * @name startGame
   */
  action: function(){

  }

});
controller.userAction({

  name:"supply",

  key:"SPPL",

  unitAction: true,

  _resupplyUnitAt: function( x,y ){
    controller.pushAction( model.extractUnitId( model.unitPosMap[x][y] ), "RFRS" );
  },

  condition: function( mem ){

    var selectedUnit = mem.sourceUnit;
    var sSheet = model.sheets.unitSheets[ selectedUnit.type ];
    if( sSheet.supply === undefined ) return false;

    var pid = selectedUnit.owner;

    var x = mem.targetX;
    var y = mem.targetY;
    var check = model.thereIsAnOwnUnitAt;

    return (
      check(x-1,y,pid) ||
      check(x+1,y,pid) ||
      check(x,y-1,pid) ||
      check(x,y+1,pid)
    );
  },

  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.targetX, mem.targetY ];
  },

  /**
   * Supplies units that are near a supplier.
   *
   * @param {Number} sid supplier unit id
   * @param {Number} x x coordinate of the supplier
   * @param {Number} y y coordinate of the supplier
   * 
   * @methodOf controller.actions
   * @name supply
   */
  action: function( sid, x,y ){

    var selectedUnit = model.units[ sid ];
    var pid = selectedUnit.owner;
    var check = model.thereIsAnOwnUnitAt;
    var refill = this._resupplyUnitAt;

    if( check(x-1,y,pid) ){ refill(x-1,y); }
    if( check(x+1,y,pid) ){ refill(x+1,y); }
    if( check(x,y-1,pid) ){ refill(x,y-1); }
    if( check(x,y+1,pid) ){ refill(x,y+1); }

    controller.actions.wait(sid);
  }
});
controller.engineAction({

  name: "trapWait",

  key: "TRWT",

  createDataSet: function( data ){
    return [ data.selectionUnitId ];
  },
  
  /**
   * Trap wait action is invoked if a move path cannot be moved because
   * an enemy unit stays in the way.
   *
   * @param {Number} uid unit id
   * 
   * @methodOf controller.actions
   * @name trapWait
   */
  action: function( uid ){
    controller.actions.wait( uid );
  }

});
controller.engineAction({

  name:"supplyTurnStart",

  key:"TSSP",

  /**
   * Supplies units at turn start.
   *
   * @param {Number} sid supplier unit id
   * @param {Number} x x coordinate of the supplier
   * @param {Number} y y coordinate of the supplier
   * 
   * @methodOf controller.actions
   * @name supplyTurnStart
   */
  action: function( sid, x,y ){

    controller.actions.supply( sid, x,y );
    controller.actions.makeActable( sid );
  }
});
controller.userAction({

  name:"unhideUnit",
  
  key:"UHUN",
  
  unitAction: true,
  
  condition: function( mem ){
    if( mem.targetUnit !== null ) return false;
    
    var unit = mem.sourceUnit;
    if( unit === null ) return false;
    
    return unit.hidden;
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId ];
  },
  
  /**
   * Unhides an unit.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name unhideUnit
   */
  action: function( uid ){
    model.units[uid].hidden = false;
  }
});
controller.userAction({

  name: "unloadUnit",

  key: "UNUN",

  unitAction: true,
  multiStepAction: true,

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    if( mem.targetUnit !== null ) return false;

    var selectedUnitId = mem.sourceUnitId;
    return (
      model.isTransport( selectedUnitId ) &&
        model.hasLoadedIds( selectedUnitId )
      );
  },

  prepareMenu: function( mem ){
    var selectedId = mem.sourceUnitId;
    var loads = model.getLoadedIds( selectedId );
    for( var i=0,e=loads.length; i<e; i++ ){
      mem.addEntry( loads[i] );
    }
  },

  targetSelectionType: "B",
  prepareTargets: function( mem ){
    var subEntry = mem.subAction;
    var tx = mem.targetX;
    var ty = mem.targetY;

    var load = model.units[ subEntry ];
    var loadS = model.sheets.unitSheets[ load.type ];
    var loadMvS = model.sheets.movetypeSheets[ loadS.moveType ];
    
    var weather = model.weather.ID;

    if( tx > 0 ){
      if( model.unitPosMap[tx-1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx-1][ty] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx-1,ty,1 );
      }
    }

    if( ty > 0 ){
      if( model.unitPosMap[tx][ty-1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty-1] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx,ty-1,1 );
      }
    }

    if( ty < model.mapHeight-1 ){
      if( model.unitPosMap[tx][ty+1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty+1] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx,ty+1,1 );
      }
    }

    if( tx < model.mapWidth-1 ){
      if( model.unitPosMap[tx+1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx+1][ty] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx+1,ty,1 );
      }
    }
  },

  createDataSet: function( mem ){
    return [
      mem.sourceUnitId,
      mem.targetX,
      mem.targetY,
      mem.subAction,
      mem.selectionX,
      mem.selectionY
    ];
  },

  /**
   * Unloads an unit from an transporter to an neighbour tile´.
   *
   * @param {Number} transportId transporter id
   * @param {Number} trsx x coordinate of the transporter
   * @param {Number} trsy y coordinate of the transporter
   * @param {Number} loadId unit id of the load
   * @param {Number} tx x coordinate of the target
   * @param {Number} ty y coordinate of the target
   * 
   * @methodOf controller.actions
   * @name unloadUnit
   */
  action: function( transportId, trsx, trsy, loadId, tx,ty ){

    // SEND TRANSPORTER INTO WAIT
    controller.actions.wait( transportId );

    // SEND LOADED UNIT INTO WAIT
    model.unloadUnitFrom( loadId, transportId );

    var moveCode;
         if( tx < trsx ) moveCode = model.MOVE_CODE_LEFT;
    else if( tx > trsx ) moveCode = model.MOVE_CODE_RIGHT;
    else if( ty < trsy ) moveCode = model.MOVE_CODE_UP;
    else if( ty > trsy ) moveCode = model.MOVE_CODE_DOWN;
    
    controller.pushAction( [ moveCode ], loadId, trsx, trsy, "MOVE" );
    controller.pushAction( loadId, "WTUN" );
  }

});
controller.userAction({
  
  name:"wait",
  
  key:"WTUN",
  
  unitAction: true,
  
  condition: function( mem ){
    return ( mem.targetUnit === null || mem.targetUnit === mem.sourceUnit );
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId ];
  },
  
  /**
   * Sends an unit into the wait status.
   *
   * @param {Number} uid unit id
   * 
   * @methodOf controller.actions
   * @name wait
   */
  action: function( uid ){
    var uid = ( typeof uid === 'number' )? uid : model.extractUnitId( uid );
    var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;
  
    // NOT THE OWNER OF THE CURRENT TURN
    if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){
      util.raiseError("unit owner is not the active player");
    }
  
    model.leftActors[ uid - startIndex ] = false;
  
    if( DEBUG ){
      util.log("unit",uid,"going into wait status");
    }
  }
  
});