// Starts the data loading process of the client to load all
// modification assets.
//
controller.dataLoader_start = function( loadDescComponent, loadBarComponent ){
  assert( loadDescComponent && loadBarComponent );

  var SMALL_WAIT = 150;
  var BIG_WAIT = 500;

  if( DEBUG ) util.log("loading game data");

  jWorkflow.order()

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = "Loading";
      loadBarComponent.className = "loadBar_0"; })

    //.chill(SMALL_WAIT)

    // **1.A** check environment
    .andThen(controller.features_analyseClient)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadBarComponent.className = "loadBar_5"; })

    //.chill(SMALL_WAIT)

    // **1.B** show message when system isn't supported
    .andThen(function(p,b){
      if( !controller.features_client.supported ){
        b.take();
        if( confirm("Your system isn't supported by CW:T. Try to run it?") ) b.pass();
      }
    })

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadBarComponent.className = "loadBar_10"; })

    //.chill(SMALL_WAIT)

    // **2.** load correct storage system
    .andThen(controller.storage_initialize)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadBarComponent.className = "loadBar_15"; })

    //.chill(SMALL_WAIT)

    // **3.A** reset game data ?
    .andThen(function( err, baton ){
      if( err ) return err;
      baton.take();

      controller.storage_general.get("cwt_resetData",function( obj ){
        var  wipeOut = (obj && obj.value === true);
        if( !wipeOut ) wipeOut = getQueryParams(document.location.search).cwt_resetData === "1";

        if(  wipeOut ){
          if( DEBUG ) util.log("wipe out cached data");

          // NUKE STORAGE
          controller.storage_general.clear( function(){
            controller.storage_assets.clear( function(){
              controller.storage_maps.clear( function(){
                baton.pass(false);
              });
            });
          });
        }
        else baton.pass(false);
      });

    })

    // **3.B** force touch controls ?
    .andThen(function( err, baton ){
      if( err ) return err;
      baton.take();

      controller.storage_general.get("cwt_forceTouch",function( obj ){
        var  doIt = (obj && obj.value === true);
        if( !doIt ) doIt = getQueryParams(document.location.search).cwt_forceTouch === "1";

        if(  doIt ){
          if( DEBUG ) util.log("force to use touch controls");

          // enable touch and disable mouse ( cannot work together )
          controller.features_client.mouse = false;
          controller.features_client.touch = true;

          // mark forceTouch in the options
          controller.screenStateMachine.structure.OPTIONS.forceTouch = true;
        }

        baton.pass(false);
      });

    })
  
    // **3.C** animated tiles ?
    .andThen(function( err, baton ){
      if( err ) return err;
      baton.take();

      controller.storage_general.get("cwt_animatedTiles",function( obj ){        
        if( obj ){
          if( obj.value === true ) controller.screenStateMachine.structure.OPTIONS.animatedTiles = true;
          else                     controller.screenStateMachine.structure.OPTIONS.animatedTiles = false;
          
        } else if( getQueryParams(document.location.search).cwt_animatedTiles === "1" ){
          controller.screenStateMachine.structure.OPTIONS.animatedTiles = true;
        } else if( getQueryParams(document.location.search).cwt_animatedTiles === "0" ){
          controller.screenStateMachine.structure.OPTIONS.animatedTiles = false;
        }       
        
        baton.pass(false);
      });

    })

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadBarComponent.className = "loadBar_20"; })

    //.chill(SMALL_WAIT)

    // **4.** load modification
    .andThen(controller.modification_load)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.loadMaps");
      loadBarComponent.className = "loadBar_30"; })

    //.chill(SMALL_WAIT)

    // **5.** load maps
    .andThen(controller.loadMaps_doIt)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.loadImages");
      loadBarComponent.className = "loadBar_40"; })

    //.chill(SMALL_WAIT)

    // **6.A** load images
    .andThen(controller.loadImages_doIt)

    // **6.B** set custom background for this game instance
    .andThen(function(p,b){
      b.take();

      var el = model.data_menu.bgs[ parseInt( model.data_menu.bgs.length*Math.random(), 10 ) ];
      controller.storage_assets.get( model.data_assets.images + "/"+el,function( obj ){
        if( obj ){
          if( DEBUG ) util.log("set custom background to",el);
          controller.background_registerAsBackground( obj.value );
        }

        b.pass();
      });
    })

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.cropImages");
      loadBarComponent.className = "loadBar_60"; })

    //.chill(SMALL_WAIT)

    // **7.** crop images
    .andThen(controller.cutImages)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.colorizeImages");
      loadBarComponent.className = "loadBar_65"; })

    //.chill(SMALL_WAIT)

    // **8.** colorize images
    .andThen(controller.colorizeImages)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.loadSounds");
      loadBarComponent.className = "loadBar_70"; })

    //.chill(SMALL_WAIT)

    // **9.** load audio files
    .andThen(controller.audio_initialize)
    .andThen(controller.loadAudio_doIt)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.prepareInput");
      loadBarComponent.className = "loadBar_90"; })

    //.chill(SMALL_WAIT)

    // **10.** load input system
    .andThen(controller.loadInputDevices)

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.prepareInput");
      loadBarComponent.className = "loadBar_93"; })

    //.chill(SMALL_WAIT)

    // **11.** load custom input mappings
    .andThen(function(err, baton){
      baton.take();
      controller.loadKeyMapping(function(){
        baton.pass();
      });
    })

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.prepareLanguage");
      loadBarComponent.className = "loadBar_95"; })

    //.chill(SMALL_WAIT)

    // **12.** localize
    .andThen(function(){
      var els = document.querySelectorAll("[key]");
      for( var i=0,e=els.length; i<e; i++ ){
        els[i].innerHTML = model.data_localized( els[i].attributes.key.value );
      }
    })

    // -------------------------------------------------------------------------------------

    .andThen(function(){
      loadDescComponent.innerHTML = model.data_localized("loading.done");
      loadBarComponent.className = "loadBar_100"; })

    //.chill(SMALL_WAIT)

    // **13.** start client
    .andThen(function(){
      controller.screenStateMachine.event("complete");
    })

    // -------------------------------------------------------------------------------------

    .start(function(p){
      if( p ) assert(false,"data loader failed ("+p+")");
    });

};
