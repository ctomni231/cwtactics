//
//
controller.loadImages_doIt = util.scoped(function(){

  // The sound loading handler
  //
  function loadIt( data, baton ){
    var res;
    var music = false;

    switch( data.type ){

      default: assert(false);
    }

    // some clients does not support playback of music files
    if( music && !controller.features_client.audioMusic ){
      if( DEBUG ) util.log("skip audio",res,", because client does not support music playback");
      return;
    }

    if( DEBUG ) util.log("loading audio",res);

    baton.take();
    controller.storage_assets.get(res,function( obj ){

      // not in the cache
      if( !obj ){
        if( DEBUG ) util.log(" ..is not in the cache");

        var request = new XMLHttpRequest();

        request.open("GET", res, true);
        request.responseType = "arraybuffer";
        request.onload       = function(){

          // is the requested resource not available?
          if( this.status === 404 ){
            baton.pass();
            return;
          }

          var audioData  = request.response;

          // stringify buffer
          var stringData = Base64Helper.encodeBuffer(audioData);

          // save it in the storage
          if( DEBUG ) util.log(" ..saving "+res);
          controller.storage.set( res, stringData, function(){
            controller.audio_loadByArrayBuffer(res,audioData,function(){
              baton.pass();
            });
          });
        };

        request.send();
      }
      // already in the cache
      else{
        if( DEBUG ) util.log(" ..is in the cache");

        controller.storage_assets.get(res,function( obj ){
          assert( obj.value );

          var audioData = Base64Helper.decodeBuffer( obj.value );
          controller.audio_loadByArrayBuffer(res,audioData,function(){
            baton.pass();
          });
        });
      }
    });
  }

  // Loads a list by the sound loading handler
  //
  function loadList( flow, list, tp ){

    // prepare loading
    flow.andThen(function(data,b){
      data.i    = 0;
      data.list = list;
      data.type = tp;
    });

    // load elements
    for( var i=0,e=list.length; i<e; i++ ){
      flow.andThen(loadIt);
    }

    // check some things
    flow.andThen(function(data){
      assert(list   === data.list);
      assert(data.i === data.list.length);
    });
  };

  // public
  return util.singleLazyCall(
    function( err, baton ){
      if( !controller.features_client.audioSFX && !controller.features_client.audioMusic ){
        if( DEBUG ) util.log("client does not support audio system, skip init...");
        return;
      }

      if( DEBUG ) util.log("initialize audio system");

      var context = controller.audio_grabContext();
      if( context ) return false;

      baton.take();

      var flow = jWorkflow.order(function(){
        return {
          i:         0,
          list:      null,
          basePath:  model.data_assets.sound
        };
      });

      // prepare flow structure
      loadList(flow,model.data_sounds,        0);
      loadList(flow,model.listOfPropertyTypes,1);
      loadList(flow,model.listOfUnitTypes,    2);

      // start loading
      flow.start(function( e ){
        baton.pass();
      })
    }
  );
});










controller.loadImages_doIt = util.singleLazyCall(function( err, masterbaton ){
  if( err ){
    if( constants.DEBUG ) util.log("break at load images due error from previous inits"); 
    return masterbaton.pass(true);
  }
  
  masterbaton.take();
  
  // TODO MOVE HOOKS INTO SCOPE VARIABLES
  var i,e;
  
  function pictureSavedMsg( obj ){
    if( constants.DEBUG ) util.log("saved image type",obj.key);
  }
  
  function insertPicture(){
    var mode = this.mode_;
    var baton = this.baton_;
    var list = this.list_;
    var key = this.pickey_;
    var saveIt = this.saveIt_;
    
    if( saveIt ){
      controller.storage.set( key,Base64Helper.canvasToBase64(this), pictureSavedMsg);
    }
    
    //if( DEBUG ) util.log("finished loading image type",key);
    
    // CLEAN IMAGE OBJECT
    delete this.pickey_;
    delete this.baton_;
    delete this.list_;
    delete this.mode_;
    delete this.saveIt_;
    
    // CHECK MODE
    switch( mode ){
        
      case "UNIT":
        view.setUnitImageForType( this, key, view.IMAGE_CODE_IDLE, view.COLOR_RED );
        break;
        
      case "PROPERTY":
        view.setPropertyImageForType( this, key, view.COLOR_RED );
        break;
        
      case "TILE":
        view.setTileImageForType( this, key );
        break;
        
      case "MISC":
        view.setInfoImageForType( this, key );
        break;
        
      default: util.raiseError("unknown mode key",mode);
    }
    
    if( list.curStep_ === list.length ){
      worklistStep++;
      if( worklistStep < worklist.length ) list = worklist[worklistStep];
      else list = null;
    }
    
    baton.pass(list);
  }
  
  function loadListPicture( list, baton ){
    
    // ERROR 
    if( list === true ) baton.pass(true);
      
    baton.take();
    
    if( list.curStep_ === list.length ) util.raiseError("illegal index");
    var desc = list[list.curStep_];
    list.curStep_++;
    
    img = new Image();
    
    // INSERT META DATA
    img.pickey_ = desc[0];
    img.baton_  = baton;
    img.mode_   = list.mode_;
    img.list_   = list;
    img.saveIt_ = false;
    img.onerror = function(){
      controller.loadFault({ message:"could not load image "+img.pickey_ , stack:null },baton);
    };
    
    // ANIMATED ?
    if( desc[2] === "ANIMATED" ){
      view.animatedTiles[ img.pickey_ ] = true;
    }
    // OVERLAYER ?
    else if( desc[2] === "OVERLAYER" ){
      view.overlayImages[ img.pickey_ ] = true;
    }
      
      controller.storage.has( desc[0], function( exists ){
        
        // IMAGE EXISTS IN THE STORAGE
        if( exists ){
          // if( DEBUG ) util.log("try loading image",desc[0],"from storage");
          
          controller.storage.get( desc[0], function( obj ){
            img.onload  = insertPicture;
            img.src = "data:image/png;base64,"+obj.value;
          });
        }
        // IMAGE NEEDS TO BE LOADED
        else{
          // if( DEBUG ) util.log("try loading image",desc[0],"from remote server");
          
          img.saveIt_ = true;
          img.onload  = insertPicture;
          img.src     = desc[1];
        }
      });
  }
  
  // PREPARE LISTS
  var imageData = model.graphics;
  imageData.units.curStep_ = 0;
  imageData.units.mode_ = "UNIT";
  imageData.properties.curStep_ = 0;
  imageData.properties.mode_ = "PROPERTY";
  imageData.tiles.curStep_ = 0;
  imageData.tiles.mode_ = "TILE";
  imageData.misc.curStep_ = 0;
  imageData.misc.mode_ = "MISC";
  
  var worklistStep = 0;
  var worklist = [ imageData.units, imageData.properties, imageData.tiles, imageData.misc ];
  
  // CREAE WORKFLOW
  var workflow = jWorkflow.order(function(){
    if( constants.DEBUG ) util.log("start loading images");
    return worklist[0];
  });
  
  // FILL STEPS
  for( i=0,e=imageData.units.length; i<e; i++ )       workflow.andThen(loadListPicture);
  for( i=0,e=imageData.properties.length; i<e; i++ )  workflow.andThen(loadListPicture);
  for( i=0,e=imageData.tiles.length; i<e; i++ )       workflow.andThen(loadListPicture);
  for( i=0,e=imageData.misc.length; i<e; i++ )        workflow.andThen(loadListPicture);
  
  // END WORKFLOW AND START IT
  workflow.andThen(function( pipe ){
    if( pipe === true ){
      if( constants.DEBUG ) util.log("failed to load images");
      masterbaton.pass(true);
    }
    else{
      if( constants.DEBUG ) util.log("finished loading images");
      masterbaton.pass(false);
    }
  }).start(); 
});
