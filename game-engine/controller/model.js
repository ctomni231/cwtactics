cwt.model = {

  /** @constant */
  INACTIVE: -1,

  /** @private */
  _width: 0,

  /** @private */
  _height: 0,

  /** @private */
  _map: [],

  /** @private */
  _unitPosMap: [],

  /** @private */
  _units: [],

  /** @private */
  _players: [],

  /** @private */
  _propertyPosMap: [],

  /** @private */
  _properties: [],

  init: function( annotated ){
    annotated.persist("_width");
    annotated.persist("_height");
    annotated.persist("_map");
    annotated.persist("_units");
    annotated.persist("_players");
    annotated.persist("_properties");
    annotated.persist("_unitPosMap");
    annotated.persist("_propertyPosMap");

    for( var i=0; i<100; i++) cwt.model._map[i] = [];
    for( var i=0; i<100; i++) cwt.model._unitPosMap[i] = [];
    for( var i=0; i<100; i++) cwt.model._propertyPosMap[i] = [];

    for( var i=0; i<800; i++) cwt.model._units[i] = {
      x:0, y:0,
      type: null,
      fuel: 0,
      owner: cwt.model.INACTIVE
    };

    for( var i=0; i<8; i++) cwt.model._players[i] = {
      team: cwt.model.INACTIVE,
      gold: 0,
      name: null
    };

    for( var i=0; i<200; i++) cwt.model._properties[i] = {
      capturePoints: 20,
      owner: -1
    };
  },

  metrics: function(){
    return {
      width: this._width,
      height: this._height
    };
  },

  /**
   * Returns an unit by its id.
   *
   * @param id
   */
  unit: function(id){
    if( id < 0 || this._units.length <= id ) cwt.log.error("invalid id");

    var o = this._units[id];
    if( o.owner === cwt.model.INACTIVE ) return null; //throw Error("invalid id");

    return o;
  },

  unitByPos: function( x, y ){
    var unit;

    unit = this._unitPosMap[x][y];
    if( unit !== undefined ) return unit;

    return null;
  },

  unitId: function( unit ){
    for( var i = 0, e= this._units.length; i<e; i++ ){
      if( this._units[i] === unit ) return i;
    }

    return -1;
  },

  unitIdByPos: function( x, y ){
    var unit;

    for( var i = 0, e= this._units.length; i<e; i++ ){
      if( this._units[i].owner !== -1 && this._units[i].x === x && this._units[i].y === y ) return i;
    }

    return -1;
  },

  /**
   * Returns a player by its id.
   *
   * @param id
   */
  player: function(id){
    if( id < 0 || this._players.length <= id ) cwt.log.error("invalid id");

    var o = this._players[id];
    if( o.team === cwt.model.INACTIVE ) return null; //throw Error("invalid id");

    return o;
  },

  /**
   * Returns a property by its id.
   *
   * @param id
   */
  property: function(id){
    if( id < 0 || this._properties.length <= id ) cwt.log.error("invalid id");

    var o = this._properties[id];
    if( o.owner === cwt.model.INACTIVE ) return null; //throw Error("invalid id");

    return o;
  },

  propertyByPos: function( x, y ){
    var prop;

    prop = this._propertyPosMap[x][y];
    if( prop !== undefined ) return prop;

    return null;
  },

  propertyIdByPos: function( x, y ){
    var prop;

    for( var i = 0, e= this._properties.length; i<e; i++ ){
      if( this._properties[i].owner !== -1 && this._properties[i].x === x && this._properties[i].y === y ) return i;
    }

    return -1;
  },

  /**
   * Calls a function on the registered properties.
   */
  properties: function( selector, pid ){
    return this._collect( this._properties, pid, pt );
  },

  /**
   * Calls a function on the registered units.
   */
  units: function( selector, pid ){
    return this._collect( this._units, pid, pt );
  },

  /**
   * @param list
   * @param selector
   * @param pid
   * @private
   */
  _collect: function( list, selector, pid ){
    var pt;
    var result = [];
    var hasSelector = arguments.length > 0;
    if( hasSelector ) pt = cwt.model.player(pid).team;

    for(var i=0,e=list.length; i<e; i++){

      // check inactivity and selector
      if( list[i].owner !== this.INACTIVE ){
        if( !hasSelector || selector( list[i], pid, pt) ){

          // add the unit to the result
          result[ result.length ] = list[i];
        }
      }
    }

    return result;
  },

  /**
   * Loads a map and initializes the game context.
   */
  loadMap: function( data ){
    if( cwt.DEBUG ) cwt.log.info("load map");

    // TODO map is data from outside, check it via shema

    // meta data
    this._width = data.width;
    this._height = data.height;

    // TODO this should be in map data possible too ( e.g. if map is the result of a save game )
    this._day = 0;
    this._activePlayer = 0;

    // filler
    for( var x=0, e1=this._width; x<e1; x++ ){
      for( var y=0, e2=this._height; y<e2; y++ ){
        cwt.model._map[x][y] = data.filler;
      }
    }

    for( var x=0, e1=this._width; x<e1; x++ ){
      for( var y=0, e2=this._height; y<e2; y++ ){
        cwt.model._unitPosMap[x][y] = null;
      }
    }

    // special tiles
    cwt.util.each( data.data , function( col, x ){
      cwt.util.each( col , function( tile, y ){
        cwt.model._map[x][y] = tile;
      });
    });

    // players
    for( var i = 0, e = data.players.length; i<e; i++){
      var plD = data.players[i];

      this._players[i].gold = plD.gold;
      this._players[i].team = plD.team;
      this._players[i].name = plD.name;
    }
    for( var i=data.players.length, e=this._players.length; i<e; i++){
      this._players[i].team = this.INACTIVE;
    }

    // units
    for( var i = 0, e = data.units.length; i<e; i++){
      var unit = data.units[i];

      this._units[i].fuel = unit.fuel;
      this._units[i].x = unit.x;
      this._units[i].y = unit.y;
      this._units[i].type = unit.type;
      this._units[i].owner = unit.owner;

      // TODO use identical
      cwt.model._unitPosMap[unit.x][unit.y] = this._units[i];
    }
    for( var i=data.units.length, e=this._units.length; i<e; i++){
      this._units[i].owner = this.INACTIVE;
    }

    // properties
    for( var i = 0, e = data.properties.length; i<e; i++){
      var property = data.properties[i];

      this._properties[i].owner = property.owner;
      this._properties[i].capturePoints = property.capturePoints;
      this._properties[i].type = property.type;
      this._properties[i].x = property.x;
      this._properties[i].y = property.y;

      // TODO use identical
      cwt.model._propertyPosMap[property.x][property.y] = this._properties[i];
    }
    for( var i=data.properties.length, e=this._properties.length; i<e; i++){
      this._properties[i].owner = this.INACTIVE;
    }

    if( cwt.DEBUG ) cwt.log.info("map loaded");
  }
};