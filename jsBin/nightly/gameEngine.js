/**
 * Custom Wars Tactics main namespace. All sub modules and parts of the game
 * should be appended to this root object to use the annotation features of
 * cwt.
 *
 * @namespace
 */
var cwt = {};

/**
 * If set to true, then several debug information will be printed on screen.
 *
 * @constant
 */
cwt.DEBUG = false;

/** @namespace */
cwt.mod = {};

cwt.loadDefaultMod = function(){

  var mod = cwt.mod.awds;
  var list;

  list = mod.movetypes;
  for( var i=0,e=list.length; i<e; i++ ){
    cwt.parseSheet( list[i], cwt.MOVE_TYPE_SHEET );
  }

  list = mod.weapons;
  for( var i=0,e=list.length; i<e; i++ ){
    cwt.parseSheet( list[i], cwt.WEAPON_TYPE_SHEET );
  }

  list = mod.tiles;
  for( var i=0,e=list.length; i<e; i++ ){
    cwt.parseSheet( list[i], cwt.TILE_TYPE_SHEET );
  }

  list = mod.units;
  for( var i=0,e=list.length; i<e; i++ ){
    cwt.parseSheet( list[i], cwt.UNIT_TYPE_SHEET );
  }
};

/** @namespace */
cwt.util = {

  setDebug: function( bool ){
    cwt.DEBUG = bool;
  },

  observable: function( obj, listenerName ){
    if( typeof listenerName !== 'string' || listenerName.length == 0 ){
      throw Error('illegal listener name');
    }

    obj['_listeners_'+listenerName] = [];

    // adds a listener to the state machine
    obj['add'+listenerName+'Listener'] = function( fn ){
      obj['_listeners_'+listenerName].push(fn);
    }

    // pushes an event
    obj['emit'+listenerName] = function(){
      var listeners = obj['_listeners_'+listenerName];
      for( var i = 0, e = listeners.length; i<e; i++ ){
        listeners[i].apply( obj, arguments );
      }
    }

    // removes a listener from the state machine
    obj['remove'+listenerName+'Listener'] = function( fn ){
      var index = obj['_listeners_'+listenerName].indexOf(fn);
      if( index === -1 ) return false;

      obj['_listeners_'+listenerName].splice(index,1);
      return true;
    }
  },

  /**
   * Iterates all keys of an object and calls a callback function on every key.
   */
  each: function( obj, callback ){
    var keys = Object.keys(obj);
    for(var i = 0, e = keys.length; i < e; i++){
      callback( obj[keys[i]], keys[i] );
    }
  },

  fill: function( arr, value ){
    if( arr.__matrixArray__ === true ){
      // complex array (matrix) object

      var subArray;
      for(var i = 0, e = arr.length; i < e; i++){
        subArray = arr[i];
        for(var j = 0, ej = arr.length; j < ej; j++){ subArray[j] = value; }}
    }
    else{
      // simple array object

      for(var i = 0, e = arr.length; i < e; i++){ arr[i] = value; }}
  },

  list: function( len, defaultValue ){
    if( defaultValue === undefined ){ defaultValue = null; }

    var isFN = typeof defaultValue === 'function';
    var warr = [];
    for (var i = 0; i < len; i++) {
      if( isFN ) warr[i] = defaultValue( i );
      else       warr[i] = defaultValue;
    }

    return warr;
  },

  matrix: function( w, h, defaultValue ){

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
  },

  /**
   * A function that always returning the value 'true'.
   */
  trueReturner: function(){ return true; },

  objectPool: function( cleanerFn ){
    var pooled = [];

    function createObject(){
      var o = {};
      cleanerFn( o );
      return o;
    }

    return {

      request: function(){
        if( cwt.DEBUG ){
          cwt.info("got request call");
        }

        if( pooled.length > 0 ){
          if( cwt.DEBUG ){
            cwt.info("returning cached object");
          }

          return pooled.pop();
        }
        else {
          if( cwt.DEBUG ){
            cwt.info("returning fresh object");
          }

          return createObject();
        }
      },

      release: function( obj ){
        if( cwt.DEBUG ){
          cwt.info("releasing object {0} back to the object pool",obj);
        }

        cleanerFn( obj );
        pooled.push( obj );
      }
    };
  }
};

/**
 * @private
 */
cwt._initializerFn = [];

/**
 * @event
 * @param name
 * @param fn
 */
cwt.onInit = function( name, fn ){
  cwt._initializerFn.push([name,fn]);
};

/**
 * Starts the engine and calls the initializer functions.
 */
cwt.start = function(){
  var inits = cwt._initializerFn;
  for( var i=0,e=inits.length; i<e; i++ ){
    if( cwt.DEBUG ) cwt.info("initializing {0}", inits[ i ][0] );
    inits[ i ][1](); // call initializer
  }
  inits.splice(0);

  /*
  var keys = Object.keys( cwt._initializerFn );
  for( var i=0,e=keys.length; i<e; i++ ){

    var key = keys[i];

    if( cwt.DEBUG ) cwt.info("initializing {0}",key);

    cwt._initializerFn[ key ](); // call initializer
    delete cwt._initializerFn[ key ]; // remove it
  }
  */
};
/**
 * Holds the actions.
 *
 * @private
 */
cwt._actions = {};

/**
 * Registers a service function from a module as action.
 */
cwt.registerUserAction = cwt.userAction = function( actionName, actor ){
  cwt._actions[actionName] = actor;
};

/**
 * Pushes an action object to the cwt.messageBuffer.
 */
cwt.doAction = function( actObj ){
  // var act = this._actions[ actObj.k ];
  if( !cwt._actions.hasOwnProperty( actObj.k ) ){
    cwt.error("{0} is not registered as action",actObj.k);
  }
  var act = cwt[ actObj.k ];
  cwt[ actObj.k ].apply( cwt, actObj.a );
};

/**
 * Returns all available actions of a selected unit object at a given position x and y.
 *
 * @param x
 * @param y
 * @param uid selected unit id
 */
cwt.unitActions = function( uid, x, y ){
  if( uid === undefined ){
    cwt.error("illegal uid {0}",uid);
  }

  return cwt._generateActionList( x, y, uid );
};

/**
 * Returns all available actions by a 'click' on a given position x and y.
 *
 * @param x
 * @param y
 */
cwt.mapActions = function( x, y ){
  if( x === undefined || y === undefined ){
    cwt.error("illegal position ({0},{1})",x,y);
  }

  return cwt._generateActionList( x, y );
};

/**
 * @private
 */
cwt._generateActionList = function( x, y, selected ){
  var actions = [];
  var unitSelected = undefined;
  var prop = cwt.propertyByPos( x, y );
  var unit = cwt.unitByPos( x, y );
  var propId = ( prop !== null )? cwt.extractPropertyId( prop ) : null;
  var unitId = ( unit !== null )? cwt.extractUnitId( unit ) : null;
  var act;
  var keys = Object.keys( cwt._actions );

  // unit selected ?
  if( selected !== undefined ){
    unitSelected = cwt.unitById(selected);

    // position is given ?
    if( x === undefined || y === undefined ){

      x = unitSelected.x;
      y = unitSelected.y;
    }
  }

  for( var i=0,e=keys.length; i<e; i++){
    act = cwt._actions[ keys[i] ];
    act( actions, x, y, prop, unit, ( unitSelected === undefined )? null : unitSelected );
  }

  return actions;
};


/**
 * This constant can be overwritten for a custom size, but this must be done
 * before the engine will be initialized.
 *
 * @constant
 */
cwt.MAX_BUFFER_SIZE = 200,

/** @private */
cwt._bufferReadIndex = 0;

/** @private */
cwt._bufferWriteIndex = 0;

/** @private */
cwt._bufferData = null;

/**
 * Pushes a message into the message bugger.
 *
 * @param msg message content as js object
 * @throws error if buffer is full
 */
cwt.pushMsgToBuffer = function( msg ){
  if( cwt._bufferData[ cwt._bufferWriteIndex ] !== null ){
    cwt.error("message buffer is full");
  }

  if( cwt.DEBUG ) cwt.info( "adding message '{0}‘ to buffer", msg );

  cwt._bufferData[ cwt._bufferWriteIndex ] = msg;
  cwt._bufferWriteIndex++;
  if( cwt._bufferWriteIndex === cwt.MAX_BUFFER_SIZE ){
    cwt._bufferWriteIndex = 0;
  }
};

/**
 * Returns true if the buffer is not empty else false.
 */
cwt.isMsgInBuffer = function(){
  return ( cwt._bufferData[ cwt._bufferReadIndex ] !== null );
};

/**
 * Pops a message from the message buffer and returns its content.
 *
 * @return message content
 * @throws error if buffer is empty
 */
cwt.popMsgFromBuffer = function(){
  if( cwt._bufferData[ cwt._bufferReadIndex ] === null ){
    cwt.error("message buffer is empty");
  }
  var msg = cwt._bufferData[ cwt._bufferReadIndex ];

  // increase counter and free space
  cwt._bufferData[ cwt._bufferReadIndex ] = null;
  cwt._bufferReadIndex++;
  if( cwt._bufferReadIndex === cwt.MAX_BUFFER_SIZE ) cwt._bufferReadIndex = 0;

  return msg;
};

// init loader
cwt.onInit( "command pipeline", function(){
  cwt._bufferData = cwt.util.list( cwt.MAX_BUFFER_SIZE, null );
});
/** @private */
cwt._loggerArg = null;

/** @private */
cwt._formatReplacer = function( el, i ){
  var arg = cwt._loggerArg[ parseInt(i,10)+1];
  return ( typeof arg !== 'string' )? JSON.stringify( arg ) : arg;
};

/** @private */
cwt._stringFormat = function( str ){
  cwt._loggerArg = arguments;
  return str.replace(/\{(\d+)\}/g, cwt._formatReplacer );
};

/**
 * Normal information message.
 */
cwt.info = function(){
  var msg = cwt._stringFormat.apply( cwt.log, arguments );
  console.log( msg );
  log.info( msg );
};

/**
 * Warning message.
 */
cwt.warn = function(){
  var msg = cwt._stringFormat.apply( cwt.log, arguments );
  console.log( msg );
  log.warn( msg );
};

/**
 * Error/Critical message.
 */
cwt.error = function(){
  var msg = cwt._stringFormat.apply( cwt.log, arguments );
  console.log( msg );
  log.error( msg );
  throw Error( msg );
};
/** @private */
cwt._persitenceMap = [];

/**
 * Registers a property key in the persist controller.
 *
 * @param mKey module key
 * @param pKey property key
 */
cwt.serializedProperty = function( pKey ){

  if( cwt._persitenceMap.indexOf( pKey) === -1 ){
    if( cwt[pKey] === undefined ){
      cwt.error( "property {0} is not defined", pKey );
    }
    else cwt._persitenceMap.push(pKey);
  }
  else{
    cwt.error( "property {0} is already registered", pKey );
  }
};

/**
 * Persists the actual game instance.
 */
cwt.serializeModel = function(){
  var result = {};
  var keys = cwt._persitenceMap;

  // add properties to the tempoary object
  for( var i = 0, e = keys.length; i<e; i++ ){
    result[ keys[i] ] = cwt[ keys[i] ];
  }

  // serialize
  var resultString = JSON.stringify( result );

  // drop properties from the tempoary object
  for( var i = 0, e = keys.length; i<e; i++ ){
    delete result[ keys[i] ];
  }

  return resultString;
};

/**
 * Loads a game from a data block.
 *
 * @param data
 */
cwt.deserializeModelData = function( data ){
  if( typeof data === 'string' ){
    // convert to js object if necessary
    data = JSON.parse( data );
  }

  // load map from data
  cwt.loadMap( data );
};

/**
 * Holds the transaction functions.
 *
 * @private
 */
cwt._transactions = {};

/**
 * Registers a function as transaction. A transaction must be atomic, means
 * if it will be called on two different machines with the same data, then it
 * must produce the same output.
 *
 * @param mKey module key
 * @param fKey function key
 */
cwt.registerTransaction = cwt.transaction = function( fKey ){

  // TODO maybe look into the function source to find Math.random() or
  // TODO something like that (prevent atomic faults)

  cwt._transactions[ fKey ] = cwt[ fKey ];

  // replace function on module with a function that
  // shares the call and registers the call in the
  // message pipe
  //  --> be transparent
  cwt[ fKey ] = function(){

    // TODO share it

    cwt.pushMsgToBuffer({
      k: fKey,
      a: arguments
    });
  }
};

/**
 * Every remote call should be done via a transaction message. The transaction
 * message can only call registered transaction if it will be evaluated with
 * this function. This should prevent a call of forbidden or non-atomic
 * functions from other clients.
 *
 * @param msg
 */
cwt.evalTransactionMessage = function( msg ){
  var fn = cwt._transactions[ msg.k ];
  fn.apply( cwt, msg.a );
};
/**
 *
 */
cwt.createTagContainer = function() {
  var ct;
  return ct = {
    nodes: []
  };
};



/**
 *
 */
cwt.solveTagAttribute = function( value, nodes ) {
  for( var i = 0; i<nodes.length; i++ ){
    value= cwt._tagCodes[ nodes[i].a ]( value, nodes[i] );
  }

  return value;
};

/**
 * @private
 */
cwt._tagCodes = {};

cwt._tagCodes.FOR_DAYS = function(value, tagDes) {
  if(cwt.day < tagDes.lastDay){
    return null;
  }
  else {
    return value;
  }
};

cwt._tagCodes.TWICE = function(value, tagDes) {
  return cwt.solveTagAttribute( value, tagDes.commands )+cwt.solveTagAttribute( value, tagDes.commands )-value;
}

cwt._tagCodes.CONDITION = function(value, tagDesc) {
  if( tagDesc.cond === 1 ){
    return tagDesc.thenBlock;
  } else {
    return tagDesc.elseBlock;
  }
};

cwt._tagCodes.CHANGE_VALUE = function(value, tagDesc) {
  return value + tagDesc.value;
};

cwt._tagCodes.SET_VALUE = function(value, tagDesc) {
  return tagDesc.value;
};

cwt._tagCodes.VALUE = function( value, tagDesc ){
  return tagDesc.value;
}
/** @config */
cwt.MAX_MAP_WIDTH = 100;

/** @config */
cwt.MAX_MAP_HEIGHT = 100;

/** @config */
cwt.MAX_PLAYER = 8;

/** @config */
cwt.MAX_UNITS_PER_PLAYER = 50;

/** @config */
cwt.MAX_PROPERTIES = 200;

/** @constant */
cwt.INACTIVE_ID = -1;

/** @private */
cwt.mapWidth = 0;

/** @private */
cwt.mapHeight = 0;

/** @private */
cwt._map = null;

/** @private */
cwt._unitPosMap = null;

/** @private */
cwt._units = null;

/** @private */
cwt._players = null;

/** @private */
cwt._propertyPosMap = null;

/** @private */
cwt._properties = null;

cwt.onInit( "model", function( annotated ){

  cwt.serializedProperty("mapWidth");
  cwt.serializedProperty("mapHeight");
  cwt.serializedProperty("_map");
  cwt.serializedProperty("_units");
  cwt.serializedProperty("_players");
  cwt.serializedProperty("_properties");
  cwt.serializedProperty("_unitPosMap");
  cwt.serializedProperty("_propertyPosMap");

  cwt.transaction("setUnitPosition");

  var maxW = cwt.MAX_MAP_WIDTH;
  var maxH = cwt.MAX_MAP_HEIGHT;

  cwt._map = cwt.util.matrix( maxW, maxH, null );
  cwt._unitPosMap = cwt.util.matrix( maxW, maxH, null );
  cwt._propertyPosMap = cwt.util.matrix( maxW, maxH, null );

  cwt._units = cwt.util.list( cwt.MAX_PLAYER*cwt.MAX_UNITS_PER_PLAYER,
  function(){
    return {
      x:0,
      y:0,
      type: null,
      fuel: 0,
      owner: cwt.INACTIVE_ID
    }
  });

  cwt._players = cwt.util.list( cwt.MAX_PLAYER+1,
  function( index ){
    var neutral = (index === 8);
    return {
      gold: 0,
      team: ( neutral )? 9999 : cwt.INACTIVE_ID,
      name: ( neutral )? "NEUTRAL" : null
    }
  });

  cwt._properties = cwt.util.list( cwt.MAX_PROPERTIES,
  function(){
    return {
      capturePoints: 20,
      owner: -1
    }
  });
});

/**
 * Returns an unit by its id.
 *
 * @param id
 */
cwt.unitById = function(id){
  if( id < 0 || cwt._units.length <= id ){
    cwt.error("invalid unit id {0}",id);
  }

  var o = this._units[id];
  return ( o.owner === cwt.INACTIVE_ID )? null : o;
};

/**
 * Returns an unit by its position.
 *
 * @param id
 */
cwt.unitByPos = function( x, y ){
  return cwt._unitPosMap[x][y];
};

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
cwt.extractUnitId = function( unit ){
  if( unit === null ){
    cwt.error("unit argument cannot be null");
  }

  var units = cwt._units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  // illegal unit object ?!
  cwt.error("cannot find unit {0}",unit);
};

/**
 * Returns a player by its id.
 *
 * @param id
 */
cwt.player = function(id){
  if( id < 0 || this._players.length <= id ) cwt.log.error("invalid id");

  var o = this._players[id];
  if( o.team === cwt.INACTIVE_ID ) return null; //throw Error("invalid id");

  return o;
};

/**
 * Returns a property by its id.
 *
 * @param id
 */
cwt.propertyById = function(id){
  if( id < 0 || cwt._properties.length <= id ){
    cwt.error("invalid property id {0}",id);
  }

  var o = cwt._properties[id];
  return ( o.owner === cwt.INACTIVE_ID )? null : o;
};

/**
 * Returns a property by its position.
 *
 * @param id
 */
cwt.propertyByPos = function( x, y ){
  return cwt._propertyPosMap[x][y];
};

cwt.tileOccupiedByUnit = function( x,y ){
  var unit = cwt.unitByPos(x,y);
  if( unit === null ) return false;
  else{
    return cwt.extractUnitId( unit );
  }
};

cwt.tileIsProperty = function( x,y ){
  var prop = cwt.propertyByPos(x,y);
  if( prop === null ) return false;
  else{
    return cwt.extractPropertyId( prop );
  }
};

/**
 * Extracts the identical number from a property object.
 *
 * @param unit
 */
cwt.extractPropertyId = function( property ){
  if( property === null ){
    cwt.error("property argument cannot be null");
  }

  var props = cwt._properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  // illegal unit object ?!
  cwt.error("cannot find property {0}", property );
};

cwt.setUnitPosition = function( uid, tx, ty ){
  var unit = cwt.unitById(uid);
  var ox = unit.x;
  var oy = unit.y;
  var uPosMap = cwt._unitPosMap;

  // clear old position
  uPosMap[ox][oy] = null;

  // unit has a new position
  if( arguments.length > 1 ){
    unit.x = tx;
    unit.y = ty;

    uPosMap[tx][ty] = unit;
  }
}

/**
 * Loads a map and initializes the game context.
 */
cwt.loadMap = function( data ){

  if( cwt.DEBUG ){
    cwt.info("start loading map");
  }

  // TODO map is data from outside, check it via shema

  // meta data
  cwt.mapWidth = data.width;
  cwt.mapHeight = data.height;

  // TODO this should be in map data possible
  // TODO too ( e.g. if map is the result of a save game )
  // this._day = 0;
  // this._activePlayer = 0;
  cwt._turnPid = 0;

  // filler
  for( var x=0, e1=cwt.mapWidth; x<e1; x++ ){
    for( var y=0, e2=cwt.mapHeight; y<e2; y++ ){
      cwt._map[x][y] = data.filler;
    }
  }

  for( var x=0, e1=cwt.mapWidth; x<e1; x++ ){
    for( var y=0, e2=cwt.maxHeight; y<e2; y++ ){
      cwt._unitPosMap[x][y] = null;
    }
  }

  // special tiles
  cwt.util.each( data.data , function( col, x ){
    cwt.util.each( col , function( tile, y ){
      cwt._map[x][y] = tile;
    });
  });


  for( var i=0, e=cwt._units.length; i<e; i++){
    cwt._units[i].owner = cwt.INACTIVE_ID;
  }

  // players
  for( var i = 0, e = data.players.length; i<e; i++){
    var s_player = data.players[i];
    var t_player = cwt._players[i];

    t_player.gold = s_player.gold;
    t_player.team = s_player.team;
    t_player.name = s_player.name;

    // units
    var startIndex = i*cwt.MAX_UNITS_PER_PLAYER;
    for( var j = 0, ej = s_player.units.length; j<ej; j++){
      var s_unit = s_player.units[j];
      var t_unit = this._units[ startIndex+j ];

      t_unit.fuel  = s_unit.fuel;
      t_unit.x     = s_unit.x;
      t_unit.y     = s_unit.y;
      t_unit.type  = s_unit.type;
      t_unit.owner = s_unit.owner;

      // TODO use identical
      cwt._unitPosMap[s_unit.x][s_unit.y] = t_unit;
    }
  }
  for( var i=data.players.length,e=cwt._players.length; i<e; i++){
    cwt._players[i].team = cwt.INACTIVE_ID;
  }

  // properties
  for( var i = 0, e = data.properties.length; i<e; i++){
    var s_property = data.properties[i];
    var t_property = cwt._properties[i];

    t_property.owner          = s_property.owner;
    t_property.capturePoints  = s_property.capturePoints;
    t_property.type           = s_property.type;
    t_property.x              = s_property.x;
    t_property.y              = s_property.y;

    // TODO use identical
    cwt._propertyPosMap[t_property.x][t_property.y] = t_property;
  }
  for( var i=data.properties.length,e=cwt._properties.length; i<e; i++){
    cwt._properties[i].owner = cwt.INACTIVE_ID;
  }

  // add actors
  var startIndex= cwt._turnPid*cwt.MAX_UNITS_PER_PLAYER;
  for( var i= startIndex,
         e=   i+cwt.MAX_UNITS_PER_PLAYER; i<e; i++ ){

    cwt._turnActors[i-startIndex] = ( cwt.unitById(i) !== null )? true : false;
  }

  if( cwt.DEBUG ){
    cwt.info("map successfully loaded");
  }
};

  /*
     D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]

     D = Actual damage expressed as a percentage

     B = Base damage (in damage chart)
     ACO = Attacking CO attack value (example:130 for Kanbei)

     R = Random number 0-9

     AHP = HP of attacker

     DCO = Defending CO defense value (example:80 for Grimm)
     DTR = Defending Terrain Stars (IE plain = 1, wood = 2)
     DHP = HP of defender
   */


  /*
     Denoted as xxxXXXX where x = small star and X = big star..for now.
     Every star is worth 9000 fund at the start of the game. Each additional use of CO Power(including SCOP)
     increase the value of each star by 1800 fund up to the tenth usage, when it won't increase any further.

     Stars on your Charge Meter can be charged in two ways:

     Damaging your oppoent's units. You gain meter equal to half the fund damage you deal.
     Receiving damage from your opponent. You gain meter equal to the fund damage you take.
     Keep in mind that AWBW only keeps track of real numbers for the purpose of Charge Meter calculation.
     That means taking a 57% attack and ending up with 5 hp only adds 0.5*full cost of unit to your Charge Meter.
     In Summary, the amount of charge added to your meter can be calculated as:

     (0.5*0.1*Damage Dealt*Cost of Unit X)+(0.1*Damage Received*Cost of Unit Y)


     It should be noted that a COs meter does not charge during the turn they activate a power.
   */

  /*
     There are multiple victory conditions in Advance Wars By Web, not all of them are possible every game.

     Annihilation
     Kill Everything that's not yours and you win, simple

     Head Quarters Capture
     Capturing a HQ defeats the owning player, no matter what, if a player owns multiple HQs the capture of any
     of them eliminates the owner.

     Lab Monopoly
     If there are no HQs Labs take their place, they work like HQs except you have to capture all of a players
     labs to eliminate them.

     Property
     In some games taking a set number of properties under your control wins you the game. Most of the time
     this option is left off, but be sure to check for it when joining a game!

     Forfeit
     Sometimes the only way to win is to get the other player to give up

     Draw
     Not actually a victory condition, but if both players agree be clicking (set draw) the game is officially tied,
     use it to end stalemates.
   */

/** @private */
cwt._dbAmanda = null;

/** @private */
cwt._unitSheets = {};

/** @private */
cwt._tileSheets = {};

/** @private */
cwt._weaponSheets = {};

/** @private */
cwt._weatherSheets = {};

/** @private */
cwt._movetypeSheets = {};

cwt.UNIT_TYPE_SHEET = 0;
cwt.TILE_TYPE_SHEET = 1;
cwt.WEAPON_TYPE_SHEET = 2;
cwt.WEATHER_TYPE_SHEET = 3;
cwt.MOVE_TYPE_SHEET = 4;

cwt.onInit( "db", function(){
  cwt._dbAmanda = amanda("json");
});

/**
 * Different sheet validators.
 *
 * @namespace
 */
cwt.typeSheetValidators = {

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
      ID: { type:'string', except:[], required:true }
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

/**
 * Returns a unit type by its id.
 *
 * @param id
 */
cwt.unitSheet = function(id){
  if( !cwt._unitSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._unitSheets[id];
};

/**
 * Returns a tile type by its id.
 *
 * @param id
 */
cwt.tileSheet = function(id){
  if( !cwt._tileSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._tileSheets[id];
};

/**
 * Returns a move type by its id.
 *
 * @param id
 */
cwt.movetypeSheet = function(id){
  if( !cwt._movetypeSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id); }

  return cwt._movetypeSheets[id];
};

/**
 * Returns a weapon type by its id.
 *
 * @param id
 */
cwt.weaponSheet = function(id){
  if( !cwt._weaponSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._weaponSheets[id];
};

/**
 * Returns a weather type by its id.
 *
 * @param id
 */
cwt.weatherSheet = function(id){
  if( !cwt._weatherSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._weatherSheets[id];
};

/**
 * Parses a data object into the database. The data object must be
 * a valid javascript object. The type decide what kind of the the
 * data object is.
 */
cwt.parseSheet = function( data, type ){
  var schema, db, excList;
  var id = data.ID;

  // find schema and data list
  switch( type ){

    case cwt.UNIT_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.unitValidator;
      db = cwt._unitSheets;
      excList = cwt.typeSheetValidators.unitValidator.properties.ID.except;
      break;

    case cwt.TILE_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.tileValidator;
      db = cwt._tileSheets;
      excList = cwt.typeSheetValidators.tileValidator.properties.ID.except;
      break;

    case cwt.WEAPON_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.weaponValidator;
      db = cwt._weaponSheets;
      excList = cwt.typeSheetValidators.weaponValidator.properties.ID.except;
      break;

    case cwt.WEATHER_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.weatherValidator;
      db = cwt._weatherSheets;
      excList = cwt.typeSheetValidators.weatherValidator.properties.ID.except;
      break;

    case cwt.MOVE_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.movetypeValidator;
      db = cwt._movetypeSheets;
      excList = cwt.typeSheetValidators.movetypeValidator.properties.ID.except;
      break;

    default: cwt.error("unknow type {0}",type);
  }

  cwt._dbAmanda.validate( data, schema, function(e){
    if( e ){
      cwt.error( "failed to parse sheet due {0}", e.getMessages() );
      throw Error( e );
    }
  });

  if( db.hasOwnProperty(id) ) cwt.error("{0} is already registered",id);
  db[id] = data;

  // register id in exception list
  excList.push(id);
};
/**
 * The input controller handles all incoming input data from the user
 * and alters the internal data. A game client should use this to 
 * communicate with the engine rather than calling the service functions
 * on its own.
 */
cwt.input = StateMachine.create({

  initial: 'Off',

  error: function( eventName, from, to, args, errorCode, errorMessage, e ){
                   
    if( cwt.DEBUG ){ 
      cwt.error(
        "error in input controller code:{0} message:{1} e:{4} from:{2} to:{3}",
        errorCode, errorMessage, from, to, e.message
      );
    }

    return "";
  },

  events: [

    { name: 'init', from: 'Off', to: 'NoSelection' },

    // UNIT SELECTION
    { name: 'unitSelected',  from: 'NoSelection',
                             to: 'UnitSelection' },
    { name: 'showMoveMap',   from: ['UnitSelection','UnitMoveMap'],
                             to: 'UnitMoveMap'   },
    { name: 'showActionMap', from: ['UnitSelection','UnitMoveMap'],
                             to: 'UnitActions'   },
    
    // FACTORY SELECTIONS
    { name: 'factorySelected', from: 'NoSelection', to: 'FactoryActions' },
    
    // MAP (NO SELECTION)
    { name: 'mapSelected',     from: 'NoSelection', to: 'MapActions'     },
    
    // GLOBAL ACTIONS
    { name: 'doAction', from: ['MapActions','UnitActions','FactoryActions'],
                        to: 'NoSelection' },
    { name: 'back',     from: '*', to: 'NoSelection' }
  ],

  /*
   * Callback events to react if special state changes occur.
   */
  callbacks: {

    onchangestate: function( ev, f, t ){
      if( f !== 'none' && f !== 'Off' ){
        this.emitStateChange( t,f,ev );
      }
    },

    onbeforeinit: function(){
      cwt.util.observable( this, 'StateChange' );
      this.movemap = null;
    },
    
    onbeforeunitSelected: function( ev, f, t, uid ){
      if( cwt.DEBUG ){
        cwt.info("selecting unit {0}", uid);
      }
      
      this.selected = uid;
    },
    
    onbeforefactorySelected: function( ev, f, t, fid ){
      if( cwt.DEBUG ){
        cwt.info("selecting property {0}", fid);
      }
      
      this.selected = fid;
    },
    
    onbeforedoAction: function( ev, f, t, actionIndex ){
      var actions = this.actions;
      
      if( actionIndex < 0 || actionIndex >= actions.length ){
        cwt.error('invalid action index {0}',actionIndex);
      }
      
      // move way if possible
      if( this.movemap !== null && this.movemap.way.length > 0 ){
        cwt.moveUnit( this.movemap );
      }
      
      // do action 
      cwt.doAction( actions[ actionIndex ] );
    },

    /*
     * ...
     */
    onshowActionMap: function( ev, f, t, x, y, way ){
    
      // save path if possible  
      if( way !== undefined ){ 
        this.movemap.way = way; 
      }
    },
    
    /*
     * Enter no selection state, all tempoary data needs to 
     * be cleaned for next selection.
     */
    onenterNoSelection: function(){
      this.movemap = null;   // current active move map
      this.actions = null;   // current actions of the selected object
      this.selected = -1;    // holds the id of the current selected object
    },

    /*
     * Enter move way selection state, the move map needs to 
     * be generated for the selected unit.
     */
    onenterUnitMoveMap: function( ev, f, t ){
      this.movemap = cwt.createMoveCard( this.selected );
    },
    
    /*
     * Factory action menu.
     */
    onenterFactoryActions: function( ev, f, t, x, y ){
      if( this.selected === -1 ){
        cwt.error('no factory is selected');
      }

      cwt.error('factory actions are not implemented yet');
    },
    
    /*
     * Unit action menu.
     */
    onenterMapActions: function( ev, f, t, x, y ){
      this.actions = cwt.mapActions( x, y );
    },
    
    /*
     * Unit action menu.
     */
    onenterUnitActions: function( ev, f, t, x, y ){
      if( this.selected === -1 ){
        cwt.error('no unit is selected');
      }

      if( this.movemap.moveMap[x][y] > 0 ){
        this.actions = cwt.unitActions( this.selected, x, y );
      }
      else cwt.error("cannot move onto tile {0},{1}",x,y);
    }
  }

});

cwt.onInit("input controller", function(){ cwt.input.init(); });
cwt._moveCardPool = null;

cwt.onInit( "move", function(){
  //cwt.transaction("moveUnit");
  cwt.transaction("_movePath");

  cwt._moveCardPool = cwt.util.objectPool(function( map ){

    map.uid = -1;
    map.x = -1;
    map.y = -1;
    map.r = -1;

    var moveMapDim = cwt.MAX_MOVE_RANGE*2+1;
    if( map.moveMap === undefined ){
      map.moveMap = cwt.util.matrix( moveMapDim, moveMapDim, -1 );
    }
    else{
      for( var x=0; x<moveMapDim; x++ ){
        for( var y=0; y<moveMapDim; y++ ){
          map.moveMap[x][y] = -1;
        }
      }
    }


    map.moveMapX = -1;
    map.moveMapY = -1;

    if( map.way === undefined ){
      map.way = [];
    }
    else{
      map.way.splice(0);
    }
  });
});

/** @config */
cwt.MAX_MOVE_RANGE = 15;

/** @constant */
cwt.MOVE_CODE_UP    = 0;

/** @constant */
cwt.MOVE_CODE_RIGHT = 1;

/** @constant */
cwt.MOVE_CODE_DOWN  = 2;

/** @constant */
cwt.MOVE_CODE_LEFT  = 3;

/**
 * Returns the costs for a movetype to move onto a tile type.
 *
 * @param movetype
 * @param tiletype
 */
cwt.moveCosts = function( movetype, tiletype ){
  var c;

  // search id
  var c = movetype.costs[ tiletype ];
  // console.log( "MOVECOST "+tiletype+" -> "+c );
  if( c !== undefined ) return c;

  // search tags (TODO)

  // fallback entry
  return movetype.costs["*"];
};

cwt.moveCostsForPos = function( card, x, y ){

  var sx = x - card.moveMapX;
  var sy = y - card.moveMapY;

  if( sx < 0 ||
      sy < 0 ||
      sx >= 2*cwt.MAX_MOVE_RANGE+1 ||
      sy >= 2*cwt.MAX_MOVE_RANGE+1    ){
    cwt.error("position {0},{1} is out of move map bounds",x,y);
  }
  else{
    return card.moveMap[sx][sy];
  }
}

/**
 * Creates a move map for a given unit. The position of the unit can be faked
 * by a given second and third argument that indicates a possible position.
 * If only the unit id is given, then the unit position will be used.
 */
cwt.createMoveCard = function( uid, x, y ){
  var unit = cwt.unitById( uid );
  var type = cwt.unitSheet( unit.type );
  var mType = cwt.movetypeSheet( type.moveType );
  var player = cwt.player( unit.owner );

  // if no position is given then use the unit position
  if( arguments.length === 1 ){
    x = unit.x;
    y = unit.y;
  }

  var map = cwt._moveCardPool.request();

  // meta data
  map.uid = uid;
  map.x = x;
  map.y = y;
  map.r = type.moveRange;

  // var moveMapDim = cwt.MAX_MOVE_RANGE*2+1;
  // map.moveMap = cwt.util.matrix( moveMapDim, moveMapDim, -1 );
  map.moveMapX = Math.max( map.x - cwt.MAX_MOVE_RANGE, 0);
  map.moveMapY = Math.max( map.y - cwt.MAX_MOVE_RANGE, 0);

  // map.way = [];

  // decrease range if not enough fuel is available
  if( unit.fuel < map.r ) map.r = unit.fuel;

  // add start tile to map
  map.moveMap[ map.x-map.moveMapX ][ map.y-map.moveMapY ] = map.r;

  // build move map
  var tile, cost, rest;

  // TODO enhance
  var needsCheck = [ [ x, y, map.r ] ];
  while( needsCheck.length > 0 ){

    // get next tile
    // tile = needsCheck[ needsCheck.length-1 ];
    tile = needsCheck[ 0 ];
    needsCheck.splice(0,1);

    // UP
    if( tile[1] > 0 )
      cwt._moveCheck( tile[0], tile[1]-1, tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );

    // RIGHT
    if( tile[0] < cwt.mapWidth-1 )
      cwt._moveCheck( tile[0]+1, tile[1], tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );

    // DOWN
    if( tile[1] < cwt.mapHeight-1 )
      cwt._moveCheck( tile[0], tile[1]+1, tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );

    // LEFT
    if( tile[0] > 0 )
      cwt._moveCheck( tile[0]-1, tile[1], tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );
  }

  // convert left move points to cost points
  var moveMapDim = cwt.MAX_MOVE_RANGE*2+1;
  for( var x=0,xe=moveMapDim; x<xe; x++ ){
    for( var y=0,ye=moveMapDim; y<ye; y++ ){
      if( map.moveMap[x-map.moveMapX][y-map.moveMapY] != -1 ){
        map.moveMap[x-map.moveMapX][y-map.moveMapY] = cwt.moveCosts( mType, cwt._map[x][y] );
      }
    }
  }

  if( cwt.DEBUG ) cwt.info("result move card\n {0}", map );

  return map;
};

/**
 * Returns a path from (sx,sy) to (tx,ty) as array of move codes. If a move
 * with the current amount of fuel or movepoints is not possible, then an empty
 * array will be returned.
 *
 * @param uid
 * @param sx
 * @param sy
 * @param tx
 * @param ty
 * @param mvp
 */
cwt.returnPath = function( uid, stx, sty, tx, ty , card){
  var moveMap = card.moveMap;
  var unit = cwt.unitById( card.uid );
  var type = cwt.unitSheet( unit.type );
  var mType = cwt.movetypeSheet( type.moveType );

  // var graph = new Graph( nodes );
  var graph = new Graph( card.moveMap );
  var start = graph.nodes[stx-card.moveMapX][sty-card.moveMapY];
  var end = graph.nodes[tx-card.moveMapX][ty-card.moveMapY];
  var path = astar.search( graph.nodes, start, end );

  if( cwt.DEBUG ) cwt.info("path:{0}",path);

  var codesPath = [];
  var cx = stx-card.moveMapX;
  var cy = sty-card.moveMapY;
  var cNode;

  for( var i=0,e=path.length; i<e; i++ ){
    cNode = path[i];

    var dir;
    if( cNode.x > cx ) dir = 1;
    if( cNode.x < cx ) dir = 3;
    if( cNode.y > cy ) dir = 2;
    if( cNode.y < cy ) dir = 0;

    if( dir === undefined ) throw Error();

    codesPath.push( dir );

    cx = cNode.x;
    cy = cNode.y;
  }

  return codesPath;
};

/**
 * Makes a move by a given move card object.
 *
 * @param card
 */
cwt.moveUnit = function( card ){

  var cX = card.x,
      cY = card.y;
  var way = card.way;
  var unit = cwt.unitById( card.uid );
  var uType = cwt.unitSheet( unit.type );
  var mType = cwt.movetypeSheet( uType.moveType );

  // check move way end
  var lastIndex = way.length-1;
  var fuelUsed = 0;
  for( var i=0,e=way.length; i<e; i++ ){

    // get new current position
    switch( way[i] ){

      case cwt.MOVE_CODE_UP:
        if( cY === 0 ) cwt.error("cannot do move command UP because current position is at the border");
        cY--;
        break;

      case cwt.MOVE_CODE_RIGHT:
        if( cX === cwt.mapWidth-1 ){
          cwt.error("cannot do move command UP because current position is at the border");
        }
        cX++;
        break;

      case cwt.MOVE_CODE_DOWN:
        if( cY === cwt.mapHeight-1 ){
          cwt.error("cannot do move command DOWN because current position is at the border");
        }
        cY++;
        break;

      case cwt.MOVE_CODE_LEFT:
        if( cX === 0 ) cwt.error("cannot do move command LEFT because current position is at the border");
        cX--;
        break;

      default: throw Error("unknown command "+way[i]);
    }

    // is way blocked ?
    if( cwt._wayBlocked( cX, cY, unit.owner, i == e-1 ) ){

      lastIndex = i-1;

      // GP BACK
      switch( way[i] ){

        case cwt.MOVE_CODE_UP:
          cY++;
          break;

        case cwt.MOVE_CODE_RIGHT:
          cX--;
          break;

        case cwt.MOVE_CODE_DOWN:
          cY--;
          break;

        case cwt.MOVE_CODE_LEFT:
          cX++;
          break;
      }


      if( lastIndex == -1 ){

        // that is a fault
        cwt.error("unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!");
      }

      break;
    }

    // increase fuel usage
    fuelUsed += cwt.moveCosts( mType, cwt._map[cX][cY] );
  }

  unit.fuel -= fuelUsed;

  cwt.setUnitPosition( card.uid ); // remove old reference
  cwt._movePath( card.uid, card.x, card.y , ( lastIndex !== way.length-1 )?
                                way.slice(0,lastIndex+1): way );

  cwt.setUnitPosition( card.uid, cX, cY ); // set new reference

  if( cwt.DEBUG ){
    cwt.info("moved unit {0} from ({1},{2}) to ({3},{4})",
      card.uid,
      card.x, card.y,
      cX, cY );
  }
};

cwt._movePath = function( uid, x,y, path ){}

/** @private */
cwt._moveCheck = function( tx, ty, mvp, mType, movemap, mX, mY, checkMap, player ){

  var cost = cwt.moveCosts( mType, cwt._map[ tx ][ ty ] );
  if( cost != 0 ){

    // TODO support move through allied and own units
    var unit = cwt.unitByPos( tx, ty );
    if( unit !== null && cwt.player(unit.owner).team !== player.team ){
      return; }

    var rest = mvp-cost;
    if( rest >= 0 ){

      if( movemap[ tx-mX ][ ty-mY ] < rest ){

        // add to to check map
        checkMap.push( [ tx, ty, rest ] );

        // add to move map
        movemap[ tx-mX ][ ty-mY ] = rest;

        // negative costs means same costs but not usable as target
        //if( unit !== null && cwt.model.player(unit.owner).team === player.team ){
        // movemap[ tx ][ ty ] = -rest; }
      }
    }
  }
};

/**
 * Is a way blocked if an unit of an owner want to move to a given position?
 *
 * @param x
 * @param y
 * @param owner
 * @private
 */
cwt._wayBlocked = function( x,y, owner, lastTile ){

  // check current position
  var unit = cwt.unitByPos(x,y);
  if( unit !== null ){

    if( unit.owner === owner ){

      if( lastTile ){

        // that is a fault
        cwt.error("cannot move onto a tile that is occupied by an own unit");
      }
      // else move through it :P
    }
    else if( cwt.player(unit.owner).team === cwt.player(owner).team ){

      if( lastTile ){

        // that is a fault
        cwt.error("cannot move onto a tile that is occupied by an allied unit");
      }
      // else move through it :P
    }
    else{

      // enemy unit
      return true;
    }
  }

  return false;
};
cwt.onInit( "properties", function(){
  cwt.userAction("captureProperty",
    function( actions, x, y, prop, unit, selected ){

      if( selected !== null && prop !== null &&
        cwt.unitSheet( selected.type ).captures > 0 &&
        cwt.player(prop.owner).team !== cwt.player(selected.owner).team ){

        actions.push({
          k: "captureProperty",
          a: [ x, y, cwt.extractUnitId( selected ) ]
        });
      }
    });

  cwt.transaction("captureProperty");
});

/**
 * Captures a property by a given unit.
 *
 * @param x x position
 * @param y y position
 * @throws error if the data is not legal
 */
cwt.captureProperty = function( x, y, id ){
  var unit   = cwt.unitById(id);
  var unitSh = cwt.unitSheet( unit.type );
  var prop   = cwt.propertyByPos( x, y );

  prop.capturePoints -= unitSh.captures;
  if( prop.capturePoints <= 0 ){
    if( cwt.DEBUG ) cwt.info( "property at ({0},{1}) captured", x, y );

    // if the property is a hq then the owner looses the game
    if( prop.type === 'HQ' ){
      var oldPlayer = cwt.player(prop.owner);

      var units = cwt.selectOwnUnits( prop.owner );
      for( var i = 0, e = units.length; i<e; i++ ){
        units[i].team = -1;
        cwt._unitPosMap[ units[i].x ][ units[i].y ] = null;
      }

      var props = cwt.selectOwnProperties( prop.owner );
      for( var i = 0, e = props.length; i<e; i++ ){
        props[i].owner = -1;
      }

      oldPlayer.team = -1;
    }

    // set new meta data for property
    prop.capturePoints = 20;
    prop.owner = unit.owner;
  }

  cwt._localWait(unit);
};
/**
 * Selects unit objects.
 *
 * @private
 * @param pidFits
 * @param tidFits
 */
cwt._createPidTidSelector = function( pidFits, tidFits ){
  var units = cwt._units;

  return function( pid ){
    var result = [];
    var tid = cwt.player(pid).team;
    var cPid = -1;
    var cTid = -1;

    for( var i=0,e=units.length; i<e; i++ ){

      // next player
      if( i % cwt.MAX_UNITS_PER_PLAYER === 0 ){
        cPid++;
        var player = cwt.player(cPid);
        if( player !== null ){
          cTid = player.team;
        }
        else{
          // go to next player
          i += cwt.MAX_UNITS_PER_PLAYER-1;
          continue;
        }
      }

      // check by modificator
      var unit = cwt.unitById(i);
      if( unit !== null &&
        ((cPid === pid) === pidFits ) &&
        ((cTid === tid) === tidFits )
        ){
        result[ result.length ] = unit;
      }
    }

    return result;
  };
}

/**
 * Selects property objects.
 *
 * @private
 * @param pidFits
 * @param tidFits
 */
cwt._createPidTidSelectorProperties = function( pidFits, tidFits ){
  var properties = cwt._properties;

  return function( pid ){
    var result = [];
    var tid = cwt.player(pid).team;
    for( var i=0,e=properties.length; i<e; i++ ){

      // check by modificator
      var prop = cwt.propertyById(i);
      if( prop !== null && prop.owner !== -1 &&
        (( prop.owner === pid) === pidFits ) &&
        (( cwt.player(prop.owner).team === tid) === tidFits )
        ){
        result[ result.length ] = prop;
      }
    }

    return result;
  };
}

cwt.selectOwnUnits = null;
cwt.selectEnemyUnits = null;
cwt.selectAlliedUnits = null;

cwt.selectOwnProperties = null;
cwt.selectEnemyProperties = null;
cwt.selectAlliedProperties = null;

cwt.onInit("selectors",function(){
  cwt.selectOwnUnits = cwt._createPidTidSelector(true,true);
  cwt.selectEnemyUnits = cwt._createPidTidSelector(false,false);
  cwt.selectAlliedUnits = cwt._createPidTidSelector(false,true);

  cwt.selectOwnProperties = cwt._createPidTidSelectorProperties(true,true);
  cwt.selectEnemyProperties = cwt._createPidTidSelectorProperties(false,false);
  cwt.selectAlliedProperties = cwt._createPidTidSelectorProperties(false,true);
});

/** @private */
cwt._turnPid = -1;

/** @private */
cwt._turnActors = null;

cwt.day = 0;

cwt.onInit( "turn",
function(){

  cwt._turnActors = cwt.util.list( cwt.MAX_UNITS_PER_PLAYER, -1 );

  cwt.serializedProperty("_turnPid");
  cwt.serializedProperty("_turnActors");

  cwt.userAction("nextTurn", function( actions, x, y, prop, unit, selected ){
    if( selected === null ){
      actions.push({
        k:"nextTurn",
        a:null
      });
    }
  });

  cwt.transaction("nextTurn");

  cwt.userAction("wait", function( actions, x, y, prop, unit, selected ){
    if( selected !== null ){
      actions.push({
        k:"wait",
        a:[ selected ]
      });
    }
  });

  cwt.transaction("wait");
});

cwt.canAct = function( uid ){
  var startIndex = cwt._turnPid*cwt.MAX_UNITS_PER_PLAYER;

  // not the owner of the current turn
  if( uid < startIndex || uid >= startIndex + cwt.MAX_UNITS_PER_PLAYER ){
    return false;
  }

  var index = uid - startIndex;
  return cwt._turnActors[ index ] === true;
};

/**
 * Removes an unit from the actable array. An unit that goes into
 * the wait status cannot do another action in the active turn.
 *
 * @param uid
 */
cwt.wait = function( unit ){
  cwt._localWait(unit);
};

cwt._localWait = function( unit ){
  var uid = ( typeof unit === 'number' )? unit : cwt.extractUnitId( unit );
  var startIndex = cwt._turnPid*cwt.MAX_UNITS_PER_PLAYER;

  // not the owner of the current turn
  if( uid < startIndex || uid >= startIndex + cwt.MAX_UNITS_PER_PLAYER ){
    cwt.error("unit owner is not the active player");
  }

  cwt._turnActors[ uid - startIndex ] = false;
  if( cwt.DEBUG ) cwt.info("unit {0} going into wait status", uid );
};

/**
 * @example
 *  type: userAction
 *  type: transaction
 */
cwt.nextTurn = function(){
  if( cwt.DEBUG ) cwt.info("ending turn");

  var pid = cwt._turnPid;

  // end turn
  if( pid !== -1 ) cwt._turnEnd( cwt.player(pid) );

  // find next player
  var oid = pid;
  pid++;
  while( pid !== oid ){

    if( cwt.player( pid ) !== null ){

      // found next player
      break;
    }

    // increase id
    pid++;
    if( pid === cwt.MAX_PLAYER ) pid = 0;
  }

  // check new
  if( pid === oid ) cwt.error("cannot find next player");
  cwt._turnPid = pid;

  // add actors
  var startIndex= pid*cwt.MAX_UNITS_PER_PLAYER;
  for( var i= startIndex,
           e=   i+cwt.MAX_UNITS_PER_PLAYER; i<e; i++ ){

    cwt._turnActors[i-startIndex] = ( cwt.unitById(i) !== null )? true : false;
  }

  // start turn
  cwt._turnStart( cwt.player(pid) );
};

/** @private */
cwt._turnStart = function( player ){
  if( cwt.DEBUG ) cwt.info( player.name+" starts his turn" );
};

/** @private */
cwt._turnEnd = function( player ){
  if( cwt.DEBUG ) cwt.info( player.name+" ends his turn" );
};