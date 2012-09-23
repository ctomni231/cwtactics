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