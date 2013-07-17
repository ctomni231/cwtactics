controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent);

controller.screenStateMachine.structure.LOAD.onenter = function(){
  this.data.openSection(ID_MENU_SECTION_LOAD);
  
  var workflow = jWorkflow.order(controller.isEnvironmentSupported)
    .andThen(controller.loadStorageController)
    .andThen(function( err, baton ){
      if( err ) return err;
      baton.take();
      
      controller.storage.get("resetDataAtStart",function( obj ){
        var  wipeOut = (obj !== null && obj.value);
        if( !wipeOut ) wipeOut = getQueryParams(document.location.search).wipeoutMod === "1";
        if(  wipeOut ){
          if( DEBUG ) util.log("wipe out cached data");
          
          // NUKE STORAGE
          controller.storage.clear( function(){
            baton.pass(false); 
          });
        }
        else baton.pass(false);
      });
      
    })
    .andThen(controller.loadModification)
    .andThen(controller.loadMaps)
    .andThen(controller.loadImages)
    .andThen(controller.cutImages)
    .andThen(controller.colorizeImages)
    .andThen(controller.loadSoundFiles)
    .andThen(controller.loadInputDevices)
    .andThen(function(){ 
      controller.screenStateMachine.event("complete"); 
    })
    .start();
};

controller.screenStateMachine.structure.LOAD.complete = function(){
  return "MOBILE";
};

controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine;