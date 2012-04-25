var sheets = {};

sheets.units = {};
sheets.moveTypes = {};
sheets.tiles = {};

sheets.parseUnitSheet = function( data ){

  validate( data, sheets.UnitSheet );

  // register
  sheets.units[ data.ID ] = data;
};

sheets.parseTileSheet = function( data ){

  validate( data, sheets.TileSheet );

  // register
  sheets.tiles[ data.ID ] = data;
};

sheets.parseMoveTypeSheet = function( data ){

  validate( data, sheets.MoveTypeSheet );

  // register
  sheets.moveTypes[ data.ID ] = data;
};