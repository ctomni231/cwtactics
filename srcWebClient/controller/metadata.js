//
//
controller.metadata_TYPES = {
  SIZE_X:0,
  SIZE_Y:1,
  NUM_PROPERTIES:2,
  MAX_PLAYER:3
};

//
//
controller.metadata_grabFromMapData = function( mapData, type ){
  switch( type ){
      
      case controller.metadata_TYPES.SIZE_X:
        return mapData.mpw;
      
      case controller.metadata_TYPES.SIZE_Y:
        return mapData.mph;
      
      case controller.metadata_TYPES.NUM_PROPERTIES:
        return mapData.prps.length;
      
      case controller.metadata_TYPES.MAX_PLAYER:
        return mapData.player;
  }
  
  return -1;
};