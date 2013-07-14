controller.unitAction({
  
  key:"hideUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.relationModes.NONE && mode !== model.relationModes.SAME_OBJECT ) return false;
    
    var unit = data.source.unit;
    if( !unit.type.stealth) return false;
    if( unit.hidden ) return false;
    
    return true;
  },
          
  invoke: function( data ){
    controller.sharedInvokement("hideUnit",[ data.source.unitId ]);
  }
  
});