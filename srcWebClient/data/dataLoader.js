controller.startLoadingProcess = function( loadDescComponent, loadBarComponent ){
if( constants.DEBUG ) util.log("loading game assets");
  
  jWorkflow.order()

  // -------------------------------------------------------------------------------------

  .andThen(function(){ 
    loadDescComponent.innerHTML = "Loading";
    loadBarComponent.className = "loadBar_0"; })
    
  .chill(150)

  // **1.A** check environment
  .andThen(controller.calculateEnvironmentFeatures)
  
  // -------------------------------------------------------------------------------------

  .andThen(function(){  
    loadBarComponent.className = "loadBar_5"; })

  .chill(150)

  // **1.B** show message when system isn't supported
  .andThen(function(p,b){
    if( !controller.clientFeatures.supported ){
      b.take();
      if( confirm("Your system isn't supported by CW:T. Try to run it?") ) b.pass();
    }
  })

  // -------------------------------------------------------------------------------------

  .andThen(function(){  
    loadBarComponent.className = "loadBar_10"; })

  .chill(150)

  // **2.** load correct storage system
  .andThen(controller.loadStorageController)

  // -------------------------------------------------------------------------------------

  .andThen(function(){  
    loadBarComponent.className = "loadBar_15"; })
  
  .chill(150)

  // **3.** check environment
  .andThen(function( err, baton ){
    if( err ) return err;
    baton.take();
    
    controller.storage.get("resetDataAtStart",function( obj ){
      var  wipeOut = (obj !== null && obj.value);
      
      if( !wipeOut ) wipeOut = getQueryParams(document.location.search).wipeoutMod === "1";
      if(  wipeOut ){
        if( constants.DEBUG ) util.log("wipe out cached data");
        
        // NUKE STORAGE
        controller.storage.clear( function(){
          baton.pass(false); 
        });
      }
      else baton.pass(false);
    });
    
  })

  // -------------------------------------------------------------------------------------

  .andThen(function(){
    loadBarComponent.className = "loadBar_20"; })
  
  .chill(150)

  // **4.** check environment
  .andThen(controller.loadModification)

  // -------------------------------------------------------------------------------------

  .andThen(function(){  
    loadDescComponent.innerHTML = model.localized("loading.loadMaps");
    loadBarComponent.className = "loadBar_30"; })
  
  .chill(150)

  // **5.** check environment
  .andThen(controller.loadMaps)

  // -------------------------------------------------------------------------------------

  .andThen(function(){   
    loadDescComponent.innerHTML = model.localized("loading.loadImages");
    loadBarComponent.className = "loadBar_40"; })
  
  .chill(150)

  // **6.** check environment
  .andThen(controller.loadImages)

  // -------------------------------------------------------------------------------------

  .andThen(function(){   
    loadDescComponent.innerHTML = model.localized("loading.cropImages");
    loadBarComponent.className = "loadBar_60"; })
  
  .chill(150)

  // **7.** check environment
  .andThen(controller.cutImages)

  // -------------------------------------------------------------------------------------

  .andThen(function(){   
    loadDescComponent.innerHTML = model.localized("loading.colorizeImages");
    loadBarComponent.className = "loadBar_65"; })

  .chill(150)

  // **8.** check environment
  .andThen(controller.colorizeImages)

  // -------------------------------------------------------------------------------------

  .andThen(function(){   
    loadDescComponent.innerHTML = model.localized("loading.loadSounds");
    loadBarComponent.className = "loadBar_70"; })
  
  .chill(150)

  // **9.** check environment
  .andThen(controller.loadSoundFiles)

  // -------------------------------------------------------------------------------------

  .andThen(function(){    
    loadDescComponent.innerHTML = model.localized("loading.prepareInput");
    loadBarComponent.className = "loadBar_90"; })
  
  .chill(150)

  // **10.** check environment
  .andThen(controller.loadInputDevices)

  // -------------------------------------------------------------------------------------

  .andThen(function(){
    loadDescComponent.innerHTML = model.localized("loading.prepareInput");
    loadBarComponent.className = "loadBar_93"; })

  .chill(150)

  // **10.** check environment
  .andThen(function(err, baton){
    baton.take();
    controller.loadKeyMapping(function(){
      baton.pass();
    });
  })

  // -------------------------------------------------------------------------------------

  .andThen(function(){    
    loadDescComponent.innerHTML = model.localized("loading.prepareLanguage");
    loadBarComponent.className = "loadBar_95"; })

  .chill(150)

  // **11.** localize
  .andThen(function(){
    var els = document.querySelectorAll("[key]");
    for( var i=0,e=els.length; i<e; i++ ){
      els[i].innerHTML = model.localized( els[i].attributes.key.value );
    }
  })

  // -------------------------------------------------------------------------------------

  .andThen(function(){    
    loadDescComponent.innerHTML = model.localized("loading.done");
    loadBarComponent.className = "loadBar_100"; })

  .chill(500)

  // **12.** start client 
  .andThen(function(){ 
    controller.screenStateMachine.event("complete"); 
  })

  // -------------------------------------------------------------------------------------
  
  .start(function(p){
    if( p ) model.criticalError( constants.error.CLIENT_ERROR, constants.error.CLIENT_LOAD_ERROR );
  });

};
