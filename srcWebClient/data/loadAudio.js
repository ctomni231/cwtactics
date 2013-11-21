// Loads all sound files from mod descriptor or from storage if the storage has
// a persistent representation of the sound files.
//
controller.loadAudio_doIt = util.singleLazyCall(function(){

  // The sound loading handler
  //
  function loadIt( path, music, baton ){

    // some clients does not support playback of music files
    if( music && !controller.features_client.audioMusic ){
      if( DEBUG ) util.log("skip audio",path,", because client does not support music playback");
      return;
    }

    // don't reload already loaded audio
    if( controller.audio_isBuffered(path) ){
      if( DEBUG ) util.log("skip audio",path,", because already loaded it");
      return;
    }

    if( DEBUG ) util.log("loading audio",res);

    baton.take();
    controller.storage_assets.get(path,function( obj ){

      // not in the cache
      if( !obj ){
        if( DEBUG ) util.log(" ..is not in the cache");

        var request = new XMLHttpRequest();

        request.open("GET", model.data_assets.sounds+"/"+path, true);
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
          if( DEBUG ) util.log(" ..saving "+path);
          controller.storage.set( path, stringData, function(){
            controller.audio_loadByArrayBuffer(path,audioData,function(){
              baton.pass();
            });
          });
        };

        request.send();
      }
      // already in the cache
      else{
        if( DEBUG ) util.log(" ..is in the cache");

        controller.storage_assets.get(path,function( obj ){
          assert( obj.value );

          var audioData = Base64Helper.decodeBuffer( obj.value );
          controller.audio_loadByArrayBuffer(path,audioData,function(){
            baton.pass();
          });
        });
      }
    });
  }

  // public
  return util.singleLazyCall(
    function( err, baton ){
      if( !controller.features_client.audioSFX && !controller.features_client.audioMusic ){
        if( DEBUG ) util.log("client does not support audio system, skip init...");
        return;
      }

      if( DEBUG ) util.log("loading modification sounds");

      var context = controller.audio_grabContext();
      if( context ) return false;

      baton.take();

      var flow = jWorkflow.order(function(){
        return { i: 0, list: null };
      });

      // menu bg
      flow.andThen(function(data,baton){
        loadIt(model.data_menu.music, true, baton);
      });

      // sfx sounds
      util.iterateListByFlow(flow,Object.keys(model.data_sounds), function(data,baton){
        loadIt(data.list[data.i], false, baton);
      });

      // fractions
      util.iterateListByFlow(flow,Object.keys(model.data_fractionTypes), function(data,baton){
        loadIt(model.data_fractionSheets[this.list[this.i]].music, true, baton);
      });

      // COs
      util.iterateListByFlow(flow,Object.keys(model.data_coTypes), function(data,baton){
        loadIt(model.data_coSheets[this.list[this.i]].music, true, baton);
      });

      // cannon sounds
      util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
        var key = this.list[this.i];
        var obj = model.data_propertyTypes[key];
        if( obj.assets && obj.assets.fireSound ){
          loadIt(obj.assets.fireSound, false, baton);
        }
      });

      // TODO: optimize to prevent iterating same list twice

      // attack sounds (primary)
      util.iterateListByFlow(flow,model.data_unitTypes, function(data,baton){
        var key = this.list[this.i];
        var obj = model.data_unitSheets[key];
        if( obj.assets && obj.assets.pri_att_sound ){
          loadIt(obj.assets.pri_att_sound, false, baton);
        }
      });

      // attack sounds (secondary)
      util.iterateListByFlow(flow,model.data_unitTypes, function(data,baton){
        var key = this.list[this.i];
        var obj = model.data_tileSheets[key];
        if( obj.assets && obj.assets.sec_att_sound ){
          loadIt(obj.assets.sec_att_sound, false, baton);
        }
      });

      // start loading
      flow.start(function( e ){
        baton.pass();
      })
    }
  );
});