
cwt.defineLayer( CWT_LAYER_MODEL, function( model, util ){

  var maxH = CWT_MAX_MAP_HEIGHT;
  var maxW = CWT_MAX_MAP_WIDTH;

  /**
   * Map width in tiles.
   */
  model.mapWidth = 0;

  /**
   * Map height in tiles.
   */
  model.mapHeight = 0;

  /**
   * Map table that holds all known tiles.
   */
  model.map = util.matrix( maxW, maxH, null );

  /**
   * Unit positions are stored here.
   */
  model.unitPosMap = util.matrix( maxW, maxH, null );

  /**
   * Holds all unit objects of a game round.
   */
  model.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER,
    function(){
      return {
        x:0,
        y:0,
        type: null,
        fuel: 0,
        owner: CWT_INACTIVE_ID
      }
    });

  /**
   * Holds all player objects of a game round.
   */
  model.players = util.list( CWT_MAX_PLAYER+1,
    function( index ){
      var neutral = (index === CWT_MAX_PLAYER );
      return {
        gold: 0,
        team: ( neutral )? 9999 : CWT_INACTIVE_ID,
        name: ( neutral )? "NEUTRAL" : null
      }
    });
});

// ###########################################################################
// ###########################################################################

cwt.defineLayer( CWT_LAYER_DATA_ACCESS, function( data, model, sheets, util ){

  data.mapHeight = function(){
    return model.mapHeight;
  };

  data.mapWidth = function(){
    return model.mapWidth;
  };

  data.tileByPos = function( x,y ){
    return model.map[x][y];
  };

  /**
   * Returns an unit by its id.
   *
   * @param id
   */
  data.unitById = function(id){
    if( id < 0 || model.units.length < id ){
      util.logError("invalid unit id",id);
    }

    var o = model.units[id];
    return ( o.owner === CWT_INACTIVE_ID )? null : o;
  };

  /**
   * Returns an unit by its position.
   *
   * @param id
   */
  data.unitByPos = function( x, y ){
    return model.unitPosMap[x][y];
  };

  /**
   * Extracts the identical number from an unit object.
   *
   * @param unit
   */
  data.extractUnitId = function( unit ){
    if( unit === null ){
      util.logError("unit argument cannot be null");
    }

    var units = model.units;
    for( var i=0,e=units.length; i<e; i++ ){
      if( units[i] === unit ) return i;
    }

    // illegal unit object ?!
    util.logError("cannot find unit",util.objectToJSON(unit));
  };

  /**
   * Returns a player by its id.
   *
   * @param id
   */
  data.player = function(id){
    if( id < 0 || model.players.length <= id ){
      util.logError("invalid id");
    }

    var o = model.players[id];
    if( o.team === CWT_INACTIVE_ID ) return null;

    return o;
  };

  /**
   *
   * @param x
   * @param y
   */
  data.tileOccupiedByUnit = function( x,y ){
    var unit = data.unitByPos(x,y);
    if( unit === null ) return false;
    else{
      return data.extractUnitId( unit );
    }
  };

  /**
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   */
  data.distance = function( sx,sy,tx,ty ){
    var dx = Math.abs(sx-tx);
    var dy = Math.abs(sy-ty);
    return dx+dy;
  };

  /**
   *
   * @param uid
   */
  data.isTransport = function( uid ){
    return false // || api.transportRelation.hasOwnProperty( uid );
  };

  /**
   * Two objects which have the same owner.
   */
  data.RELATIONSHIP_SAME_OWNER = 0;

  /**
   * Two objects which have differnt of the same team.
   */
  data.RELATIONSHIP_ALLIED = 1;

  /**
   * Two objects which have differnt owners of different teams.
   */
  data.RELATIONSHIP_ENEMY = 2;

  /**
   * Two objects which have no relationship because one or both of them
   * hasn't an owner.
   */
  data.RELATIONSHIP_NONE = 3;

  /**
   * Returns the relationship between two player identicals.
   *
   * @param pidA player id or ownable object
   * @param pidB player id or ownable object
   */
  data.relationshipBetween = function( pidA, pidB ){
    if( pidA === null || pidB === null ){
      return data.RELATIONSHIP_NONE;
    }
    if( typeof pidA !== 'number' ) pidA = pidA.owner;
    if( typeof pidB !== 'number' ) pidB = pidB.owner;

    if( pidA === pidB ) return data.RELATIONSHIP_SAME_OWNER;
    else {
      var tidA = cwt.player( pidA );
      var tidB = cwt.player( pidB );
      if( tidA === tidB ){
        return data.RELATIONSHIP_ALLIED;
      }
      else return data.RELATIONSHIP_ENEMY;
    }
  };

  /**
   *
   * @param uid
   */
  data.eraseUnitPosition = function( uid ){
    data.setUnitPosition( uid );
  };

  /**
   *
   * @param uid
   * @param tx
   * @param ty
   */
  data.setUnitPosition = function( uid, tx, ty ){
    var unit = data.unitById(uid);
    var ox = unit.x;
    var oy = unit.y;
    var uPosMap = model.unitPosMap;

    // clear old position
    uPosMap[ox][oy] = null;

    // unit has a new position
    if( arguments.length > 1 ){
      unit.x = tx;
      unit.y = ty;

      uPosMap[tx][ty] = unit;
    }
  };

  /**
   *
   * @param uid
   */
  data.createTransporterId = function( uid ){
    // var tp = api.transportMapPool.request();
    // api.transportRelation[ uid ] = tp;
  };

  /**
   *
   * @param uid
   */
  data.destroyTransporterId = function( uid ){
    // var tp = api.transportRelation[ uid ];
    // api.transportMapPool( tp );
  };

  /**
   *
   * @param tid
   * @param lid
   */
  data.loadUnitIntoTransporter = function( tid, lid ){
    /* var trans = this.unitById( tid );
    this.eraseUnitPosition( lid );
    this.pushToTransport( tid, lid );
    this.setUnitPosition( tid, trans.x, trans.y ); */
  };

  /**
   *
   * @param tid
   * @param lid
   */
  data.pushToTransport = function( tid, lid ){
    /* var tpc = api.transportRelation[ tid ];
    if( tpc === undefined ) api.error("unit {0} is not a transporter",tid);
    tpc.loaded.push(lid); */
  };

  /**
   *
   * @param tid
   * @param lid
   * @param x
   * @param y
   */
  data.unloadUnitFromTransporter = function( tid, lid, x, y ){
    /* this.popFromTransport( tid, lid );
    this.setUnitPosition( lid, x, y ); */
  };

  /**
   * @param tid
   * @param lid
   */
  data.popFromTransport = function( tid, lid ){
    /* var tpc = this.transportRelation[ tid ];
    if( tpc === undefined ) this.error("unit {0} is not a transporter",tid);
    var index = tpc.loaded.indexOf( lid );
    if( index === -1 ) this.error("unit {0} is not in the transporter",lid);
    tpc.loaded.splice( index, 1 ); */
  };

  /**
   * Loads a map and initializes the game context.
   */
  data.loadMap = function( mapData ){
    if( util.DEBUG ){ util.logInfo("start loading map"); }

    // TODO map is data from outside, check it via shema

    // meta data
    model.mapWidth = mapData.width;
    model.mapHeight = mapData.height;

    // TODO this should be in map data possible
    // TODO too ( e.g. if map is the result of a save game )
    // this._day = 0;
    // this._activePlayer = 0;
    model.turnOwner = 0;

    // filler
    for( var x=0, e1= model.mapWidth; x<e1; x++ ){
      for( var y=0, e2= model.mapHeight; y<e2; y++ ){
        model.map[x][y] = mapData.filler;
      }
    }

    for( var x=0, e1= mapData.mapWidth; x<e1; x++ ){
      for( var y=0, e2= mapData.maxHeight; y<e2; y++ ){
        model.unitPosMap[x][y] = null;
      }
    }

    // special tiles
    var cols = Object.keys( mapData.data );
    for( var i=0,e=cols.length; i<e; i++ ){

      var x = parseInt(cols[i],10);
      var rows = Object.keys( mapData.data[ cols[i] ] );
      for( var j=0,f=rows.length; j<f; j++ ){

        var y = parseInt(rows[j],10);
        model.map[x][y] = mapData.data[ cols[i] ][ rows[j] ];
      }
    }

    for( var i=0, e= model.units.length; i<e; i++){
      model.units[i].owner = CWT_INACTIVE_ID;
    }

    // players
    for( var i = 0, e = mapData.players.length; i<e; i++){
      var s_player = mapData.players[i];
      var t_player = model.players[i];

      t_player.gold = s_player.gold;
      t_player.team = s_player.team;
      t_player.name = s_player.name;

      // units
      var startIndex = i*CWT_MAX_UNITS_PER_PLAYER;
      for( var j = 0, ej = s_player.units.length; j<ej; j++){
        var s_unit = s_player.units[j];
        var t_unit = model.units[ startIndex+j ];

        t_unit.fuel  = s_unit.fuel;
        t_unit.x     = s_unit.x;
        t_unit.y     = s_unit.y;
        t_unit.hp    = s_unit.hp;
        t_unit.ammo  = s_unit.ammo;
        t_unit.type  = s_unit.type;
        t_unit.owner = s_unit.owner;

        /*
        if( t_unit.type === "APC" ){
          cwt.createTransporterId( j );
        }
        */

        // TODO use identical
        model.unitPosMap[s_unit.x][s_unit.y] = t_unit;
      }
    }
    for( var i=mapData.players.length,e= model.players.length; i<e; i++){
      model.players[i].team = CWT_INACTIVE_ID;
    }

    // properties
    for( var i = 0, e = mapData.properties.length; i<e; i++){
      var s_property = mapData.properties[i];
      var t_property = model.properties[i];

      t_property.owner          = s_property.owner;
      t_property.capturePoints  = s_property.capturePoints;
      t_property.type           = s_property.type;
      t_property.x              = s_property.x;
      t_property.y              = s_property.y;

      // TODO use identical
      model.propertyPosMap[t_property.x][t_property.y] = t_property;
    }
    for( var i=mapData.properties.length,e=model.properties.length; i<e; i++){
      model.properties[i].owner = CWT_INACTIVE_ID;
    }

    // add actors
    var startIndex= model.turnOwner*CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex,
           e=   i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

      model.leftActors[i-startIndex] = ( data.unitById(i) !== null )? true : false;
    }

    if( util.DEBUG ){ util.logInfo("map successfully loaded"); }
  }
});