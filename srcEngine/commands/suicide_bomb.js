controller.unitAction({
  
  key:"explode",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    return data.source.unit.type.suicide;
  },
  
  invoke: function( data ){
    model.destroyUnit_silent.callAsCommand( data.source.unitId );
    model.fireBombAt.callAsCommand(
      data.target.x, 
      data.target.y,
      data.source.unit.type.suicide.range,
      model.ptToHp(data.source.unit.type.suicide.damage),
      data.source.unit.owner
    );    
  }
  
});