controller.unitAction({
  
  key:"hideUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    var unit = data.source.unit;
    if( !unit.type.stealth) return false;
    if( unit.hidden ) return false;
    
    return true;
  },
          
  invoke: function( data ){
    model.hideUnit.callAsCommand( data.source.unitId ); 
  }
  
});