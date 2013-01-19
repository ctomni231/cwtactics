const DEBUG = true;



const CWT_INACTIVE_ID = -1;

const CWT_VERSION = "Milestone 2.4";

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
 *
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
 * Fills an array with a value. Works also for matrix objects.
 *
 * @param arr
 * @param defaultValue
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
 * @param len
 * @param defaultValue
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
 * @param w
 * @param h
 * @param defaultValue
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
 * Throws an error for an illegal unit id.
 */
util.illegalUnitIdError = function(){
  throw Error("illegal unit id");
};

/**
 * Throws an error for an illegal property id.
 */
util.illegalPropertyIdError = function(){
  throw Error("illegal unit id");
};

/**
 * Throws an error for an illegal argument.
 */
util.illegalArgumentError = function(){
  throw Error("illegal argument");
};

/**
 * Throws an error for a type error.
 */
util.typeError = function(){
  throw Error("type error");
};

/**
 * Throws an unexpected error.
 */
util.unexpectedSituationError = function(){
  throw Error("unexpected error");
};

/**
 * Throws an error for an illegal position.
 */
util.illegalPositionError = function(){
  throw Error("illegal map position");
};

/**
 * Throws an error for an illegal position.
 */
util.nullPointerError = function(){
  throw Error("null pointer");
};

/**
 *
 * @param obj
 */
util.isDefined = function( obj ){
  return obj !== undefined && obj !== null;
};

/**
 *
 * @param obj
 */
util.isFn = function( obj ){
  return typeof obj === "function";
};

/**
 *
 * @param obj
 */
util.isNumber = function( obj ){
  return typeof obj === "number";
};

/**
 *
 * @param obj
 */
util.isString = function( obj ){
  return typeof obj === "string";
};

/**
 *
 * @param obj
 */
util.isBool = function( obj ){
  return typeof obj === "boolean";
};
util.StringIdMapper = function(){
  this.map = {};
  this._len = 0;
};

/**
 *
 * @param key
 */
util.StringIdMapper.prototype.getIdFromKey = function( key ){
  return this.map[key];
};

/**
 *
 * @param id
 */
util.StringIdMapper.prototype.getKeyFromId = function( id ){
  var map = this.map;
  var keys = Object.keys( map );

  for( var i=0,e=keys.length; i<e; i++ ){
    if( map[keys[i]] === id ) return keys[i];
  }

  return null;
};

/**
 *
 * @param keyString
 */
util.StringIdMapper.prototype.registerKey = function( keyString ){
  if( this.map.hasOwnProperty( keyString ) ) throw Error();

  this.map[ keyString ] = this._len;
  this._len++;
};
util.i18n_data = { en:{} };
util.i18n_lang = util.i18n_data.en;

/**
 * Returns a localized string for a given key or if not exist the key itself.
 *
 * @param key
 */
util.i18n_localized = function( key ){
  var result = this.i18n_lang[key];
  return ( result === undefined )? key: result;
};

/**
 * Sets the active language.
 *
 * @param langKey
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
 * @param langKey
 * @param data
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
/** @constant */
util.LOG_INFO = 0;

/** @constant */
util.LOG_WARN = 1;

/** @constant */
util.LOG_ERROR = 2;

/** @config */
util.logWriter = function( level, string ){
  switch( level ){

    case util.LOG_ERROR:
      console.error( string );
      break;

    case util.LOG_INFO:
      console.log( string );
      break;

    case util.LOG_WARN:
      console.warn( string );
      break;

    default:  console.log( string );
  }
};

/**
 * Overwritable logging function.
 *
 * @param string
 * @config
 */
util.logInfo = function( string ){
  if( arguments.length > 1 ){
    string = Array.prototype.join.call( arguments, " " );
  }

  util.logWriter( util.LOG_INFO , string );
};

/**
 * Overwritable logging function.
 *
 * @param string
 * @config
 */
util.logWarn = function( string ){
  if( arguments.length > 1 ){
    string = Array.prototype.join.call( arguments, " " );
  }

  util.logWriter( util.LOG_WARN , string );
};

/**
 * Overwritable logging function.
 *
 * @param string
 * @config
 */
util.logError = function( error ){
  if( arguments.length > 1 ){
    error = Array.prototype.join.call( arguments, " " );
  }

  util.logWriter( util.LOG_ERROR, error );
};
util.createRingBuffer = function( size ){

  var buffer = {

    /**
     *
     * @param msg
     */
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
     *
     */
    isEmpty: function () {
      return ( this._data[ this._rInd ] === null );
    },

    /**
     *
     */
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

    /**
     *
     */
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
util.createStateMachine = function( state, factory ){

  return {

    state:function(){
      return state;
    },

    event:function( event ){
      if( DEBUG ){
        util.logInfo("got event",event);
      }

      var descr = factory[state][event];

      if( DEBUG && descr === undefined ){
        util.illegalArgumentError("event "+event+" not defined ");
      }

      // SET STATE
      state = ( typeof descr === "function" )?
        descr.apply( controller.input, arguments ): descr;

      if( DEBUG ){
        util.logInfo("enter new state",state);
      }

      if( DEBUG && !factory.hasOwnProperty(state) ){
        util.illegalArgumentError("state "+state+" is not defined");
      }

      descr = factory[state].onenter;
      if( descr !== undefined ){
        descr.apply( controller.input, arguments );
      }

      descr = factory[state].actionState;
      if( descr !== undefined ){
        controller.input.event( "actionState" );
      }
    }
  };
};
util.FUNCTION_TRUE_RETURNER = function(){ return true; };
util.FUNCTION_FALSE_RETURNER = function(){ return false; };

/**
 * Serializes a javascript object to a JSON specification compatible string.
 *
 * @param o
 */
util.objectToJSON = function( o ){
  return JSON.stringify(o);
};

/**
 *
 * @param ns
 * @param factory {function( function )}
 */
util.replaceFunction = function( ns, factory ){

  // SEARCH OBJECT
  var lookup = ns.split(".");
  var cobj = window;
  for( var i=0,e=lookup.length; i<e-1; i++ ){

    cobj = cobj[ lookup[i] ];
    if( cobj === undefined ){
      throw Error("illegal given namespace: does not exists");
    }
  }

  var lastName = lookup[ lookup.length -1 ];
  var fn = cobj[ lastName ];

  if( typeof fn !== 'function' ){
    throw Error("target object needs to be a function");
  }

  // SET NEW FN
  var res = factory( fn );
  if( typeof res !== 'function' ){
    throw Error("replacer factory needs to return a function");
  }
  cobj[ lastName ] = res;
};
model.fogData = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, 0 );

model.resetFogData = function( value ){
  if( arguments.length === 0 ) value = 0;
  var x = 0;
  var xe = model.mapWidth;
  var y;
  var ye = model.mapHeight;

  for( ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      model.fogData[x][y] = value;
    }
  }
};

model.fogOn = true;

model.generateFogMap = function( pid ){
  if( model.fogOn === false ){
    model.resetFogData(1);
    return;
  }

  var addV = model.setVisioner;
  var x = 0;
  var xe = model.mapWidth;
  var y;
  var ye = model.mapHeight;
  var tid = model.players[pid].team;

  model.resetFogData();

  for( ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){

      // ---------------------------------------------------------------

      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        var sid = unit.owner;
        if( pid === sid || model.players[sid].team === tid ){
          var vision = model.sheets.unitSheets[unit.type].vision;
          addV( x,y, vision );
        }
      }

      // ---------------------------------------------------------------

      var property = model.propertyPosMap[x][y];
      if( property !== null ){
        var sid = property.owner;
        if( pid === sid || model.players[sid].team === tid ){
          var vision = model.sheets.tileSheets[property.type].vision;
          addV( x,y, vision );
        }
      }

      // ---------------------------------------------------------------

    }
  }
};

model.setVisioner = function( x,y, range ){
  if( model.fogOn === false ){
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
};

model.removeVisioner = function( x,y, range ){
  if( model.fogOn === false ){
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
 * @param sx
 * @param sy
 * @param tx
 * @param ty
 */
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 *
 * @param ax
 * @param ay
 * @param bx
 * @param by
 */
model.moveCodeFromAtoB = function( ax,ay, bx,by ){
  if( model.distance( ax,ay, bx,by ) !== 1 ){
    util.illegalArgumentError("both positions haven't a distance of 1");
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

model.thereIsAnOwnUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid === unit.owner );
};

model.thereIsAnAlliedUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team === model.players[unit.owner].team);
};

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
 *
 * @param selectData
 * @param actionData
 */
model.fillMoveMap = function( selectData, actionData ){
  var unit   = actionData.getSourceUnit();
  var type   = model.sheets.unitSheets[unit.type];
  var mType  = model.sheets.movetypeSheets[ type.moveType ];
  var player = model.players[unit.owner];
  var range  = type.moveRange;
  var x = actionData.getSourceX();
  var y = actionData.getSourceY();

  // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
  if( unit.fuel < range ) range = unit.fuel;

  // ADD START TILE TO MAP
  selectData.cleanIt( CWT_INACTIVE_ID, x,y );
  selectData.setPositionValue( x,y,range );

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

      var cost = model.moveCosts( mType, model.map[ tx ][ ty ] );
      if( cost !== 0 ){

        var cunit = model.unitPosMap[tx][ty];
        if( cunit !== null &&
          model.fogData[tx][ty] > 0 &&
          model.players[cunit.owner].team !== player.team ){
          continue;
        }

        var rest = cp-cost;
        if( rest >= 0 &&
          rest > selectData.getPositionValue(tx,ty) ){

          // ADD TO MOVE MAP
          selectData.setPositionValue( tx,ty,rest );

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
      if( selectData.getPositionValue(x,y) !== -1 ){
        var cost = model.moveCosts( mType, model.map[x][y] );
        selectData.setPositionValue( x, y, cost );
      }
    }
  }
};

/**
 *
 * @param selectData
 * @param actionData
 * @param tx
 * @param ty
 * @param code
 */
model.addCodeToPath = function( selectData, actionData, tx, ty, code ){
  var fuelLeft = actionData.getSourceUnit().fuel;
  var fuelUsed = 0;
  var movePath = actionData.getMovePath();
  movePath.push( code );
  var points =  model.sheets.unitSheets[
    actionData.getSourceUnit().type
  ].moveRange;

  if( fuelLeft < points ) points = fuelLeft;

  var cx = actionData.getSourceX();
  var cy = actionData.getSourceY();
  for( var i=0,e=movePath.length; i<e; i++ ){

    switch( movePath[i] ){
      case model.MOVE_CODE_UP: cy--; break;
      case model.MOVE_CODE_DOWN: cy++; break;
      case model.MOVE_CODE_LEFT: cx--; break;
      case model.MOVE_CODE_RIGHT: cx++; break;
      default : util.illegalArgumentError();
    }

    fuelUsed += selectData.getPositionValue(cx,cy);
  }

  // GENERATE NEW PATH IF THE OLD IS NOT POSSIBLE
  if( fuelUsed > points ){
    model.setPathByRecalculation( selectData, actionData, tx,ty );
  }
};

/**
 *
 * @param selectData
 * @param actionData
 * @param tx
 * @param ty
 */
model.setPathByRecalculation = function( selectData, actionData, tx,ty ){
  var stx = actionData.getSourceX( );
  var sty = actionData.getSourceY( );
  var movePath = actionData.getMovePath();

  if ( DEBUG ) util.logInfo(
    "searching path from",
    "(", stx, ",", sty, ")",
    "to",
    "(", tx, ",", ty, ")"
  );

  // var graph = new Graph( nodes );
  var graph = new Graph( selectData.getDataMatrix() );

  var dsx = stx - selectData.getCenterX( );
  var dsy = sty - selectData.getCenterY( );
  var start = graph.nodes[ dsx ][ dsy ];

  var dtx = tx - selectData.getCenterX( );
  var dty = ty - selectData.getCenterY( );
  var end = graph.nodes[ dtx ][ dty ];

  var path = astar.search(graph.nodes, start, end);

  if ( DEBUG ){
    util.logInfo("calculated way is", path);
  }

  var codesPath = [];
  var cx = stx;
  var cy = sty;
  var cNode;

  for (var i = 0, e = path.length; i < e; i++) {
    cNode = path[i];

    var dir;
    if (cNode.x > cx) dir = model.MOVE_CODE_RIGHT;
    if (cNode.x < cx) dir = model.MOVE_CODE_LEFT;
    if (cNode.y > cy) dir = model.MOVE_CODE_DOWN;
    if (cNode.y < cy) dir = model.MOVE_CODE_UP;

    if (dir === undefined) throw Error();

    codesPath.push(dir);

    cx = cNode.x;
    cy = cNode.y;
  }

  movePath.splice(0);
  for( var i=0,e=codesPath.length; i<e; i++ ){
    movePath[i] = codesPath[i];
  }
};
model.players = util.list( CWT_MAX_PLAYER+1, function( index ){
  var neutral = (index === CWT_MAX_PLAYER );
  return {
    gold: 0,
    team: ( neutral )? 9999 : CWT_INACTIVE_ID,
    name: ( neutral )? "NEUTRAL" : null
  }
});

model.isNeutralPlayer = function( id ){
  return model.neutralPlayerId === id;
};

/**
 * Returns the neutral player id.
 */
model.neutralPlayerId = model.players.length-1;

model.alliedPlayers = function( pidA, pidB ){
  return model.players[pidA].team === model.players[pidB].team;
};

model.enemyPlayers = function( pidA, pidB ){
  return model.players[pidA].team !== model.players[pidB].team;
};
/**
 *
 */
model.properties = util.list( CWT_MAX_PROPERTIES+1, function(){
  return {
    capturePoints: 20,
    owner: -1
  }
});

/**
 *
 */
model.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH,
  CWT_MAX_MAP_HEIGHT,
  null
);

/**
 *
 * @param x
 * @param y
 */
model.tileIsProperty = function( x,y ){
  var prop = model.propertyPosMap[x][y];
  return prop !== undefined;
};

/**
 * Extracts the identical number from a property object.
 *
 * @param unit
 */
model.extractPropertyId = function( property ){
  if( property === null ){
    throw Error("property argument cannot be null");
  }

  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  throw Error("cannot find property",property );
};
/**
 * Two objects which have the same owner.
 *
 * @constant
 */
model.RELATIONSHIP_SAME_OWNER = 0;

/**
 * Two objects which have differnt of the same team.
 *
 * @constant
 */
model.RELATIONSHIP_ALLIED = 1;

/**
 * Two objects which have differnt owners of different teams.
 *
 * @constant
 */
model.RELATIONSHIP_ENEMY = 2;

/**
 * Two objects which have no relationship because one or both of them
 * hasn't an owner.
 *
 * @constant
 */
model.RELATIONSHIP_NONE = 3;

/**
 * @constant
 */
model.RELATIONSHIP_SAME_OBJECT = 4;


/**
 * Returns the relationship between two player identicals.
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
 * Removes an unit from the actable array. An unit that goes into
 * the wait status cannot do another action in the active turn.
 *
 * @param uid
 */
model.markAsUnusable = function( uid ){
  var uid = ( typeof uid === 'number' )? uid : model.extractUnitId( uid );
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  // NOT THE OWNER OF THE CURRENT TURN
  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER ||
    uid < startIndex ){

    util.logError("unit owner is not the active player");
  }

  model.leftActors[ uid - startIndex ] = false;

  if( DEBUG ){
    util.logInfo("unit",uid,"going into wait status");
  }
};
model.sheets = {};

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
 * Different sheet validators.
 *
 * @namespace
 */
model.sheets.typeSheetValidators = {

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
      ID: { type:'string', except:[], required:true }
    }
  },

  /** Schema for a move type sheet. */
  movetypeValidator: {
    type: 'object',
    properties: {
      ID: { type:'string', except:[], required:true },
      costs: {
        type: "object",
        patternProperties: {
          '[.]*': { type:"integer", minimum:0 } }
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

    default: util.logError("unknow type",type);
  }

  // CHECK IDENTICAL STRING FIRST
  if( db.hasOwnProperty(id) ) util.logError(id,"is already registered");

  // VALIDATE SHEET
  model.sheets._dbAmanda.validate( data, schema, function(e){
    if( e ) util.logError( "failed to parse sheet due", e.getMessages() );
  });

  db[id] = data;

  // REGISTER ID IN EXCEPTION LIST
  excList.push(id);
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
 *
 * @param unit
 */
model.primaryWeaponOfUnit = function( unit ){
  if( DEBUG && unit === null ) util.illegalArgumentError();

  if( typeof unit === 'number' ){
    unit = model.units[unit];
  }

  var type = model.sheets.unitSheets[ unit.type ][ model.PRIMARY_WEAPON_TAG ];
  return (type !== undefined )? model.sheets.weaponSheets[ type ] : null;
};

/**
 *
 * @param unit
 */
model.secondaryWeaponOfUnit = function( unit ){
  if( DEBUG && unit === null ) util.illegalArgumentError();

  if( typeof unit === 'number' ){
    unit = model.units[unit];
  }

  var type = model.sheets.unitSheets[ unit.type ][ model.SECONDARY_WEAPON_TAG ];
  return (type !== undefined )? model.sheets.weaponSheets[ type ] : null;
};

/**
 * Returns the base damage from a weapon sheet against an unit type.
 *
 * @param weapon weapon sheet
 * @param uType {string} unit type
 */
model.getBaseDamage = function( weapon, uType ){
  if( DEBUG && weapon === null ) util.illegalArgumentError();
  if( DEBUG && uType === null ) util.illegalArgumentError();

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
 * @param movetype
 * @param tiletype
 */
model.moveCosts = function( movetype, tiletype ){
  var c;

  // search id
  c = movetype.costs[ tiletype ];

  if( c === undefined ) c = movetype.costs["*"];

  return c;
};
/**
 * Retusn a list of loaded unit ids by a given transporter id.
 *
 * @param tid
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
 * @param tid
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
 * @param lid
 * @param tid
 */
model.isLoadedBy = function( lid, tid ){
  return model.units[ lid ].loadedIn === tid;
};

/**
 * Loads the unit with id lid into a tranporter with the id tid.
 *
 * @param lid
 * @param tid
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
 * @param lid
 * @param tid
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
 * @param lid
 * @param tid
 */
model.canLoad = function( lid, tid ){
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
 * @param tid
 */
model.isTransport = function( tid ){
  return model.sheets.unitSheets[
    model.units[ tid ].type ].transport !== undefined;
};

model.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

model.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER, function(){
  return {
    x:0,
    y:0,
    hp: 99,
    ammo: 0,
    type: null,
    loadedIn: -1,
    fuel: 0,
    owner: CWT_INACTIVE_ID,
    _clientData_: {}
  }
});

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
model.extractUnitId = function( unit ){
  if( unit === null ){
    throw Error("unit argument cannot be null");
  }

  var units = model.units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  throw Error("cannot find unit", JSON.stringify(unit) );
};

model.createUnit = function( pid, type ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  for( var i=startIndex, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( model.units[i].owner === CWT_INACTIVE_ID ){

      var typeSheet = model.sheets.unitSheets[ type ];
      model.units[i].owner = pid;
      model.units[i].hp = 99;
      model.units[i].type = type;
      model.units[i].ammo = typeSheet.maxAmmo;
      model.units[i].fuel = typeSheet.maxFuel;
      model.units[i].loadedIn = -1;

      if( util.DEBUG ){
        util.logInfo("builded unit for player",pid,"in slot",i);
      }

      return i;
    }
  }

  if( util.DEBUG ){
    throw Error("cannot build unit for player",pid,"no slots free");
  }
  return -1;
};

/**
 * Destroys an unit object and removes its references from the
 * game instance.
 */
model.destroyUnit = function( uid ){
  model.eraseUnitPosition( uid );
  model.units[uid].owner = CWT_INACTIVE_ID;
};

model.hasFreeUnitSlots = function( pid ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  for( var i=0, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){ return true; }
  }

  return false;
};

/**
 * Erases an unit position.
 *
 * @param uid
 */
model.eraseUnitPosition = function( uid ){
  var unit = model.units[uid];
  var ox = unit.x;
  var oy = unit.y;

  // clear old position
  model.unitPosMap[ox][oy] = null;
  unit.x = -1;
  unit.y = -1;

  // update fog
  var data = new controller.ActionData();
  data.setSource( ox,oy );
  data.setAction("remVisioner");
  data.setSubAction( model.sheets.unitSheets[unit.type].vision );
  controller.pushActionDataIntoBuffer(data);
};

/**
 * Sets the position of an unit.
 *
 * @param uid
 * @param tx
 * @param ty
 */
model.setUnitPosition = function( uid, tx, ty ){
  var unit = model.units[uid];
  var ox = unit.x;
  var oy = unit.y;

  unit.x = tx;
  unit.y = ty;

  model.unitPosMap[tx][ty] = unit;

  // model.setVisioner( tx, ty, model.sheets.unitSheets[unit.type].vision );
  var data = new controller.ActionData();
  data.setSource( tx,ty );
  data.setAction("addVisioner");
  data.setSubAction( model.sheets.unitSheets[unit.type].vision );
  controller.pushActionDataIntoBuffer(data);
};

/**
 * Returns true if a given position is occupied by an unit.
 *
 * @param x
 * @param y
 */
model.tileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return false;
  else return model.extractUnitId( unit );
};
/**
 * @private
 */
controller._actionDataPool = util.createRingBuffer(50);

/**
 * @return {controller.ActionData}
 */
controller.aquireActionDataObject = function(){
  var pool = controller._actionDataPool;
  if( pool.isEmpty() ){
    return new controller.ActionData();
  }
  else {
    return pool.pop();
  }
};

/**
 *
 * @param actionData
 */
controller.releaseActionDataObject = function( actionData ){
  if( DEBUG && !actionData instanceof controller.ActionData ){
    util.illegalArgumentError();
  }

  actionData.cleanIt();
  controller._actionDataPool.push( actionData );
};

/**
 * ActionData object that hold numerous information about an object action.
 */
controller.ActionData = function(){
  this.data = [];
  this.cleanIt();
};

/**
 *
 */
controller.ActionData.prototype.cleanIt = function(){

  // SOURCE POS
  this.data[0] = -1;
  this.data[1] = -1;

  // TARGET POS
  this.data[2] = -1;
  this.data[3] = -1;

  // ACTION TARGET POS
  this.data[4] = -1;
  this.data[5] = -1;

  this.data[6] = -1; // SOURCE UNIT ID
  this.data[7] = -1; // SOURCE PROP ID
  this.data[8] = -1; // TARGET UNIT ID
  this.data[9] = -1; // TARGET PROP ID

  // MOVE PATH
  this.data[10] = null;

  // ACTIONS
  this.data[11] = null;
  this.data[12] = null;
};

/**
 *
 */
controller.ActionData.prototype.setSource = function( x,y ){
  this.data[0] = x;
  this.data[1] = y;
};

/**
 *
 */
controller.ActionData.prototype.getSourceX = function(){
  return this.data[0];
};

/**
 *
 */
controller.ActionData.prototype.getSourceY = function(){
  return this.data[1];
};

/**
 *
 */
controller.ActionData.prototype.setTarget = function( x,y ){
  this.data[2] = x;
  this.data[3] = y;
};

/**
 *
 */
controller.ActionData.prototype.getTargetX = function(){
  return this.data[2];
};

/**
 *
 */
controller.ActionData.prototype.getTargetY = function(){
  return this.data[3];
};

/**
 *
 */
controller.ActionData.prototype.setActionTarget = function( x,y ){
  this.data[4] = x;
  this.data[5] = y;
};

/**
 *
 */
controller.ActionData.prototype.getActionTargetX = function(){
  return this.data[4];
};

/**
 *
 */
controller.ActionData.prototype.getActionTargetY = function(){
  return this.data[5];
};

/**
 *
 */
controller.ActionData.prototype.setSourceUnit = function( unit ){
  if( unit === null ) this.data[6] = -1;
  else this.data[6] = model.extractUnitId( unit );
};

/**
 *
 */
controller.ActionData.prototype.getSourceUnit = function(){
  var id = this.data[6];
  if( id === -1 ) return null;
  return model.units[id];
};

/**
 *
 */
controller.ActionData.prototype.getSourceUnitId = function(){
  return this.data[6];
};

/**
 *
 */
controller.ActionData.prototype.setSourceProperty = function( prop ){
  if( prop === null ) this.data[7] = -1;
  else this.data[7] = model.extractPropertyId( prop );
};

/**
 *
 */
controller.ActionData.prototype.getSourceProperty = function(){
  var id = this.data[7];
  if( id === -1 ) return null;
  return model.properties[id];
};

/**
 *
 */
controller.ActionData.prototype.getSourcePropertyId = function(){
  return this.data[7];
};

/**
 *
 */
controller.ActionData.prototype.setTargetUnit = function( unit ){
  if( unit === null ) this.data[8] = -1;
  else this.data[8] = model.extractUnitId( unit );
};

/**
 *
 */
controller.ActionData.prototype.getTargetUnit = function(){
  var id = this.data[8];
  if( id === -1 ) return null;
  return model.units[id];
};

/**
 *
 */
controller.ActionData.prototype.getTargetUnitId = function(){
  return this.data[8];
};

/**
 *
 */
controller.ActionData.prototype.setTargetProperty = function( prop ){
  if( prop === null ) this.data[9] = -1;
  else this.data[9] = model.extractPropertyId( prop );
};

/**
 *
 */
controller.ActionData.prototype.getTargetProperty = function(){
  var id = this.data[9];
  if( id === -1 ) return null;
  return model.properties[id];
};

/**
 *
 */
controller.ActionData.prototype.getTargetPropertyId = function(){
  return this.data[9];
};

/**
 *
 */
controller.ActionData.prototype.setMovePath = function( path ){
  this.data[10] = path;
};

/**
 *
 */
controller.ActionData.prototype.getMovePath = function(){
  return this.data[10];
};

/**
 *
 */
controller.ActionData.prototype.setAction = function( action ){
  this.data[11] = action;
};

/**
 *
 */
controller.ActionData.prototype.getAction = function(){
  return this.data[11];
};

/**
 *
 */
controller.ActionData.prototype.setSubAction = function( action ){
  this.data[12] = action;
};

/**
 *
 */
controller.ActionData.prototype.getSubAction = function(){
  return this.data[12];
};

/**
 *
 */
controller.ActionData.prototype.getCopy = function(){

  var actionData = controller.aquireActionDataObject();

  // COPY DATA
  actionData.data[0] = this.data[0];
  actionData.data[1] = this.data[1];
  actionData.data[2] = this.data[2];
  actionData.data[3] = this.data[3];
  actionData.data[4] = this.data[4];
  actionData.data[5] = this.data[5];
  actionData.data[6] = this.data[6];
  actionData.data[7] = this.data[7];
  actionData.data[8] = this.data[8];
  actionData.data[9] = this.data[9];
  actionData.data[10] = this.data[10];
  actionData.data[11] = this.data[11];
  actionData.data[12] = this.data[12];

  return actionData;
};
controller.commands = {};

controller.commandBuffer = util.createRingBuffer( 200 );

/**
 * Registers a command description.
 *
 * @param options
 */
controller.registerCommand = function( options ){
  if( DEBUG && !util.isString( options.key ) ) util.illegalArgumentError();
  if( DEBUG && !util.isFn( options.action ) ) util.illegalArgumentError();
  if( DEBUG && !util.isFn( options.condition ) ) util.illegalArgumentError();

  // DEFAULT OPTIONS
  var impl = {
    prepareMenu:     null,
    prepareTargets:  null,
    localAction:     false,
    multiStepAction: false,
    condition:       util.FUNCTION_TRUE_RETURNER
  };

  // MIXIN OPTIONS
  var key = options.key;
  var keys = Object.keys( options );
  for( var i=0,e=keys.length; i<e; i++ ){
    impl[ keys[i] ] = options[ keys[i] ];
  }

  controller.commands[ key ] = impl;
};

/**
 * Directly invokes the action phase of a command.
 *
 * @param data action data array
 * @param cKey action key ( optional, default value is data.getAction() )
 */
controller.invokeCommand = function( data, cKey ){
  if( arguments.length === 1 ) cKey = data.getAction();

  if( DEBUG && !util.isString( cKey ) ) util.illegalArgumentError();
  if( DEBUG && !util.isDefined( data ) ) util.illegalArgumentError();

  var cmd = controller.commands[ cKey ];

  // MOVE IT
  if( data.getMovePath() !== null ){
    controller.commands[ "move" ].action.apply( cmd, [data] );
  }

  // DO IT
  cmd.action.apply( cmd, [data] );
};

controller.isNetworkGame = function(){
  return false; //controller.online;
};

controller._parseNetworkMessage = function( msg ){
  // controller.commandBuffer.push( JSON.parse( msg ) );
  // GET DATA ARRAY
  // GET ACTION DATA OBJECT
  // INJECT DATA
  // ADD INTO BUFFER
  util.unexpectedSituationError();
};

controller._sendNetworkMessage = function( msg ){
  // GET DATA ARRAY
  // SEND DATA ARRAY
  util.unexpectedSituationError();
};

controller.pushActionDataIntoBuffer = function( data, local ){
  if( DEBUG ){
    util.logInfo(
      "pushing command into buffer...\n",

      "source (" ,data.getSourceX(), "," ,data.getSourceY(), ")\n",
      "target (" ,data.getTargetX(), "," ,data.getTargetY(), ")\n",
      "action target (" ,data.getActionTargetX(),",",data.getActionTargetY(),")\n",

      "selected unit id" ,data.getSourceUnitId(), "\n",
      "selected property id" ,data.getSourcePropertyId(), "\n",

      "target unit id" ,data.getTargetUnitId(), "\n",
      "target property id" ,data.getTargetPropertyId(), "\n",

      "selected action" ,data.getAction(), "\n",
      "sub menu action" ,data.getSubAction(), "\n",

      "move path",data.getMovePath()
    );
  }

  controller.commandBuffer.push( data );

  if( local !== true && this.isNetworkGame() ){
    var cmd = controller.commands[ data.getAction() ];
    if( cmd.localAction !== false ) this._sendNetworkMessage( data );
  }
};

controller.getActionObject = function( actionKey ){
  return controller.commands[actionKey];
};

controller.isBufferEmpty  = function(){
  return controller.commandBuffer.isEmpty();
};

controller.evalNextMessageFromBuffer = function (){
  if( controller.commandBuffer.isEmpty() ) return null;

  var data = controller.commandBuffer.pop();
  if( DEBUG ){
    util.logInfo(
      "evaluating command into buffer...\n",

      "source (" ,data.getSourceX(), "," ,data.getSourceY(), ")\n",
      "target (" ,data.getTargetX(), "," ,data.getTargetY(), ")\n",
      "action target (" ,data.getActionTargetX(),",",data.getActionTargetY(),")\n",

      "selected unit id" ,data.getSourceUnitId(), "\n",
      "selected property id" ,data.getSourcePropertyId(), "\n",

      "target unit id" ,data.getTargetUnitId(), "\n",
      "target property id" ,data.getTargetPropertyId(), "\n",

      "selected action" ,data.getAction(), "\n",
      "sub menu action" ,data.getSubAction(), "\n",

      "move path",data.getMovePath()
    );
  }

  controller.invokeCommand( data );
  return data;
};
/**
 * Persists the actual game instance.
 */
controller.saveDOM = function(){

  // SERIALIZE
  return JSON.stringify( model );
};

/**
 * Loads a game from a data block.
 *
 * @param data
 */
controller.loadDOM = function( mapData ){
  if( typeof mapData === 'string' ){

    // DESERIALIZE IF YOU GOT A SERIALIZED MODEL
    try{
      mapData = JSON.parse( mapData );
    }
    catch( e ){
      if( util.DEBUG ) throw Error("got invalid json save data");
    }

    throw Error("niy");
  }
};

/**
 * Loads a modification into the game engine.
 */
controller.loadMod = function( modification ){
  var list;

  list = modification.movetypes;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.MOVE_TYPE_SHEET );
  }

  list = modification.weapons;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.WEAPON_TYPE_SHEET );
  }

  list = modification.tiles;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.TILE_TYPE_SHEET );
  }

  list = modification.units;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.UNIT_TYPE_SHEET );
  }

  var langs = modification.locale;
  if( langs !== undefined ){

    var langIds = Object.keys( langs );
    for( var i=0,e=langIds.length; i<e; i++ ){
      util.i18n_appendToLanguage( langIds[i], langs[ langIds[i] ] );
    }
  }
};
/**
 *
 */
controller.idHolder = new util.StringIdMapper();
/**
 * User input action state machine that controls the data flow between
 * user interactions and flushes actions.
 */
controller.input = util.createStateMachine( "NONE", {

  "NONE":{
    "start": function(){

      this.menu = util.list( 20, null );
      this.menuSize = 0;
      this.inMultiStep = false;

      this.actionData = controller.aquireActionDataObject();
      this.selectionData = new controller.SelectionData( CWT_MAX_MOVE_RANGE );

      return "IDLE";
    }
  },

  // -------------------------------------------------------------------------
  "IDLE":{

    "onenter": function(){
      this.menuSize = 0;
      this.inMultiStep = false;
      this.actionData.cleanIt();
    },

    "action": function( ev, x, y ){
      if( DEBUG ) this._checkClickEventArgs(ev,x,y);

      var dto = this.actionData;
      var refObj;
      dto.setSource( x,y );

      if( (refObj = model.unitPosMap[x][y]) !== null ){
        dto.setSourceUnit( refObj );
      }
      if( (refObj = model.propertyPosMap[x][y]) !== null ){
        dto.setSourceProperty(refObj);
      }

      if( dto.getSourceUnitId() !== CWT_INACTIVE_ID &&
          dto.getSourceUnit().owner === model.turnOwner &&
          model.canAct( dto.getSourceUnitId() )
      ){

        dto.setTarget(x,y);
        dto.setMovePath([]);
        model.fillMoveMap( this.selectionData, dto );
        return "MOVEPATH_SELECTION";
      }
      else{

        this._prepareMenu();
        return "ACTION_MENU";
      }
    },

    cancel:function(){
      return "IDLE";
    }
  },

  // -------------------------------------------------------------------------
  "MOVEPATH_SELECTION":{

    action: function( ev,x,y ){
      if( DEBUG ) controller.input._checkClickEventArgs(ev,x,y);

      if( this.selectionData.getPositionValue(x,y) < 0){
        if( CLIENT_DEBUG ){
          util.logInfo("break event because selection is not in the map");
        }

        return "MOVEPATH_SELECTION";
      }

      var dto = this.actionData;
      var ox = dto.getTargetX(  );
      var oy = dto.getTargetY(  );

      var dis = model.distance( ox,oy, x,y );
      dto.setTarget( x,y );

      if( dis === 0 ){

        util.fill( this.menu, null );
        this.menuSize = 0;

        var refObj;
        if( model.fogData[x][y] > 0 &&
            (refObj = model.unitPosMap[x][y]) !== null ){
          this.actionData.setTargetUnit(refObj );
        }
        if( (refObj = model.propertyPosMap[x][y]) !== null ){

          this.actionData.setTargetProperty(refObj );
        }

        this._prepareMenu();
        return "ACTION_MENU";
      }
      else if( dis === 1 ){
        var code = model.moveCodeFromAtoB( ox,oy, x,y );
        model.addCodeToPath( this.selectionData, dto, x,y, code );
        return "MOVEPATH_SELECTION";
      }
      else{
        // GENERATE PATH
        model.setPathByRecalculation( this.selectionData, dto, x,y );
        return "MOVEPATH_SELECTION";
      }
    },

    cancel: function(){

      var dto = this.actionData;
      dto.setTarget( -1,-1 );
      dto.setTargetProperty(null);
      dto.setTargetUnit(null);

      return "IDLE";
    }
  },

  // -------------------------------------------------------------------------
  "ACTION_MENU":{

    action:function( ev, index ){
      if( DEBUG ) controller.input._checkMenuEventArgs( ev, index );

      var action = this.menu[ index ];
      var actObj = controller.getActionObject( action );
      this.actionData.setAction( action );

      if( actObj.prepareMenu !== null ){
        util.fill( this.menu, null );
        this.menuSize = 0;

        actObj.prepareMenu( this.actionData, controller.input._addMenuEntry );
        return "ACTION_SUBMENU";
      }
      else if( actObj.prepareTargets !== null ){
        return controller.input._prepareSelection( actObj, "ACTION_MENU" );
      }
      else return "FLUSH_ACTION";
    },

    cancel:function(){
      // if( this.inMultiStep ) return "ACTION_MENU";

      var dto = this.actionData;
      dto.setTarget( -1,-1 );
      dto.setTargetProperty(null);
      dto.setTargetUnit(null);

      var dto = this.actionData;
      return ( dto.getSourceUnitId() !== CWT_INACTIVE_ID &&
               dto.getSourceUnit().owner === model.turnOwner &&
                model.canAct( dto.getSourceUnitId() ) )? "MOVEPATH_SELECTION" :
                                                            "IDLE";
    }
  },

  // -------------------------------------------------------------------------
  "ACTION_SUBMENU":{

    action: function( ev, index ){
      if( DEBUG ) controller.input._checkMenuEventArgs( ev, index );
      var action = this.menu[ index ];

      if( action === "done" ){
        return "IDLE";
      }

      var actObj = controller.getActionObject( this.actionData.getAction() );
      this.actionData.setSubAction( action );

      if( actObj.prepareTargets !== null ){
        return controller.input._prepareSelection( actObj, "ACTION_SUBMENU" );
      }
      else return "FLUSH_ACTION";
    },

    cancel: function(){
      if( this.inMultiStep ) return "ACTION_SUBMENU";

      util.fill( this.menu, null );
      this.menuSize = 0;

      this._prepareMenu();
      return "ACTION_MENU";
    }
  },

  // -------------------------------------------------------------------------
  "ACTION_SELECT_TARGET":{
    action: function( ev,x,y ){
      if( DEBUG ) controller.input._checkClickEventArgs(ev,x,y);

      if( this.selectionData.getPositionValue(x,y) < 0){
        if( CLIENT_DEBUG ){
          util.logInfo("break event because selection is not in the map");
        }

        return "ACTION_SELECT_TARGET";
      }

      this.actionData.setActionTarget(x,y);

      var refObj;
      if( model.fogData[x][y] > 0 &&
          (refObj = model.unitPosMap[x][y]) !== null ){

              this.actionData.setTargetUnit(refObj);
      } else  this.actionData.setTargetUnit(null);

      if(  (refObj = model.propertyPosMap[x][y]) !== null ){
              this.actionData.setTargetProperty(refObj);
      } else  this.actionData.setTargetProperty(null);

      return "FLUSH_ACTION";
    },

    cancel: function(){
      return this._last;
    }
  },

  // -------------------------------------------------------------------------
  "FLUSH_ACTION": {
    actionState: function(){
      var actData = this.actionData;

      var trapped = false;
      if( actData.getMovePath() !== null ){
        var way = actData.getMovePath();

        var cx = actData.getSourceX();
        var cy = actData.getSourceY();
        for( var i=0,e=way.length; i<e; i++ ){

          switch( way[i] ){
            case model.MOVE_CODE_DOWN  : cy++; break;
            case model.MOVE_CODE_UP    : cy--; break;
            case model.MOVE_CODE_LEFT  : cx--; break;
            case model.MOVE_CODE_RIGHT : cx++; break;
          }

          // ONLY TILES THAT ARE IN FOG OF WAR MUST BE CHECKED AGAINST
          // HIDDEN ENEMY UNITS
          if( model.fogData[cx][cy] === 0 ){
            var unit = model.unitPosMap[cx][cy];
            if( unit != null ){

              // TRAPPED ?
              if( model.players[model.turnOwner].team !==
                    model.players[unit.owner].team ){

                // CONVERT TO TRAP WAIT
                actData.setAction("trapWait");
                actData.setTarget(cx,cy);
                actData.setTargetUnit( unit );
                actData.setTargetProperty( null );
                way.splice( i );
                trapped = true;
              }
            }
          }
        }
      }

      // PUSH A COPY INTO THE COMMAND BUFFER
      controller.pushActionDataIntoBuffer( actData.getCopy() );

      var action = actData.getAction();
      var actObj = controller.getActionObject( action );
      if( !trapped && actObj.multiStepAction ){
        this.inMultiStep = true;
        var newData = controller.aquireActionDataObject();
        newData.setAction("invokeMultiStepAction");
        controller.pushActionDataIntoBuffer(newData);
        return "MULTISTEP_IDLE";
      }
      else return "IDLE";
    }
  },

  // -------------------------------------------------------------------------
  "MULTISTEP_IDLE": {

    "nextStep": function(){
      var action = this.actionData.getAction();
      var actObj = controller.getActionObject( action );

      this.menuSize = 0;
      this.actionData.setMovePath(null);
      util.fill( this.menu, null );

      actObj.prepareMenu( this.actionData, controller.input._addMenuEntry );
      controller.input._addMenuEntry("done");

      return (this.menuSize > 1)? "ACTION_SUBMENU": "IDLE";
    }
  }
});

/**
 * @private
 * @param entry
 */
controller.input._addMenuEntry = function( entry ){
  if( controller.input.menuSize === controller.input.menu.length ){
    util.unexpectedSituationError();
  }

  controller.input.menu[ controller.input.menuSize ] = entry;
  controller.input.menuSize++;
};

/**
 * @private
 * @param actObj
 * @param lastState
 */
controller.input._prepareSelection = function( actObj, lastState ){
  var x = this.actionData.getTargetX();
  var y = this.actionData.getTargetY();
  this._last = lastState;


  this.selectionData.cleanIt( -1, x,y );
  actObj.prepareTargets( this.actionData, this.selectionData );

  return "ACTION_SELECT_TARGET";
};

/**
 * @private
 * @param ev
 * @param index
 */
controller.input._checkMenuEventArgs = function( ev, index ){
  if( !util.isNumber(index) ) util.illegalArgumentError();
  if( index < 0 || index >= this.menu.length ) util.illegalArgumentError();
};

/**
 * @private
 * @param ev
 * @param x
 * @param y
 */
controller.input._checkClickEventArgs = function( ev, x,y ){
  if( !util.isNumber(x) || !util.isNumber(y) ) util.illegalArgumentError();
  if( !model.isValidPosition(x,y) ) util.illegalPositionError();
};

/**
 * @private
 */
controller.input._prepareMenu = function(){

  var dto = this.actionData;
  var addEl = controller.input._addMenuEntry;
  var commandKeys = Object.keys( controller.commands );

  var unitActable = true;
  var selectedUnit = dto.getSourceUnit();
  if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ){
    unitActable = false;
  }
  else if( !model.canAct( dto.getSourceUnitId() ) ) unitActable = false;

  var propertyActable = true;
  var property = dto.getSourceProperty();
  if( selectedUnit !== null ) propertyActable = false;
  if( property === null ||
      property.owner !== model.turnOwner ) propertyActable = false;

  for( var i=0,e=commandKeys.length; i<e; i++ ){

    var action = controller.getActionObject( commandKeys[i] );

    // PRE DEFINED CHECKERS
    if( action.unitAction === true && !unitActable ) continue;
    if( action.propertyAction === true && !propertyActable ) continue;

    if( action.condition(dto) ){
      addEl( commandKeys[i] );
    }
  }
};

controller.SelectionData = function( range ){
  var len = range*2 + 1;
  this.data = [
    util.matrix( len,len,0 ), // DATA
    0,0                       // CENTERX, CENTERY
  ];
};

/**
 *
 * @param defaultData
 * @param cx
 * @param cy
 */
controller.SelectionData.prototype.cleanIt = function( defaultData, cx,cy ){
  var data = this.data[0];
  var e = data.length;
  for (var x = 0; x < e; x++) {
    for (var y = 0; y < e; y++) {
      data[x][y] = defaultData;
    }
  }

  // right bounds are not important
  this.data[1] = Math.max(0, cx - CWT_MAX_SELECTION_RANGE);
  this.data[2] = Math.max(0, cy - CWT_MAX_SELECTION_RANGE);
};

/**
 *
 * @param x
 * @param y
 * @param value
 */
controller.SelectionData.prototype.setPositionValue = function( x,y, value ){
  var data = this.data[0];
  var cy = this.data[1];
  var cx = this.data[2];
  x = x - cx;
  y = y - cy;
  var maxLen = data.length;

  if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
    util.illegalPositionError();
  }
  else data[x][y] = value;
};

/**
 *
 * @param x
 * @param y
 */
controller.SelectionData.prototype.getPositionValue = function( x,y ){
  var data = this.data[0];
  var cy = this.data[1];
  var cx = this.data[2];
  x = x - cx;
  y = y - cy;
  var maxLen = data.length;

  if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
    return -1;
  }
  else return data[x][y];
};

/**
 *
 */
controller.SelectionData.prototype.getCenterX = function(){
  return this.data[1];
};

/**
 *
 */
controller.SelectionData.prototype.getCenterY = function(){
  return this.data[1];
};

/**
 *
 */
controller.SelectionData.prototype.getDataMatrix = function( ){
  return this.data[0];
};
controller.registerCommand({

  key:"addVisioner",

  // ------------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    model.setVisioner(
      data.getSourceX(),
      data.getSourceY(),
      data.getSubAction()
    );
  }
});
controller.registerCommand({

  key:"attack",
  unitAction: true,
  targetSelection: true,
  hasSubMenu: true,

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
              if( model.fogData[x][y] === 0 ) continue;

              var dmg = model.getBaseDamage( wp, tUnit.type );
              if( dmg > 0 ){
                return true;
              }
            }
          }
        }
      }
  },

  // ------------------------------------------------------------------------
  prepareMenu: function( data, addEntry ){
    var selectedUnit = data.getSourceUnit();
    var x = data.getTargetX();
    var y = data.getTargetY();

    // TODO --> MOVED <--
    if( this.hasTargets(selectedUnit,model.PRIMARY_WEAPON_TAG,x,y,true)){
      addEntry("mainWeapon");
    }
    if( this.hasTargets(selectedUnit,model.SECONDARY_WEAPON_TAG,x,y,true)){
      addEntry("subWeapon");
    }
  },

  // ------------------------------------------------------------------------
  prepareTargets: function( data, selectionData ){
    var selectedUnit = data.getSourceUnit();
    var weapon = data.getSubAction();
    var tx = data.getTargetX();
    var ty = data.getTargetY();

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

            var dmg = model.getBaseDamage( wp, tUnit.type );
            if( dmg > 0 ){

              if( DEBUG ){
                util.logInfo("found target at (",lX,",",lY,")");
              }

              selectionData.setPositionValue( lX,lY, 1 );
            }
          }
        }
      }
    }
  },

  // ------------------------------------------------------------------------
  condition: function( data ){
    if( data.getTargetUnitId() !== CWT_INACTIVE_ID ) return false;

    var selectedUnit = data.getSourceUnit();

    var x = data.getTargetX();
    var y = data.getTargetY();

    if(
      ( model.primaryWeaponOfUnit(selectedUnit) !== null &&
        this.hasTargets( selectedUnit,model.PRIMARY_WEAPON_TAG,x,y, true )) ||
        ( model.secondaryWeaponOfUnit(selectedUnit) !== null &&
          this.hasTargets( selectedUnit,model.SECONDARY_WEAPON_TAG,x,y, true ))

      ){
      return true;
    }
    else return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var attacker = data.getSourceUnit();
    var defender = data.getTargetUnit();
    var weaponTag = data.getSubAction();

    // TODO COUNTER ATTACK
    var attwp = ( weaponTag === 'mainWeapon')?
      model.primaryWeaponOfUnit( attacker ):
      model.secondaryWeaponOfUnit( attacker );
    var defwp = null;

    var attDmg = model.getBaseDamage( attwp, defender.type );
    var defDmg = 0;

    defender.hp -= attDmg;

    // decrease ammo
    if( attwp.useAmmo !== 0 ){
      attacker.ammo--;
    }

    // fill co power meter
    //model.increasePowerMeter( att.owner, 0.5*0 );
    //model.increasePowerMeter( defender.owner, 0 );

    if( defender.hp < 0 ){

      // defender destroyed
      model.destroyUnit( model.extractUnitId(defender) );
    }
    else if( defwp !== null ){

      // counterattack
      attacker.hp -= defDmg;

      // decrease ammo
      if( defwp.useAmmo !== 0 ){
        defender.ammo--;
      }

      // fill co power meter
      //game.increasePowerMeter( att.owner, 0 );
      //game.increasePowerMeter( defender.owner, 0.5*0 );

      if( attacker.hp < 0 ){

        // attacker destroyed
        model.destroyUnit( model.extractUnitId(attacker) );
      }
    }

    controller.invokeCommand( data, "wait" );
  }
});


/********

 D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]

 D = Actual damage expressed as a percentage

 B = Base damage (in damage chart)
 ACO = Attacking CO attack value (example:130 for Kanbei)

 R = Random number 0-9

 AHP = HP of attacker

 DCO = Defending CO defense value (example:80 for Grimm)
 DTR = Defending Terrain Stars (IE plain = 1, wood = 2)
 DHP = HP of defender

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
controller.registerCommand({

  key:"buildUnit",
  propertyAction: true,
  hasSubMenu: true,

  canPropTypeBuildUnitType: function( pType, uType ){
    var pSheet = model.sheets.tileSheets[ pType ];
    var bList = pSheet.builds;
    if( bList === undefined ) return false;

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

  // ------------------------------------------------------------------------
  prepareMenu: function( data, addEntry ){
    var prop = data.getSourceProperty();
    if( DEBUG && prop === null ){ util.illegalArgumentError(); }

    var bList = this.getBuildList( model.extractPropertyId( prop ) );

    // APPEND TYPES
    for( var i=0,e=bList.length; i<e; i++ ) addEntry( bList[i] );
  },

  // ------------------------------------------------------------------------
  condition: function( data ){
    var property = data.getSourceProperty();

    return (
      model.hasFreeUnitSlots( model.turnOwner ) &&
        this.getBuildList(
          model.extractPropertyId( data.getSourceProperty() )
        ).length > 0
      );
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var x = data.getSourceX();
    var y = data.getSourceY();
    var subEntry = data.getSubAction();

    var uid = model.createUnit( model.turnOwner, subEntry );
    model.setUnitPosition( uid, x,y );

    var pl = model.players[ model.turnOwner ];
    pl.gold -= model.sheets.unitSheets[ subEntry ].cost;

    var newData = controller.aquireActionDataObject();
    newData.setSourceUnit(model.units[uid]);
    newData.setAction("wait");
    controller.invokeCommand( newData );
  }

});
controller.registerCommand({

  key:"captureProperty",
  unitAction: true,

  // ------------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var unit = data.getTargetUnit();
    var property = data.getTargetProperty();

    return (
      property !== null &&
        model.turnOwner !== property.owner &&

      ( unit === null || unit === selectedUnit ) &&

      model.sheets.tileSheets[ property.type ].capturePoints > 0 &&
      model.sheets.unitSheets[ selectedUnit.type ].captures > 0
    );
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var selectedUnit = data.getSourceUnit();
    var property = data.getTargetProperty();
    var unitSh = model.sheets.unitSheets[ selectedUnit.type ];

    property.capturePoints -= unitSh.captures;
    if( property.capturePoints <= 0 ){
      var x = data.getTargetX();
      var y = data.getTargetY();
      if( DEBUG ){
        util.logInfo( "property at (",x,",",y,") captured");
      }

      // REMOVE VISION
      /* TODO ADD IT WHEN EVERY PLAYER HAS AN OWN SHADOW MAP
      var data = new controller.ActionData();
      data.setSource( x,y );
      data.setAction("remVisioner");
      data.setSubAction( model.sheets.tileSheets[property.type].vision );
      controller.pushActionDataIntoBuffer(data);
      */

      // ADD VISION
      var data = new controller.ActionData();
      data.setSource( x,y );
      data.setAction("addVisioner");
      data.setSubAction( model.sheets.tileSheets[property.type].vision );
      controller.pushActionDataIntoBuffer(data);

      if( property.type === 'HQTR' ){
        var pid = property.owner;
        var oldPlayer = model.players[pid];

        for( var i = pid*CWT_MAX_UNITS_PER_PLAYER,
                 e = i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

          model.units[i].owner = -1;
          model.eraseUnitPosition(i);
        }

        for( var i = 0, e = model.properties.length; i<e; i++ ){
          if( model.properties[i].owner === pid ){
            model.properties[i].owner = -1;
          }
        }

        oldPlayer.team = -1;

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
          var nData = controller.aquireActionDataObject();
          nData.setAction( "endGame" );
          controller.pushActionDataIntoBuffer( nData, true );
        }
      }

      // set new meta data for property
      property.capturePoints = 20;
      property.owner = selectedUnit.owner;
    }

    controller.invokeCommand( data, "wait" );
  }

});
controller.registerCommand({

  key: "endGame",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    if( DEBUG ){
      util.logInfo("the game ends because no opposite players exists");
    }
  }

});
controller.registerCommand({

  key:"healUnit",

  // ------------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var healingUnit = data.getTargetUnit();

    var hp = 20;

    healingUnit.hp += hp;
    if( healingUnit.hp > 99 ) healingUnit.hp = 99;
  }
});
controller.registerCommand({

  key:"invokeMultiStepAction",

  // ----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // ----------------------------------------------------------------------
  action: function( data ){
    controller.input.event("nextStep");
  }
});
controller.registerCommand({

  key:"join",
  unitAction: true,

  // ----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var targetUnit = data.getTargetUnit();
    if( targetUnit === null || targetUnit.owner !== model.turnOwner ||
        targetUnit === selectedUnit ) return false;

    return ( selectedUnit.type === targetUnit.type && targetUnit.hp < 89 );
  },

  // ----------------------------------------------------------------------
  action: function( data ){
    var joinSource = data.getSourceUnit();
    var joinTarget = data.getTargetUnit();

    
    var junitSheet = model.sheets.unitSheets[ joinTarget.type ];

    // HEALTH POINTS
    joinTarget.hp += joinSource.hp;
    if( joinTarget.hp > 99 ) joinTarget.hp = 99;

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

    model.destroyUnit( model.extractUnitId(joinSource) );
    
    // CHANGE SCOPE OF SELECTED UNIT TO TARGET
    data.setSourceUnit( joinTarget );
    controller.invokeCommand( data, "wait" );
  }
});
controller.registerCommand({

  key: "loadGame",

  _copyProps: function( source, target ){
    var keys = Object.keys( source );
    for( var i=0,e=keys.length; i<e; i++ ){
      target[ keys[i] ] = source[ keys[i] ];
    }
  },

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    if( util.DEBUG ){ util.logInfo("start loading game instance"); }

    var copy = this._copyProps;
    var mapData = data.getSubAction();

    // ------------------------------------------------------------------------
    // MAP

    model.mapHeight = mapData[ controller.SERIALIZATION_MAP_H ];
    model.mapWidth = mapData[ controller.SERIALIZATION_MAP_W ];

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.map[x][y] = mapData[ controller.SERIALIZATION_MAP ][x][y];
      }
    }

    // ------------------------------------------------------------------------
    // UNITS

    for( var i=0,e=model.units.length; i<e; i++ ){
      var unit = model.units[i];
      if( mapData[ controller.SERIALIZATION_UNITS ].hasOwnProperty(i) ){
        copy( mapData[ controller.SERIALIZATION_UNITS ][i], unit );
      }
      else{
        unit.owner = CWT_INACTIVE_ID;
      }
    }

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.unitPosMap[x][y] = null;
      }
    }

    var posKeys;
    posKeys = Object.keys(mapData[ controller.SERIALIZATION_UNITS_POS ] );
    for( var i=0,e=posKeys.length; i<e; i++ ){
      var parts = posKeys[i].split(",");
      var x = parseInt( parts[0], 10 );
      var y = parseInt( parts[1], 10 );

      model.unitPosMap[x][y] = model.units[
        mapData[ controller.SERIALIZATION_UNITS_POS ][ posKeys[i] ]
      ];
    }

    // ------------------------------------------------------------------------
    // PROPS

    for( var i=0,e=model.properties.length; i<e; i++ ){
      var prop = model.properties[i];
      if( mapData[ controller.SERIALIZATION_PROPS ].hasOwnProperty(i) ){
        copy( mapData[ controller.SERIALIZATION_PROPS ][i], prop );
      }
      else{
        prop.owner = CWT_INACTIVE_ID;
      }
    }

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.propertyPosMap[x][y] = null;
      }
    }

    posKeys = Object.keys(mapData[ controller.SERIALIZATION_PROPS_POS ] );
    for( var i=0,e=posKeys.length; i<e; i++ ){
      var parts = posKeys[i].split(",");
      var x = parseInt( parts[0], 10 );
      var y = parseInt( parts[1], 10 );

      model.propertyPosMap[x][y] = model.properties[
        mapData[ controller.SERIALIZATION_PROPS_POS ][ posKeys[i] ]
      ];
    }

    // ------------------------------------------------------------------------
    // ROUND

    model.day = mapData[ controller.SERIALIZATION_DAY ];
    model.turnOwner = mapData[ controller.SERIALIZATION_TURNOWNER ];
    // model.leftActors = mapData[ controller.SERIALIZATION_LEFTACTORS ];

    if( mapData[ controller.SERIALIZATION_LEFTACTORS ] !== undefined ){
      for( var i=0,e= mapData[ controller.SERIALIZATION_LEFTACTORS ].length;
           i<e; i++ ){

        model.leftActors[i] =  mapData[ controller.SERIALIZATION_LEFTACTORS ][i];
      }
    }
    else util.fill( model.leftActors, true );

    // ------------------------------------------------------------------------
    // PLAYERS

    for( var i=0,e=model.players.length; i<e; i++ ){
      var player = model.players[i];
      if( mapData[ controller.SERIALIZATION_PLAYERS ].hasOwnProperty(i) ){
        copy( mapData[ controller.SERIALIZATION_PLAYERS ][i], player );
      }
      else{
        player.team = CWT_INACTIVE_ID;
      }
    }

    // ------------------------------------------------------------------------

    if( util.DEBUG ){ util.logInfo("game instance successfully loaded"); }
  }
});
controller.registerCommand({

  key: "loadMod",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

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
    
    var langs = Object.keys( CWT_MOD_DEFAULT.locale );
    for( var i=0,e=langs.length; i<e; i++ ){
      util.i18n_appendToLanguage(
        langs[i],
        CWT_MOD_DEFAULT.locale[langs[i]]
      );
    }
  }
});
controller.registerCommand({

  key:"loadUnit",
  unitAction: true,

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnitId = data.getSourceUnitId();
    var transporterId = data.getTargetUnitId();
    if( transporterId === -1 || data.getTargetUnit().owner !== model.turnOwner){
      return false;
    }

    return (
      model.isTransport( transporterId ) &&
      model.canLoad( selectedUnitId, transporterId )
    );
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var selectedUnitId = data.getSourceUnitId();
    var transporterId = data.getTargetUnitId();

    model.loadUnitInto( selectedUnitId, transporterId );
  }
});
controller.registerCommand({

  key: "move",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    var way = data.getMovePath();
    var uid = data.getSourceUnitId();

    var cX = data.getSourceX();
    var cY = data.getSourceY();
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


        if( lastIndex == -1 ){

          // THAT IS A FAULT
          cwt.error(
            "unit is blocked by an enemy, but the enemy",
            "stands beside the start tile, that is a logic fault!"
          );
        }

        break;
      }

      // INCREASE FUEL USAGE
      fuelUsed += model.moveCosts( mType, model.map[cX][cY] );
    }

    unit.fuel -= fuelUsed;

    // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN)
    // SOMEWHERE
    if( unit.x !== -1 && unit.y !== -1 ){
      model.eraseUnitPosition( uid );
    }

    // DO NOT SET NEW POSITION IF THE POSITION IS OCCUPIED
    // THE SET POSITION LOGIC MUST BE DONE BY THE ACTION
    if( model.unitPosMap[cX][cY] === null ){
      model.setUnitPosition( uid, cX, cY );
    }

    if( DEBUG ){
      util.logInfo(
        "moved unit",uid,
        "from (",data.getSourceX(),",",data.getSourceY(),")",
        "to (",cX,",",cY,")"
      );
    }
  }

})
controller.registerCommand({

  key: "nextTurn",

  // -----------------------------------------------------------------------
  condition: function( data ){
    if( data.getSourceUnitId() === CWT_INACTIVE_ID ){
      // NO UNIT

      if( data.getSourcePropertyId() !== CWT_INACTIVE_ID &&
          data.getSourceProperty().owner === model.turnOwner ){

        // PROPERTY
        return false;
      }
      else return true;
    }
    else{
      // UNIT

      if( data.getSourceUnit().owner === model.turnOwner &&
          model.canAct( data.getSourceUnitId() ) ){

        // ACTABLE OWN
        return false;
      }
      else return true;
    }

    // FALLBACK
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var pid = model.turnOwner;
    var oid = pid;

    // FIND NEXT PLAYER
    pid++;
    while( pid !== oid ){
      if( pid === CWT_MAX_PLAYER ){
        pid = 0;
        model.day++;
      }

      if( model.players[pid].team !== CWT_INACTIVE_ID ){

        // FOUND NEXT PLAYER
        break;
      }

      // INCREASE ID
      pid++;
    }
    if( DEBUG && pid === oid ){ util.unexpectedSituationError(); }

    model.turnOwner = pid;

    var dataObj = new controller.ActionData();

    dataObj.setAction("supply");
    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex,
             e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

      model.leftActors[i-startIndex] = (model.units[i] !== null);

      // TODO make better
      var unit = model.units[i];
      if( unit.type === "APCR" ){

        dataObj.setSource( unit.x, unit.y );
        dataObj.setTarget( unit.x, unit.y );
        dataObj.setSourceUnit( unit );
        controller.invokeCommand( dataObj );
      }
    }

    // TODO make better
    var turnOwnerObj = model.players[pid];
    for( var i=0, e=model.properties.length; i<e; i++ ){
      if( model.properties[i].owner === pid ){
        turnOwnerObj.gold += 1000;
      }
    }

    model.generateFogMap( pid );
  }

});
controller.registerCommand({

  key:"remVisioner",

  // ------------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    model.removeVisioner(
      data.getSourceX(),
      data.getSourceY(),
      data.getSubAction()
    );
  }
});
controller.SERIALIZATION_MAP = "map";
controller.SERIALIZATION_MAP_H = "mapHeight";
controller.SERIALIZATION_MAP_W = "mapWidth";

controller.SERIALIZATION_UNITS = "units";
controller.SERIALIZATION_UNITS_POS = "unitPosMap";

controller.SERIALIZATION_PROPS = "properties";
controller.SERIALIZATION_PROPS_POS = "propertyPosMap";

controller.SERIALIZATION_PLAYERS = "players";

controller.SERIALIZATION_DAY = "day";
controller.SERIALIZATION_TURNOWNER = "turnOwner";
controller.SERIALIZATION_LEFTACTORS = "leftActors";


controller.registerCommand({

  key: "saveGame",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    if( util.DEBUG ){ util.logInfo("start saving game instance"); }

    var json = {};

    // ------------------------------------------------------------------------
    // MAP

    json[ controller.SERIALIZATION_MAP ] = util.matrix(
      model.mapWidth,model.mapHeight, null
    );

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        json[ controller.SERIALIZATION_MAP ][x][y] = model.map[x][y];
      }
    }

    json[ controller.SERIALIZATION_MAP_H ] = model.mapHeight;
    json[ controller.SERIALIZATION_MAP_W ] = model.mapWidth;

    // ------------------------------------------------------------------------
    // UNITS

    json[ controller.SERIALIZATION_UNITS ] = {};
    for( var i=0,e=model.units.length; i<e; i++ ){
      var unit = model.units[i];
      if( unit.owner !== CWT_INACTIVE_ID ){
        json[ controller.SERIALIZATION_UNITS ][i] = unit;
      }
    }

    json[ controller.SERIALIZATION_UNITS_POS ] = {};
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        var unit = model.unitPosMap[x][y];
        if( unit !== null ){
          json[ controller.SERIALIZATION_UNITS_POS ][ x+","+y ] = model.extractUnitId(unit);
        }
      }
    }

    // ------------------------------------------------------------------------
    // PROPS

    json[ controller.SERIALIZATION_PROPS ] = {};
    for( var i=0,e=model.properties.length; i<e; i++ ){
      var prop = model.properties[i];
      if( prop.owner !== CWT_INACTIVE_ID ){
        json[ controller.SERIALIZATION_PROPS ][i] = prop;
      }
    }

    json[ controller.SERIALIZATION_PROPS_POS ] = {};
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        var prop = model.propertyPosMap[x][y];
        if( prop !== null ){
          json[ controller.SERIALIZATION_PROPS_POS ][ x+","+y ] = model.extractPropertyId(prop);
        }
      }
    }

    // ------------------------------------------------------------------------
    // ROUND

    json[ controller.SERIALIZATION_DAY ] = model.day;
    json[ controller.SERIALIZATION_TURNOWNER ] = model.turnOwner;
    json[ controller.SERIALIZATION_LEFTACTORS ] = model.leftActors;

    // ------------------------------------------------------------------------
    // PLAYERS

    json[ controller.SERIALIZATION_PLAYERS ] = {};
    for( var i=0,e=model.players.length; i<e; i++ ){
      var player = model.players[i];
      if( player.team !== CWT_INACTIVE_ID ){
        json[ controller.SERIALIZATION_PLAYERS ][i] = player;
      }
    }

    // ------------------------------------------------------------------------

    json = JSON.stringify( json, null, "\t" ); // SERIALIZE IT
    data.setSubAction( json );

    if( util.DEBUG ){ util.logInfo("game instance successfully saved"); }
  }
});
controller.registerCommand({

  key:"silofire",
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

  // ------------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var selectedProperty = data.getSourceProperty();

    if( selectedProperty === null ||
        selectedProperty .owner !== model.turnOwner ) return false;

    // if( controller.actiondata.getTargetUnit(data) !== null ) return false;

    if( selectedUnit.type !== "INFT" && selectedUnit.type !== "MECH" ){
      return false;
    }

    return ( selectedProperty.type === "SILO" );
  },

  // ------------------------------------------------------------------------
  targetValid: function( data, x,y ){
    return model.isValidPosition(x,y);
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var dmgF = this._doDamage;
    var x = data.getActionTargetX();
    var y = data.getActionTargetY();

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
    data.getSourceProperty().type = "SILO_EMPTY";
    controller.invokeCommand(data,"wait");
  }

});
controller.registerCommand({

  key: "startGame",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  action: function(){


  }
});
controller.registerCommand({

  key:"supply",
  unitAction: true,

  _resupplyUnitAt: function( x,y ){
    var unit = model.unitPosMap[x][y];
    var uSheet = model.sheets.unitSheets[ unit.type ];
    unit.ammo = uSheet.maxAmmo;
    unit.fuel = uSheet.maxFuel;
  },

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var sSheet = model.sheets.unitSheets[ selectedUnit.type ];
    if( sSheet.supply === undefined ) return false;

    var pid = selectedUnit.owner;

    var x = data.getTargetX();
    var y = data.getTargetY();
    var check = model.thereIsAnOwnUnitAt;

    return (
      check(x-1,y,pid) || check(x+1,y,pid) ||
      check(x,y-1,pid) || check(x,y+1,pid)
    );
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var selectedUnit = data.getSourceUnit();
    var pid = selectedUnit.owner;
    var x = data.getTargetX();
    var y = data.getTargetY();
    var check = model.thereIsAnOwnUnitAt;
    var refill = this._resupplyUnitAt;

    if( check(x-1,y,pid) ){ refill(x-1,y); }
    if( check(x+1,y,pid) ){ refill(x+1,y); }
    if( check(x,y-1,pid) ){ refill(x,y-1); }
    if( check(x,y+1,pid) ){ refill(x,y+1); }

    controller.invokeCommand(data,"wait");
  }
});
controller.registerCommand({

  key: "trapWait",

  // -----------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var ndata = new controller.ActionData();
    ndata.setSource( data.getSourceX(), data.getSourceY() );
    ndata.setAction("wait");
    ndata.setSourceUnit( data.getSourceUnit() );
    controller.invokeCommand( ndata );
  }

});
controller.registerCommand({

  key: "unloadUnit",
  unitAction: true,
  multiStepAction: true,

  // -----------------------------------------------------------------------
  prepareMenu: function( data, addEntry ){
    var selectedId = data.getSourceUnitId();
    var loads = model.getLoadedIds( selectedId );
    for( var i=0,e=loads.length; i<e; i++ ){
      addEntry( loads[i] );
    }
  },

  // -----------------------------------------------------------------------
  prepareTargets: function( data, selectionData ){
    var subEntry = data.getSubAction( );
    var tx = data.getTargetX( );
    var ty = data.getTargetY( );

    var load = model.units[ subEntry ];
    var loadS = model.sheets.unitSheets[ load.type ];
    var loadMvS = model.sheets.movetypeSheets[ loadS.moveType ];

    if( tx > 0 ){
      if( model.unitPosMap[tx-1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx-1][ty] ) !== -1  ){
        selectionData.setPositionValue( tx-1,ty,1 );
      }
    }

    if( ty > 0 ){
      if( model.unitPosMap[tx][ty-1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty-1] ) !== -1  ){
        selectionData.setPositionValue( tx,ty-1,1 );
      }
    }

    if( ty < model.mapHeight-1 ){
      if( model.unitPosMap[tx][ty+1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty+1] ) !== -1  ){
        selectionData.setPositionValue( tx,ty+1,1 );
      }
    }

    if( tx < model.mapWidth-1 ){
      if( model.unitPosMap[tx+1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx+1][ty] ) !== -1  ){
        selectionData.setPositionValue( tx+1,ty,1 );
      }
    }
  },

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    if( data.getTargetUnit() !== null ) return false;

    var selectedUnitId = data.getSourceUnitId();
    return (
      model.isTransport( selectedUnitId ) &&
        model.hasLoadedIds( selectedUnitId )
    );
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var loadId      = data.getSubAction();
    var transportId = data.getSourceUnitId();
    var tx          = data.getActionTargetX();
    var ty          = data.getActionTargetY();
    var trsx        = data.getTargetX();
    var trsy        = data.getTargetY();

    // SEND TRANSPORTER INTO WAIT
    controller.invokeCommand( data, "wait" );

    // SEND LOADED UNIT INTO WAIT
    model.unloadUnitFrom( loadId, transportId );

    var moveCode;
         if( tx < trsx ) moveCode = model.MOVE_CODE_LEFT;
    else if( tx > trsx ) moveCode = model.MOVE_CODE_RIGHT;
    else if( ty < trsy ) moveCode = model.MOVE_CODE_UP;
    else if( ty > trsy ) moveCode = model.MOVE_CODE_DOWN;

    var tmpAction = controller.aquireActionDataObject();
    tmpAction.setSourceUnit( model.units[loadId] );
    tmpAction.setMovePath( [ moveCode ] );
    tmpAction.setAction( "wait");
    tmpAction.setSource( trsx, trsy );
    controller.pushActionDataIntoBuffer( tmpAction, true );
  }

});
controller.registerCommand({

  key: "wait",
  unitAction: true,

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var targetUnit = data.getTargetUnit();
    return targetUnit === null || targetUnit === selectedUnit;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    model.markAsUnusable( data.getSourceUnitId() );
  }

});