// Loads all sound files from mod descriptor or from storage if the storage has
// a persistent representation of the sound files.
//
controller.loadAudio_doIt = util.scoped(function(){

  // The sound loading handler
  //
  function loadIt( data, baton ){
    var res;
    var music = false;

    switch( data.type ){

      // Generic Sounds
      //
      case 0:
        break;

      // Properties
      //
      case 1:
        break;

      // Units
      //
      case 2:
        break;

      // CO's
      //
      case 3:
        break;
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