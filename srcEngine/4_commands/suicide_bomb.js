controller.unitAction({
  
  key:"explode",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.relationModes.NONE && mode !== model.relationModes.SAME_OBJECT ) return false;
    
    return data.source.unit.type.suicide;
  },
  
  invoke: function( data ){
    controller.sharedInvokement("destroyUnit_silent",[ 
      data.source.unitId 
    ]);
    
    controller.sharedInvokement("fireBombAt",[ 
      data.target.x, data.target.y,
      data.source.unit.type.suicide.range,
      model.ptToHp(data.source.unit.type.suicide.damage),
      data.source.unit.owner
    ]);
  }
  
});