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