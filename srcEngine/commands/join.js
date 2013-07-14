controller.unitAction({
  
  key:"joinUnits",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.relationModes.NONE ) return false;
        
    // no merge of transporters with loads
    if( model.hasLoadedIds( data.source.unitId ) || model.hasLoadedIds( data.target.unitId ) ) return false;
    
    return ( data.source.unit.type === data.target.unit.type && data.target.unit.hp < 90 ); 
  },
  
  invoke: function( data ){
    controller.sharedInvokement("joinUnits",[ data.source.unitId, data.target.unitId ]);
  }
  
});