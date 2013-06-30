controller.unitAction({
  
  key:"joinUnits",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_OWN ) return false;
        
    // NO LOAD MERGE
    if( model.hasLoadedIds( data.source.unitId ) || model.hasLoadedIds( data.target.unitId ) ) return false;
    
    return ( data.source.unit.type === data.target.unit.type && data.target.unit.hp < 90 ); 
  },
  
  invoke: function( data ){
    model.joinUnits.callAsCommand( data.source.unitId, data.target.unitId );
  }
  
});