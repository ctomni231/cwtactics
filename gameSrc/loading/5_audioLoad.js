cwt.Loading.create(function (next) {

  // skip loading when audio is not available
  if( !cwt.ClientFeatures.audioSFX && !cwt.ClientFeatures.audioMusic ){
    return;
  }

  var loadFile = function( path, music, baton, loadIt ){

    // some clients does not support playback of music files
    if( music && !controller.features_client.audioMusic ){
      if( this.DEBUG ) util.log("skip audio",path,", because client does not support music playback");
      return;
    }

    // don't reload already loaded audio
    if( controller.audio_isBuffered(path) ){
      if( this.DEBUG ) util.log("skip audio",path,", because already loaded it");
      return;
    }

    if( this.DEBUG ) util.log("loading audio",path);

    baton.take();
    controller.storage_assets.get(path,function( obj ){

      // not in the cache
      if( !obj ){
        if( this.DEBUG ) util.log(" ..is not in the cache");

        var request = new XMLHttpRequest();

        request.open("GET", ( (music)? model.data_assets.music :
          model.data_assets.sounds ) +"/"+path, true);
        request.responseType = "arraybuffer";
        request.onload       = function(){

          // is the requested resource not available?
          if( this.status === 404 ){
            if( this.DEBUG ) util.log(" ..could not find",path);
            baton.pass();
            return;
          }

          var audioData  = request.response;

          // stringify buffer
          var stringData = Base64Helper.encodeBuffer(audioData);

          // save it in the storage
          if( this.DEBUG ) util.log(" ..saving",path);
          controller.storage_assets.set( path, stringData, function(){

            if( loadIt ){
              if( this.DEBUG ) util.log("loading it directly into the cache");
              controller.audio_loadByArrayBuffer(path,audioData,function(){
                baton.pass();
              });
            }
            else baton.pass();
          });
        };

        request.send();
      }
      // already in the cache
      else{
        if( this.DEBUG ) util.log(" ..is in the cache");

        if( loadIt ){
          if( this.DEBUG ) util.log("loading it directly into the cache");
          controller.storage_assets.get(path,function( obj ){
            cwt.assert( obj.value );

            var audioData = Base64Helper.decodeBuffer( obj.value );

            controller.audio_loadByArrayBuffer(path,audioData,function(){
              baton.pass();
            });
          });
        }
        else baton.pass();
      }
    });
  };

  var context = controller.audio_grabContext();
  if( !context ) return;


  if( controller.features_client.audioMusic ){

    // menu bg
    flow.andThen(function(data,b){
      controller.loadAudio_loadIt_(
        model.data_menu.music,
        true,
        b,
        true
      );
    });

    // fractions
    util.iterateListByFlow(flow,model.data_fractionTypes, function(data,b){
      controller.loadAudio_loadIt_(
        model.data_fractionSheets[this.list[this.i]].music,
        true,
        b
      );
    });

    // COs
    util.iterateListByFlow(flow,model.data_coTypes, function(data,b){
      controller.loadAudio_loadIt_(
        model.data_coSheets[this.list[this.i]].music,
        true,
        b
      );
    });
  }

  if( controller.features_client.audioSFX ){

    // sfx sounds
    var list = Object.keys(model.data_sounds);
    var tlist = [];
    for( var li = 0; li<list.length; li++) tlist.push( model.data_sounds[list[li]] );
    util.iterateListByFlow(flow, tlist, function(data,b){
      controller.loadAudio_loadIt_(this.list[this.i], false, b, true);
    });

    // cannon sounds
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,b){
      var key = this.list[this.i];
      var obj = model.data_tileSheets[key];
      if( obj.assets && obj.assets.fireSound ){
        controller.loadAudio_loadIt_(obj.assets.fireSound, false, b, true);
      }
    });

    // TODO: optimize to prevent iterating same list twice

    // attack sounds (primary)
    util.iterateListByFlow(flow,model.data_unitTypes, function(data,b){
      var key = this.list[this.i];
      var obj = model.data_unitSheets[key];
      if( obj.assets && obj.assets.pri_att_sound ){
        controller.loadAudio_loadIt_(obj.assets.pri_att_sound, false, b, true);
      }
    });

    // attack sounds (secondary)
    util.iterateListByFlow(flow,model.data_unitTypes, function(data,b){
      var key = this.list[this.i];
      var obj = model.data_unitSheets[key];
      if( obj.assets && obj.assets.sec_att_sound ){
        controller.loadAudio_loadIt_(obj.assets.sec_att_sound, false, b, true);
      }
    });
  }

  // start loading
  flow.start(function(){
    if( this.DEBUG ) util.log("loaded modification sounds");
    baton.pass();
  });
});