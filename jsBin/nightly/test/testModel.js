module( "loading data", { setup: loadTestMap } );

test( "mod loads without errors", function() {    
  hasKeys( model.sheets.unitSheets, "there are unit sheets" );
  hasKeys( model.sheets.unitSheets, "there are property sheets" );
});

test( "all test map unit types exists", function() {
  hasKey( model.sheets.unitSheets, "INFT" );
  hasKey( model.sheets.unitSheets, "APCR" );
  hasKey( model.sheets.unitSheets, "TANK" );
  hasKey( model.sheets.unitSheets, "RECN" );
});

test( "all test map tile/property types exists", function() {
  hasKey( model.sheets.tileSheets, "PLIN" );
  hasKey( model.sheets.tileSheets, "MNTN" );
  hasKey( model.sheets.tileSheets, "FRST" );
  hasKey( model.sheets.tileSheets, "CITY" );
  hasKey( model.sheets.tileSheets, "BASE" );
  hasKey( model.sheets.tileSheets, "SILO" );
  hasKey( model.sheets.tileSheets, "HQTR" );
});

test( "map metrics should be 10x10", function(){
  is( model.mapWidth, 10 );
  is( model.mapHeight, 10 );
});

test( "tiles should be set", function(){
  is( model.map[0][1], "PLIN" );
  is( model.map[0][2], "MNTN" );
  is( model.map[0][3], "FRST" );
});

test( "units should be on the map", function(){
  is( model.unitPosMap[2][2].type, "TANK" );
  is( model.unitPosMap[4][8].type, "RECN" );
  is( model.unitPosMap[6][3].type, "INFT" );
  is( model.unitPosMap[5][3].type, "APCR" );
  is( model.unitPosMap[4][3].type, "INFT" );
  is( model.unitPosMap[5][2].type, "INFT" );
  
  is( model.unitPosMap[8][8].type, "INFT" );
  
  is( model.unitPosMap[3][3].type, "INFT" );
});

test( "properties should be on the map", function(){
  is( model.propertyPosMap[2][1].type, "HQTR" );
  is( model.propertyPosMap[2][4].type, "BASE" );
  is( model.propertyPosMap[1][2].type, "BASE" );
  is( model.propertyPosMap[4][2].type, "SILO" );
  
  is( model.propertyPosMap[2][1].type, "HQTR" );
  is( model.propertyPosMap[2][4].type, "BASE" );
  is( model.propertyPosMap[1][2].type, "BASE" );
  
  is( model.propertyPosMap[3][5].type, "HQTR" );
  is( model.propertyPosMap[4][5].type, "BASE" );
});