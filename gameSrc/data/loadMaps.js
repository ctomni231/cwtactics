controller.loadMaps_load_ = function(path,baton){
  baton.take();

  controller.storage_maps.exists(path,function(exits){
    if( !exits ){
      if( DEBUG ) util.log("going to cache map "+path);

      util.grabRemoteFile({
        path: model.data_assets.maps + "/" + path ,
        json: true,

        error: function( msg ){
          baton.pass();
        },

        success: function( resp ){
          controller.storage_maps.set(path,resp,function(){
            if( DEBUG ) util.log("cached map "+path);
          });
          baton.pass();
        }
      });
    }
    else baton.pass();
  })
};

controller.loadMaps_doIt = util.singleLazyCall(function( p,baton ){
  if( DEBUG ) util.log("loading maps");

  var flow = jWorkflow.order(
    function(){
      baton.take();
    })

  util.iterateListByFlow(flow,model.data_maps, function(data,b){
    controller.loadMaps_load_(this.list[this.i],b);
  });

  flow.start(function(){
    baton.pass();
  });

});