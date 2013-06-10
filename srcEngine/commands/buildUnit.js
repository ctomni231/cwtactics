controller.propertyAction({
  
  key:"buildUnit",  
  propertyAction: true,
  hasSubMenu: true,
  
  condition: function( data ){
    var uLimit = controller.configValue("unitLimit");
    if( uLimit && model.countUnits(model.turnOwner) >= uLimit ) return false;
        
    if( !model.hasFreeUnitSlots( model.turnOwner ) ) return false;
    
    var property = data.source.property;
    
    var unitTypes = model.listOfUnitTypes;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      if( model.isBuildableByFactory( property, unitTypes[i] ) ) return true;
    }
    
    return false;
  },
  
  prepareMenu: function( data ){
    var availGold = model.players[ model.turnOwner ].gold;
    var property = data.source.property;
    var unitTypes = model.listOfUnitTypes;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      var key = unitTypes[i];
      
      // ONLY ADD IF THE TYPE IS PRODUCE ABLE BY THE PROPERTY
      if( model.isBuildableByFactory( property, key ) ){
        data.menu.addEntry( key, availGold >= model.unitTypes[key].cost );
      }
    }
  },
  
  invoke: function( data ){
    model.buildUnit.callAsCommand( data.source.x, data.source.y, data.action.selectedSubEntry );
  }
  
});