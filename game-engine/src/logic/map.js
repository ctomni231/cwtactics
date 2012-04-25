// ========================================================================
commandNode( Msg.CAPTURE,

  function( msg ){

    var prop = map.properties[ msg.pId ];
    var capturer = map.units[ msg.cId ];

    prop.capturePoints -= capturer;
    if( prop.capturePoints <= 0 ){
      messageContext.message({ cmd: Msg.PROPERTY_CAPTURED, pId: msg.pId, cId: msg.cId });

      // player loose
      if( prop.id === 'HQ' ) messageContext.message({ cmd: Msg.PLAYER_LOOSED, pId:prop.owner.id });

      prop.owner = capturer.owner;
      prop.capturePoints = 20;
    }
  },

  // validator
  {
    type:'object',
    properties:{
      pId: map.playerIdValidator,
      cId: map.unitIdValidator
    }
  }
);

// ========================================================================
commandNode( Msg.WAIT,

  function( msg ){

    // kick id from left actors
    for( var i=0,e=map.leftActors.length; i<e; i++ )
      if( map.leftActors[i] === msg.id ) map.leftActors[i] = null;
  },

  // validator
  {

  }
);

// ========================================================================
commandNode( Msg.LOAD_UNIT,

  function( msg ){
    // load it
    var trC = map.units[msg.tId].transport.loads.push( Unit.byId( msg.lId ) );
    // TODO calc weight
  },

  // validator
  {

  }
);

// ========================================================================
commandNode( Msg.UNLOAD_UNIT,

  function( msg ){
    var loads = map.units[msg.tId].transport.loads;

    // load it
    var trC = loads.splice( loads.indexOf( Unit.byId( msg.lId ) ), 1 );

    // TODO calc weight
  },

  // validator
  {

  }
);

// ========================================================================
commandNode( Msg.UNIT_DESTROYED,
  function( msg ){

  },

  // validator
  {

  }
);

// ========================================================================
commandNode( Msg.GAME_INIT,
  function( msg ){
    var data = msg.data;

    // recycle old data
    map.recycleAllPlayers();
    map.recycleAllProperties();
    map.recycleAllTransports();
    map.recycleAllUnits();

    // set map meta data
    map.height = data.height;
    map.width = data.width;

    // set up players
    for( var i=0,e=data.players.length; i<e; i++ ){
      map.players[i].name = data.players[i].name;
      map.players[i].team = data.players[i].team;
    }

    // update schemas
    map.xPositionValidator.maximum = data.height-1;
    map.yPositionValidator.maximum = data.width-1;
    map.playerIdValidator.maximum = data.players.length-1;

    // fill map with filler
    var l_filler = data.filler;
    for( var rX=0,eX=data.width; rX<eX; rX++){
      for( var rY=0,eY=data.height; rY<eY; rY++){
        map[rX][rY].id = l_filler;
      }
    }

    // set custom tiles
    var l_pos = {x:0,y:0};
    var l_map = map;
    data.tiles.forEach(function( tileDesc ){

      // get pos
      l_pos.x = tileDesc.x;
      l_pos.y = tileDesc.y;

      // correct position ?
      if( l_pos.x < 0 || l_pos.x >= data.width || l_pos.y < 0 || l_pos.y >= data.height ){
        throw Error("illegal position of the tile description "+JSON.stringify(tileDesc));
      }

      // set id
      l_map[l_pos.x][l_pos.y].id = tileDesc.id;

      // is a property
      var propOwn = tileDesc.owner;
      if( typeof propOwn !== 'undefined' ){

        var tile = l_map[l_pos.x][l_pos.y];
        var pId = map.receiveProperty();
        var prop = map.properties[ pId ];
        tile.prop = pId;

        // neutral ownership
        if( propOwn === -1 ) prop.owner = map.players.length-1;
        // pre owned
        else {
          validate( propOwn, map.playerIdValidator );
          prop.owner = propOwn;
        }

      }
    });
  },

  // validator
  {

  }
);