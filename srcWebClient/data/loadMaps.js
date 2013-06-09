controller.mapList = [];

/**
 * 
 */
controller.loadMaps = util.singleLazyCall(function( err, masterbaton ){
  if( err ){
    if( DEBUG ) util.log("break at load maps due error from previous inits"); 
    return masterbaton.pass(true);
  }
  
  if( DEBUG ) util.log("loading maps");
  masterbaton.take();
  
  var cStep = 0;
  var maps = model.maps;
  
  function loadMap( pipe, baton ){
    
    // ERROR
    if( pipe === true ) return true;
    
    baton.take();
    
    var map = maps[cStep];
    controller.storage.get( map, function( obj ){
      
      // DOES NOT EXISTS
      if( obj === null ){
        util.grabRemoteFile({
          path:map,
          json:true,
          error: function( msg ){ 
            controller.loadError = msg;
            baton.pass(true);
          }, 
          success: function( response ){
            if( DEBUG ) util.log("map grabbed, saving as",map);
            
            // SAVE GRABBED DATA
            controller.storage.set( map , response, function(){
              cStep++;
              controller.mapList.push({name:response.name, key:map});
              baton.pass();
            });
          }
        });
      }
      // DOES EXISTS
      else{
        cStep++;
        controller.mapList.push({name:obj.value.name, key:map});
        baton.pass();
      }
    });
  }
  
  // CREAE WORKFLOW
  var workflow = jWorkflow.order(function(){
    if( DEBUG ) util.log("start loading maps");
  });
  
  // FILL STEPS
  for( var i=0,e=maps.length; i<e; i++ ) workflow.andThen(loadMap);
  
  // END WORKFLOW AND START IT
  workflow.andThen(function( pipe ){
    if( pipe === true ){
      if( DEBUG ) util.log("failed to load maps");
      masterbaton.pass(true);
    }
    else{
      if( DEBUG ) util.log("finished loading maps");
      masterbaton.pass(false);
    }
  }).start();
});