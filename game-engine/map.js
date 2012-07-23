cwt.map = cwt.model = {

  // constants
  INACTIVE: -1,

  // data
  _width: 0,
  _height: 0,
  _weather: null,
  _day: 0,
  _map: [],
  _units: [],
  _players: [],
  _properties: [],

  init: function(){

    for( var i=0; i<100; i++) cwt.map._map[i] = [];

    for( var i=0; i<800; i++) cwt.map._units[i] = {
      x:0, y:0,
      type: null,
      fuel: 0,
      owner: cwt.map.INACTIVE
    };

    for( var i=0; i<8; i++) cwt.map._players[i] = {
      team: cwt.map.INACTIVE,
      gold: 0
    };
  },

  weather: function(){
    return this._weather;
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
    if( id < 0 || this._units.length <= id ) throw Error("invalid id");

    var o = this._units[id];
    if( o.owner === cwt.map.INACTIVE ) return null; //throw Error("invalid id");

    return o;
  },

  unitByPos: function( x, y ){
    var unit;

    for( var i=0,e=this._units.length; i<e; i++ ){
      unit = this._units[i];
      if( unit.x === x && unit.y === y ) return unit;
    }

    return null;
  },

  unitIdByPos: function( x, y ){
    var unit;

    for( var i=0,e=this._units.length; i<e; i++ ){
      unit = this._units[i];
      if( unit.x === x && unit.y === y ) return i;
    }

    return null;
  },

  /**
   * Returns a player by its id.
   *
   * @param id
   */
  player: function(id){
    if( id < 0 || this._players.length <= id ) throw Error("invalid id");

    var o = this._players[id];
    if( o.team === cwt.map.INACTIVE ) return null; //throw Error("invalid id");

    return o;
  },

  /**
   * Returns a property by its id.
   *
   * @param id
   */
  property: function(id){
    if( id < 0 || this._properties.length <= id ) throw Error("invalid id");

    var o = this._properties[id];
    if( o.owner === cwt.map.INACTIVE ) return null; //throw Error("invalid id");

    return o;
  },

  propertyByPos: function( x, y ){
    var prop;

    for( var i=0,e=this._properties.length; i<e; i++ ){
      prop = this._properties[i];
      if( prop.x === x && prop.y === y ) return prop;
    }

    return null;
  },


  // ************************** Object selectors ****************************
  // ************************************************************************

  /**
   * Calls a function on the registered properties.
   */
  properties: function( selector, pid ){
    return this._collect( this._properties, pid, pt );
  },

  /**
   * Calls a function on the registered units.
   */
  units: function( cb, selector, pid ){
    return this._collect( this._units, pid, pt );
  },

  _collect: function( list, selector, pid ){
    var pt;
    var result = [];
    var hasSelector = arguments.length > 0;
    if( hasSelector ) pt = map.player(pid).team;

    for(var i=0,e=list.length; i<e; i++){

      // check inactivity and selector
      if( list[i].owner !== this.INACTIVE ){
        if( !hasSelector || selector( list[i], pid, pt) ){

          // add the unit to the result
          results[ results.length ] = list[i];
        }
      }
    }

    return result;
  },


  // ************************** Logic functions *****************************
  // ************************************************************************

  /**
   * Loads a map and initializes the game context.
   */
  loadMap: function( data ){

    // meta data
    this._width = data.width;
    this._height = data.height;

    // filler
    for( var x=0, e1=this._width; x<e1; x++ ){
      for( var y=0, e2=this._height; y<e2; y++ ){
        cwt.map._map[x][y] = data.filler;
      }
    }

    // special tiles
    cwt.util.each( data.data , function( col, x ){
      cwt.util.each( col , function( tile, y ){
        cwt.map._map[x][y] = tile;
      });
    });

    // players
    for( var i = 0, e = data.players.length; i<e; i++){
      var plD = data.players[i];

      this._players[i].gold = plD.gold;
      this._players[i].team = plD.team;
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
    }
    for( var i=data.units.length, e=this._units.length; i<e; i++){
      this._units[i].owner = this.INACTIVE;
    }

  }
};