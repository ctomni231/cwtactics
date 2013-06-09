util.scoped(function(){
  var context;
  var isMobile = Browser.ios;
  
  function loadIt( /*key, src, cb*/ list,baton,callback ){
    var key = list[ list.curStep_ ].id;
    var src = list[ list.curStep_ ].src;
    var isMusic = list[ list.curStep_ ].music;
    var isCoMusic = list[ list.curStep_ ].co_music;
    
    // MOBILE DOES NOT USING CO SOUNDS
    if( isMobile && ( isCoMusic || isMusic ) ){
      util.log("ignoring co music because device has iOS");
      callback(list,baton);
      return;
    }
    
    // ITEM AVAILABLE IN STORAGE?
    controller.storage.has(key,function( exists ){
      
      // IF YES THEN LOAD IT FROM STORAGE
      if( exists ){
        if( DEBUG ) util.log(key,"is in storage");
        
        controller.storage.get(key,function( obj ){
          if( DEBUG ) util.log(key,"will be cached");
          
          try{
            var audioData = Base64Helper.decodeBuffer( obj.value );
            context.decodeAudioData( audioData, function(buffer) {
              controller.registerSoundFile(key,buffer);
              callback(list,baton);
            }, function( e ){ 
              controller.loadError = e;
              baton.pass(true);
            });
          }
          catch( e ){
            controller.loadError = e;
            baton.pass(true);
          }
        });
        
      }
      // ELSE LOAD IT VIA HTTP
      else{
        if( DEBUG ) util.log("load",key,"with HTTP request");
        
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "arraybuffer";
        request.onload = function(){
          
          if( this.status === 404 ){
            controller.loadError = "failed to load music file "+key;
            baton.pass(true);
            return;
          }
          
          var audioData = request.response;
          if( DEBUG ) util.log("saving",key,"in storage");
          
          controller.storage.set(key, Base64Helper.encodeBuffer(audioData), function(){
            if( DEBUG ) util.log("saved",key,"successfully in storage");
            
            context.decodeAudioData(audioData, function(buffer) {
              controller.registerSoundFile(key,buffer);
              callback(list,baton);
            }, function( e ){  
              controller.loadError = e;
              baton.pass(true);
            });
          });
        };
        
        request.send();
      }
    });
  }
  
  function loadDone(list,baton){
    if( list === true ){
      controller.loadError = "could not grab music";
      return baton.pass(true);
      return;
    }
    
    list.curStep_++;
    
    // IF FINISHED ALL ITEMS LIST OF THE LIST THEN RETURN LOCK
    if( list.curStep_ === list.length ){
      util.log("finished initializing audio system"); 
      baton.pass(false);
    }
    // ELSE LOAD ANOTHER ITEM
    else{
      asyncLoad(list,baton);
    }
  }
  
  function asyncLoad( list, baton ){
    loadIt(list,baton,loadDone);
  }
  
  /**
   * Loads all sound files from mod descriptor or from storage if the storage has a persitent representation of the 
   * sound files.
   */
  controller.loadSoundFiles = util.singleLazyCall(function( err, baton ){
    if( err ){
      if( DEBUG ) util.log("break at init audio system due error from previous inits"); 
      return baton.pass(true);
    }
    
    util.log("init audio system"); 
    
    context = controller.audioContext();
    if( context === null ) return false;
    
    baton.take();
    
    if( model.sounds.length > 0 ){
      
      // COPY 
      var sounds = []; 
      sounds.curStep_ = 0;
      for( var i=0,e=model.sounds.length; i<e; i++ ) sounds[i] = model.sounds[i];
      
      // START LOADING
      asyncLoad( sounds,baton );
    }
    else baton.pass(false);
  });
  
});