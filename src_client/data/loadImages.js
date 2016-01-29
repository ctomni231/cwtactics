// Load error handler.
//
controller.loadImages_loadFailed_ = function( ){
  var msg = "could not load "+this.pickey_;
  if( DEBUG ) util.log(msg);
  assert(false,msg);
}

// Generic image loader.
//
controller.loadImages_loadSuccessful_ = function(){
  var mode    = this.mode_;
  var baton   = this.baton_;
  var key     = this.pickey_;

  if( this.saveIt_ ){
    controller.storage_assets.set(
      this.src,
      Base64Helper.canvasToBase64(this),
      controller.loadImages_pictureSaved_
    );
  }

  // delete temporary data in the image object... just to be safe :P
  delete this.pickey_;
  delete this.baton_;
  delete this.mode_;
  delete this.saveIt_;

  // check mode and save the image to the correct game image slot.
  switch( mode ){

    case "U": view.setUnitImageForType( this, key, view.IMAGE_CODE_IDLE, view.COLOR_RED ); break;
    case "P": view.setPropertyImageForType( this, key, view.COLOR_RED ); break;
    case "T": view.setTileImageForType( this, key ); break;
    case "M": view.setInfoImageForType( this, key ); break;

    // error!
    default: assert(false);
  }

  // go on with the next image
  baton.pass();
};

// Save success handler.
//
controller.loadImages_pictureSaved_ = function( obj ){
  if( DEBUG ) util.log("caching image",obj.key);
}

// Image loading process.
//
controller.loadImages_prepareImg_ = function(key,path,mode,baton){
  // append base path to the path
  path = model.data_assets.images + "/" + path;

  if( DEBUG ) util.log("searching image",path);

  var img = new Image();

  // insert some meta data
  img.pickey_ = key;
  img.baton_  = baton;
  img.mode_   = mode;
  img.saveIt_ = false;
  img.onerror = controller.loadImages_loadFailed_;
  img.onload  = controller.loadImages_loadSuccessful_;

  baton.take();
  controller.storage_assets.get(
    path,
    function( obj ){

      if( obj ){
        // load it from cache
        if( DEBUG ) util.log("load image",path,"from cache");

        controller.storage_assets.get( path, function( obj ){
          img.src = "data:image/png;base64,"+obj.value;
        });

      } else {
        // load it from remote path
        if( DEBUG ) util.log("load image",path,"from remote path");

        img.saveIt_ = true;
        img.src     = path;
      }
    }
  );
};

//
//
controller.loadImages_doIt = util.singleLazyCall(
  function( err, baton ){
    if( DEBUG ) util.log("loading modification images");

    baton.take();

    var flow = jWorkflow.order(function(){
    });

    // loading units
    util.iterateListByFlow(flow,model.data_unitTypes, function(data,baton){
      var obj = model.data_unitSheets[this.list[this.i]];
      if( obj.assets.gfx ) controller.loadImages_prepareImg_( this.list[this.i],obj.assets.gfx,"U",baton );
    });

    // loading tiles
    util.iterateListByFlow(flow,model.data_tileTypes, function(data,baton){
      var key = this.list[this.i];
      var obj = model.data_tileSheets[key];
      controller.loadImages_prepareImg_( key,obj.assets.gfx,"T",baton );

      if( obj.assets.gfxOverlay ) view.overlayImages[ key ] = true;
      if( obj.assets.animated === 1 || obj.assets.animated === 2 ){
        view.animatedTiles[ key ] = true;
      }
    });

    // loading properties
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.gfx ) controller.loadImages_prepareImg_( this.list[this.i],obj.assets.gfx,"P",baton );
    });

    // tile variants
    model.data_tileTypes.forEach(function( el ){
      var obj = model.data_tileSheets[el];
      if( obj.assets.gfx_variants ){
        var subFlow = jWorkflow.order(function(){})
        obj.assets.gfx_variants[1].forEach(function( sel ){
          subFlow.andThen(function(p,baton){
            controller.loadImages_prepareImg_( sel[0],sel[0],"T",baton );
          });
        });
        flow.andThen(subFlow);
      }
    });

    // loading cannon animations
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.fireAnimation ){
        controller.loadImages_prepareImg_(
          obj.assets.fireAnimation[0],
          obj.assets.fireAnimation[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.streamAnimation ){
        controller.loadImages_prepareImg_(
          obj.assets.streamAnimation[0],
          obj.assets.streamAnimation[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.chargeAnimation ){
        controller.loadImages_prepareImg_(
          obj.assets.chargeAnimation[0],
          obj.assets.chargeAnimation[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.fireAnimation2 ){
        controller.loadImages_prepareImg_(
          obj.assets.fireAnimation2[0],
          obj.assets.fireAnimation2[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.streamAnimation2 ){
        controller.loadImages_prepareImg_(
          obj.assets.streamAnimation2[0],
          obj.assets.streamAnimation2[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.chargeAnimation2 ){
        controller.loadImages_prepareImg_(
          obj.assets.chargeAnimation2[0],
          obj.assets.chargeAnimation2[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.fireAnimation3 ){
        controller.loadImages_prepareImg_(
          obj.assets.fireAnimation3[0],
          obj.assets.fireAnimation3[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.streamAnimation3 ){
        controller.loadImages_prepareImg_(
          obj.assets.streamAnimation3[0],
          obj.assets.streamAnimation3[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.chargeAnimation3 ){
        controller.loadImages_prepareImg_(
          obj.assets.chargeAnimation3[0],
          obj.assets.chargeAnimation3[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.fireAnimation4 ){
        controller.loadImages_prepareImg_(
          obj.assets.fireAnimation4[0],
          obj.assets.fireAnimation4[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.streamAnimation4 ){
        controller.loadImages_prepareImg_(
          obj.assets.streamAnimation4[0],
          obj.assets.streamAnimation4[0],
          "M",
          baton
        );
      }
    });
    util.iterateListByFlow(flow,model.data_propertyTypes, function(data,baton){
      var obj = model.data_tileSheets[this.list[this.i]];
      if( obj.assets.chargeAnimation4 ){
        controller.loadImages_prepareImg_(
          obj.assets.chargeAnimation4[0],
          obj.assets.chargeAnimation4[0],
          "M",
          baton
        );
      }
    });

    // menu background images
    util.iterateListByFlow(flow,model.data_menu.bgs, function(data,baton){
      controller.loadImages_prepareImg_( this.list[this.i],this.list[this.i],"M",baton );
    });

    // misc
    util.iterateListByFlow(flow,model.data_graphics.misc, function(data,baton){
      controller.loadImages_prepareImg_( this.list[this.i][0],this.list[this.i][1],"M",baton );
    });

    // start loading
    flow.start(function( e ){
      if( e && DEBUG ) util.log("could not load modification images");
      if(!e && DEBUG ) util.log("loaded all modification images");

      baton.pass();
    })
  }
);
