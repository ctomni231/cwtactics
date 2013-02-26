/**
 * Contains the fog data map. A value 0 means a tile is not visible. A value
 * greater than 0 means it is visible for n units ( n = fog value of the tile ). 
 */
model.fogData = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, 0 );