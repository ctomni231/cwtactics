controller.scriptTags = {};

/**
 *
 */
controller.prepareTags = function( x,y, uid, fx,fy, fuid ){
  var tags = controller.scriptTags;
  
  if( tags.__oldUnit__ ) tags[ tags.__oldUnit__ ] = false;
  if( tags.__oldTile__ ) tags[ tags.__oldTile__ ] = false;
  
  tags.INDIRECT = false;
  tags.DIRECT = false;
  
  var unit = (uid > -1)? model.units[uid] : model.unitPosMap[x][y];
  if( unit ){
    tags.__oldUnit__ = unit.type.ID;
    tags[ tags.__oldUnit__ ] = true;
    
    if( model.isIndirectUnit( (uid > -1)? uid : model.extractUnitId(unit) ) ) tags.INDIRECT = true;
    else tags.DIRECT = true;
    
  }
  
  var tileTp = model.map[x][y].ID;
  var prop = model.propertyPosMap[x][y];
  if( prop ){
    tileTp = prop.type.ID;
  }
  
  tags.__oldTile__ = tileTp;
  tags[ tags.__oldTile__ ] = true;
  
  // FOCUS TILE GIVEN
  if( arguments.length > 3 ){
    
    tags.OTHER_INDIRECT = false;
    tags.OTHER_DIRECT = false;
    
    unit = (fuid > -1)? model.units[fuid] : model.unitPosMap[fx][fy];
    if( unit ){
      if( model.isIndirectUnit( (fuid > -1)? fuid : model.extractUnitId(unit) ) ) tags.OTHER_INDIRECT = true;
      else tags.OTHER_DIRECT = true;
    }
  }
};