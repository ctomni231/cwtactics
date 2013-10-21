controller.loadImages = util.singleLazyCall(function( err, masterbaton ){
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
        .setUnitImageForType( this, key, .IMAGE_CODE_IDLE, .COLOR_RED );
        break;
        
      case "PROPERTY": 
        .setPropertyImageForType( this, key, .COLOR_RED );
        break;
        
      case "TILE": 
        .setTileImageForType( this, key );
        break;
        
      case "MISC": 
        .setInfoImageForType( this, key );
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
      .animatedTiles[ img.pickey_ ] = true;
    }
    // OVERLAYER ?
    else if( desc[2] === "OVERLAYER" ){
      .overlayImages[ img.pickey_ ] = true;
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
