/** @constant */
var CWT_LAYER_MODEL         = "MODEL";

/** @constant */
var CWT_LAYER_SHEETS        = "SHEETS";

/** @constant */
var CWT_LAYER_DATA_ACCESS   = "DATA_ACCESS";

/** @constant */
var CWT_LAYER_ACTIONS       = "ACTIONS";

/** @constant */
var CWT_LAYER_ACTION_ACCESS = "ACTIONS_ACCESS";

/** @constant */
var CWT_LAYER_CLIENT        = "CLIENT";

/** @constant */
var CWT_LAYER_PERSISTENCE   = "PERSISTENCE";

/** @constant */
var CWT_LAYER_UTILITY       = "UTIL";

/**
 * Main object for the whole game engine. This root object holds the layer
 * structure and provides API to inject content into the layers.
 *
 * @namespace
 */
var cwt = ( function( options ){

  var _layerNames = options.layers;
  if( _layerNames.length == 0 ){
    throw Error("at least one layer is needed");
  }

  // HOLDS THE PUBLIC LAYER API
  var layers = {};
  var finLayers = {};
  var layerAccess = {};

  // CREATE LAYER OBJECTS
  for( var i=0; i< _layerNames.length; i++ ){
    layers[ _layerNames[i] ] = {};
  }

  // CREATE ARGUMENTS ARRAY FOR LAYER FACTORIES -> TO ACCESS OTHER LAYERS
  var _layerAccess = options.layerAccess;
  for( var i=0; i< _layerAccess.length; i++ ){
     var _cLayerAccess = _layerAccess[i];

    if( _cLayerAccess.length != 2 ){
      throw Error("illegal layer access description -> "+JSON.stringify(
        _cLayerAccess
      ));
    }

    // BUILD ARGUMENT ARRAY
    layerAccess[ _cLayerAccess[0] ] = [];
    for( var j=0,ej=_cLayerAccess[1].length; j<ej; j++ ){
      layerAccess[ _cLayerAccess[0] ][ j ] = layers[ _cLayerAccess[1][j] ];
    }
  }

  var api ={};

  /**
   * Finalizes a layer. The given layer cannot be appended with defineLayer
   * after this function was called to finalize it.
   *
   * @param layerName
   * @memberOf cwt
   * @name finalizeLayer
   * @throws error if the layer does not exists or is already finalized
   */
  api.finalizeLayer = function( layerName ){
    if( layers.hasOwnProperty( layerName ) ){
      if( !finLayers.hasOwnProperty( layerName ) ){
        finLayers[ layerName ] = true;
      }
      else throw Error("layer with name "+layerName+" is already finalized");
    }
    else throw Error("unknown layer with name "+layerName);
  };

  /**
   * Defines content for a given layer. This function does not creates the
   * layer. The layer is already created by the creation of the layer
   * structure object itself. This function only appends data to non
   * finalized layers. A try to append data to a finalized layer will raise
   * an error.
   *
   * @param layerId
   * @param factory
   * @memberOf cwt
   * @name defineLayer
   * @throws error if the given layer is already finalized
   */
  api.defineLayer = function( layerId, factory ){
    if( !layers.hasOwnProperty(layerId) ){
      throw Error("unknown layer id "+layerId);
    }

    if( finLayers.hasOwnProperty(layerId) ){
      throw Error("layer with id "+layerId+" is already finalized");
    }

    var layer = layers[layerId];

    // RECEIVE THE PUBLIC API OF THE LAYER
    var layer_args = (layerAccess[layerId] !== undefined )?
                      layerAccess[layerId] : [];

    factory.apply( null, layer_args );
  };

  /**
   * For debugging purposes. Returns a structure with the layers, the layer
   * access rules and the names of the finalized layers.
   *
   * @memberOf cwt
   * @name __debugAccess__
   */
  api.__debugAccess__ = function(){
    return {
      l: layers,
      la: layerAccess,
      fl: finLayers
    };
  };

  return api;

// INTIALIZE LAYER COMPONENT BY A FACTORY OPTIONS OBJECT
})({

  layers: [
    CWT_LAYER_MODEL,
    CWT_LAYER_SHEETS,
    CWT_LAYER_PERSISTENCE,
    CWT_LAYER_DATA_ACCESS,
    CWT_LAYER_ACTIONS,
    CWT_LAYER_ACTION_ACCESS,
    CWT_LAYER_CLIENT,
    CWT_LAYER_UTILITY
  ],

  layerAccess:[

    // SYSTEM
    [CWT_LAYER_PERSISTENCE,
      [CWT_LAYER_PERSISTENCE,CWT_LAYER_MODEL,CWT_LAYER_SHEETS,
        CWT_LAYER_DATA_ACCESS,CWT_LAYER_UTILITY]],

    [CWT_LAYER_UTILITY,   [CWT_LAYER_UTILITY]],

    // PURE BACKEND
    [CWT_LAYER_MODEL,     [CWT_LAYER_MODEL,CWT_LAYER_UTILITY]],
    [CWT_LAYER_SHEETS,    [CWT_LAYER_SHEETS,CWT_LAYER_UTILITY]],

    // BACKEND ACCESS
    [CWT_LAYER_DATA_ACCESS,
      [CWT_LAYER_DATA_ACCESS,CWT_LAYER_MODEL,CWT_LAYER_SHEETS,
        CWT_LAYER_UTILITY]],

    // ACTIONS
    [CWT_LAYER_ACTIONS,
      [CWT_LAYER_ACTIONS,CWT_LAYER_DATA_ACCESS,CWT_LAYER_UTILITY]],

    // PUBLIC API FOR THE CLIENT
    [CWT_LAYER_ACTION_ACCESS,
      [CWT_LAYER_ACTION_ACCESS,CWT_LAYER_ACTIONS,CWT_LAYER_DATA_ACCESS,
        CWT_LAYER_UTILITY]],

    // CLIENT (REAL PUBLIC)
    [CWT_LAYER_CLIENT,
      [CWT_LAYER_CLIENT,CWT_LAYER_ACTION_ACCESS, CWT_LAYER_DATA_ACCESS,
        CWT_LAYER_UTILITY, CWT_LAYER_PERSISTENCE ]]
  ]
});

// JUST FOR JsDoc @->--

/** @name action
  * @namespace */

/** @name data
  * @namespace */

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
 * @name model
 * @namespace
 */

/**
 * The sheets layer holds all object type sheets of the game. Sheets can be
 * accessed over the data layer from higher level layers.
 *
 * @example
 *  dependencies:
 *    -> https://github.com/Baggz/Amanda [0.4]
 *
 * @name sheets
 * @namespace
 */

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
 * Action type search:
 * <ul>
 *   <li>1. tile occupied by an actable unit</br>
 *        if yes then unit action else 2.</li>
 *   <li>2. is tile a property that can build things</br>
 *        if yes then property action else 3.</li>
 *   <li>3. map action</li>
 * </ul>
 * 
 * @name userAction
 * @namespace
 */

 /**
  * Some useful utility functions are stored in this layer. This layer contains
  * the logging functions of custom wars tactics. These functions are
  * overwritable to have a custom log behaviour for the game client. As example
  * if you use a graphical logging solution like BlackbirdJs.
  *
  * @name util
  * @namespace
  */

/** @name persistence
  * @namespace */