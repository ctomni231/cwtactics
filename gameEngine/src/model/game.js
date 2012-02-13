var cwtModel = {};
require.js(function(){
  cwtModel.game = {

    /**
     * map instance.
     * @type {Array.<Array.<object>>}
     */
    map: nekoUtilies.collection.maxtrix(MAX_MAP_LENGTH),

    /** map height */
    height: 0,

    /** map width */
    width: 0,

    players: [],
    activePlayer: -1,

    /** day number, ticks every time the activePlayer will be zero (means all players has acted) */
    day: 0,

    /** turn number */
    turn: 0,

    /** array with the units, that can attack or move this turn */
    leftActors: []
  };

  /**
   * loads a map by a JSON data object and initializes the cwtModel.game properties.
   *
   * @param mapData
   */
  cwtModel.loadMap = function( mapData ){
    if( DEBUG ) cwtLog.info("loading map {0}",mapData.name);

    // SET METADATA
    cwtModel.game.height = data.height;
    cwtModel.game.width = data.width;
    cwtModel.game.day = 0;
    cwtModel.game.turn = 0;
    cwtModel.game.leftActors.clear();

    //@todo ITERATE THROUGH cwtModel.game.map AND LOOK THEN INTO mapData
    // SET ALL TILE TYPES
    var l_filler = data.filler;
    //..
    var l_pos = {x:0,y:0};
    var l_map = cwtModel.game.map;
    data.tiles.forEach(function( tileDesc ){

      l_pos.x = tileDesc.x;
      l_pos.y = tileDesc.y;

      if( DEBUG ) amanda.validate( l_pos , cwtModel.Schema.Position );

      l_map[l_pos.x][l_pos.y] = tileDesc.id;
    });

    if( DEBUG ) cwtLog.info("loading map complete");
  }

  /**
   * Returns the distance of two objects
   *
   * @param {property|tile|unit} o1
   * @param {property|tile|unit} o2
   */
  cwtModel.distance = function( o1, o2 ){

  }


  /**
   * @namespace
   */
  cwtModel.Schema = {};

  cwtModel.Schema.Position = {
    properties:{
      //@TODO FIX MAXIMUM
      x: { format:'int', minimum:0, maximum:( -1) },
      y: { format:'int', minimum:0, maximum:( -1) }
    }
  };

  cwtModel.Schema.Unit = {
    type:'object',
    properties:{
      ammo :{minimum:0, maximum:0},
      fuel :{minimum:0},
      hp   :{minimum:0, maximum:99},
      exp  :{minimum:0}
    }
  };

  cwtModel.Schema.Property = {
    type:'object',
    properties:{
      capturePoints: {minimum:0},
      owner: { }
    }
  };

  cwtModel.Schema.Player = {
    type:'object',
    properties:{
      name:{ },
      gold:{ minimum:0 }
    }
  }

  if( DEBUG ) cwtEvent.on("debug_printStatus", function(){

    var l_model = cwtModel;

    cwtLog.info("==Map==");
    cwtLog.info("Tiledata:"+l_model.map);
    cwtLog.info("Units:"+l_model.units);
    cwtLog.info("Map-Width:"+l_model.width);
    cwtLog.info("Map-Height:"+l_model.height);
    cwtLog.info("Property:"+l_model.properties);

    cwtLog.info("==Game Round==");
    cwtLog.info("Day:"+l_model.day);
    cwtLog.info("Turn:"+l_model.turn);
    cwtLog.info("Active Player:"+l_model.activePlayerID);
    cwtLog.info("Left Actors:"+l_model.leftActors);
  });
});