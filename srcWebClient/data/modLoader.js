/**
 * 
 */
controller.loadModification =  util.singleLazyCall( function( err, baton ){
  if( err ){
    if( constants.DEBUG ) util.log("break at load modification due error from previous inits"); 
    return baton.pass(true);
  }
  
  if( constants.DEBUG ) util.log("loading modification");
  
  baton.take();
  
  // TRY TO GRAB DATA FROM STORAGE
  controller.storage.has("mod",function( exists ){
    
    // USE EXISTING DATA
    if( exists ){
      if( constants.DEBUG ) util.log("modification available, grab from storage");
      
      controller.storage.get("mod",function( obj ){
        try{
          var mod = obj.value;
          controller.stateMachine.event("start", mod );
          baton.pass(false);
        }
        catch( e ){
          controller.loadFault(e,baton);
        }
      });
    }
    // LOAD IT VIA REQUEST
    else{
      if( constants.DEBUG ) util.log("modification not available, grab default one");
      
      controller.storage.get("modificationPath",function( obj ){
        var modName = ( obj === null )? "awds.json" : obj.value;
        util.grabRemoteFile({
          path:"awds.json",
          json:true,
          error: function( msg ) { 
            controller.loadError = msg;
            baton.pass(true);
          }, 
          success: function( resp ) {
            if( constants.DEBUG ) util.log("modification grabbed, saving it");
            
            // SAVE GRABBED DATA
            controller.storage.set("mod",resp,function(){
              if( constants.DEBUG ) util.log("modification saved, next initializing engine");
              
              try{
                controller.stateMachine.event("start", resp );
                baton.pass(false);
              }
              catch( e ){
                controller.loadFault(e,baton);
              }
            });
          }
        });
      });
    }
  });
  
});