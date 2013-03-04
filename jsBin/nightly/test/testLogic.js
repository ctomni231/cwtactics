module("game engine logic", { setup: loadTestMap });

test("extractPlayerId", function(){
  is( model.extractPlayerId( model.players[0] ), 0 );
  is( model.extractPlayerId( model.players[1] ), 1 );
  is( model.extractPlayerId( model.players[2] ), 2 );
  
  throwsError( function(){
    model.extractPlayerId({});
  }, "illegal object throws an error" );
});

test("extractPropertyId", function(){
  is( model.extractPropertyId( model.propertyPosMap[2][1] ), 0 );
  is( model.extractPropertyId( model.properties[1] ), 1 );
  is( model.extractPropertyId( model.properties[199] ), 199, "object will be returned, even if unused" );
  
  throwsError( function(){
    model.extractPropertyId({});
  }, "illegal object throws an error" );
});

test("extractUnitId", function(){
  is( model.extractUnitId( model.unitPosMap[2][2] ), 0 );
  is( model.extractUnitId( model.units[2] ), 2 );
  is( model.extractUnitId( model.units[49] ), 49, "object will be returned, even if unused" );
  
  throwsError( function(){
    model.extractUnitId({});
  }, "illegal object throws an error" );
});

test("hasFreeUnitSlots", function(){
  ok( model.hasFreeUnitSlots(0) );
  ok( model.hasFreeUnitSlots(1) );
  ok( model.hasFreeUnitSlots(2) );
});

test("hasLoadedIds", function(){
  ok( !model.hasLoadedIds( model.extractUnitId( model.unitPosMap[5][3] ) ) );
});

test("isTransport", function(){
  ok( model.isTransport( model.extractUnitId( model.unitPosMap[5][3] ) ) );
  ok( !model.isTransport( model.extractUnitId( model.unitPosMap[2][2] ) ) );
});

test("isLoadedBy", function(){
  var trid = model.extractUnitId( model.unitPosMap[5][3] );
  
  ok( !model.hasLoadedIds( trid ), "APCR has no loads" );
  
  model.unitPosMap[4][3].loadedIn = trid;
  is( model.unitPosMap[4][3].loadedIn, trid, "hacky load unit" );
  
  ok( model.isLoadedBy( model.extractUnitId( model.unitPosMap[4][3] ), trid ), "LOAD is loaded by the APCR" );
});

test("loadUnitInto & unloadUnitFrom", function(){
  var trid = model.extractUnitId( model.unitPosMap[5][3] );
  var loid = model.extractUnitId( model.unitPosMap[4][3] );
  
  ok( !model.hasLoadedIds( trid ), "APCR has no loads" );
  
  model.loadUnitInto( loid, trid);

  notNull( model.unitPosMap[4][3], "LOAD remains on map because moving handles set position" );
  notNull( model.unitPosMap[5][3], "APCR remains on map" );
  
  ok( model.isLoadedBy( loid, trid ), "LOAD is loaded by the APCR" );
  
  model.unloadUnitFrom( loid, trid);
  
  ok( !model.isLoadedBy( loid, trid ), "LOAD is loaded by the APCR" );
});

test("isTurnOwner", function(){
  ok( model.isTurnOwner( 0 ) );
  ok( !model.isTurnOwner( 1 ) );
  ok( !model.isTurnOwner( 2 ) );
});

test("distance", function(){
  
  throwsError( model.distance(-1,-1,1,1) , "illegal position throws an error");
  throwsError( model.distance(1,1,-1,-1) , "illegal position throws an error");
  
  is( model.distance(1,1,1,1), 0, "(1,1) <-> (1,1) = 0" );
  
  is( model.distance(1,1,3,1), 2, "(1,1) <-> (1,3) = 2" );
  is( model.distance(1,1,1,3), 2, "(1,1) <-> (3,1) = 2" );
  
  is( model.distance(1,1,3,3), 4, "(1,1) <-> (3,3) = 4" );
});

test("alliedPlayers", function(){
  ok( model.alliedPlayers(0,0), "player 1 is allied with himself");
  ok( model.alliedPlayers(0,2), "player 1 and player 3 are allied");
  ok( !model.alliedPlayers(0,1), "player 1 and player 2 aren't allied");
});

test("enemyPlayers", function(){
  ok( !model.enemyPlayers(0,2), "player 1 and player 3 aren't enemies");
  ok( model.enemyPlayers(0,1), "player 1 and player 2 are enemies");
});

test("canAct", function(){
  unitByPosCanAct(2,2);
});

test("canLoad", function(){
  is( model.unitPosMap[5][3].type, "APCR", "APCR should be available" );
  is( model.unitPosMap[4][3].type, "INFT", "INFT should be available" );
  
  ok( 
    model.canLoad( model.extractUnitId( model.unitPosMap[4][3] ), model.extractUnitId( model.unitPosMap[5][3] ) ),
    "an APCR can load an INFT" 
  );
    
  ok( 
    !model.canLoad( model.extractUnitId( model.unitPosMap[2][2] ), model.extractUnitId( model.unitPosMap[5][3] ) ),
    "an APCR cannot load a TANK" 
  );
  
  throwsError( function(){
    model.canLoad( model.extractUnitId( model.unitPosMap[5][3] ), model.extractUnitId( model.unitPosMap[5][3] ) );
  }, "if a transporter tries to load itself then an error will be thrown" );
});

test("countProperties", function(){
  is( model.countProperties(0), 4, "player 1 has four properties" );
  is( model.countProperties(1), 3, "player 2 has three properties" );
  is( model.countProperties(2), 2, "player 3 has two properties" );
});

test("countUnits", function(){
  is( model.countUnits(0), 6, "player 1 has six units" );
  is( model.countUnits(1), 1, "player 2 has one units" );
  is( model.countUnits(2), 1, "player 3 has one units" );
});

test("moveCodeFromAtoB", function(){
  is( model.moveCodeFromAtoB(2,2,2,1), model.MOVE_CODE_UP );
  is( model.moveCodeFromAtoB(2,2,1,2), model.MOVE_CODE_LEFT );
  is( model.moveCodeFromAtoB(2,2,2,3), model.MOVE_CODE_DOWN );
  is( model.moveCodeFromAtoB(2,2,3,2), model.MOVE_CODE_RIGHT );
  
  throwsError( function(){
     model.moveCodeFromAtoB(2,2,3,3)
  }, "if the distance between both is greater then one then an error will be thrown" );
});

test("thereIsAnAlliedUnitAt", function(){
  ok( model.thereIsAnAlliedUnitAt(3,3,0) );
  ok( model.thereIsAnAlliedUnitAt(2,2,2) );
  ok( !model.thereIsAnAlliedUnitAt(2,2,1) );
});

test("thereIsAnEnemyUnitAt", function(){
  ok( !model.thereIsAnEnemyUnitAt(3,3,0) );
  ok( !model.thereIsAnEnemyUnitAt(2,2,2) );
  ok( model.thereIsAnEnemyUnitAt(2,2,1) );
});

test("thereIsAnOwnUnitAt", function(){
  ok( model.thereIsAnOwnUnitAt(3,3,2) );
  ok( model.thereIsAnOwnUnitAt(2,2,0) );
  ok( !model.thereIsAnOwnUnitAt(2,2,1) );
});

test("tileIsProperty", function(){
  ok( model.tileIsProperty(2,1) );
  ok( !model.tileIsProperty(0,0) );
});

test("tileOccupiedByUnit", function(){
  ok( false !== model.tileOccupiedByUnit(2,2) );
  ok( false === model.tileOccupiedByUnit(0,0) );
});