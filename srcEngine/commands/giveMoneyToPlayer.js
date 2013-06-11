util.scoped(function(){
  
  var steps = [500,1000,2500,5000,10000,25000,50000];
  
  controller.mapAction({
    
    key:"transferMoney",
    hasSubMenu: true,
    
    condition: function( data ){
      var plid = model.turnOwner;
      var ref;
      
      if( model.players[ plid ].gold < steps[0] ) return false;
      
      // CHECK UNIT
      ref = data.target.unit;
      if( ref === null || ref.owner === plid ){
        
        // CHECK PROPERTY
        ref = data.target.property;
        if( ref !== null && ref.owner !== plid && ref.owner !== -1 ){
          return true;
        }
        
        return false;
      }
      
      return true;
    },
    
    prepareMenu: function( data ){
      var availGold = model.players[ model.turnOwner ].gold;
      
      for( var i=0,e=steps.length; i<e; i++ ){
        if( availGold >= steps[i] ) data.menu.addEntry( steps[i] );
      }
    },
    
    invoke: function( data ){
      var owner = (data.target.property !== null)? data.target.property.owner : data.target.unit.owner;
      model.transferMoney.callAsCommand( model.turnOwner, owner, data.action.selectedSubEntry );
    }
    
  });
  
});