cwt.Loading.create(function (loaderNext) {
  var stuff = [];

  // UNITS
  cwt.UnitSheet.types.forEach(function (type) {
    stuff.push(function(next){
      var obj = cwt.UnitSheet.sheets[type];
      cwt.Image.loadSprite(type, obj.assets.gfx, cwt.Image.TYPE_UNIT, next);
    });
  });

  // PROPERTIES
  cwt.PropertySheet.types.forEach(function (type) {
    stuff.push(function(next){
      var obj = cwt.PropertySheet.sheets[type];
      if( obj.assets.gfx ) {
        cwt.Image.loadSprite(type, obj.assets.gfx, cwt.Image.TYPE_PROPERTY, next);
      }
    });
  });

  // TILES
  cwt.TileSheet.types.forEach(function (type) {
    var obj = cwt.TileSheet.sheets[type];

    // BASE IMAGE
    stuff.push(function(next){
      cwt.Image.loadSprite( type,
        obj.assets.gfx,
        (obj.assets.animated === 1 || obj.assets.animated === 2)? cwt.Image.TYPE_IMAGE : cwt.Image.TYPE_ANIMATED_TILE,
        next
      );
    });

    // TILE VARIANTS
    if( obj.assets.gfx_variants ){
      obj.assets.gfx_variants[1].forEach(function( variant ){
        stuff.push(function(next){
          cwt.Image.loadSprite(variant[0], variant[0], cwt.Image.TYPE_TILE, next);
        });
      });
    }
  });

  // BACKGROUND IMAGES
  cwt.MenuData.bgs.forEach(function (bg) {
    stuff.push(function(next){
      cwt.Image.loadSprite(bg, bg, cwt.Image.TYPE_IMAGE, next);
    });
  });

  callAsSequence(stuff,function () {
    loaderNext();
  });

  /*
   cwt.UnitSheet.types.forEach(function (type) {
     stuff.push(function(next){
       var obj = cwt.PropertySheet.sheets[type];
     });
   });
   */

/*


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

      // misc
      util.iterateListByFlow(flow,model.data_graphics.misc, function(data,baton){
        controller.loadImages_prepareImg_( this.list[this.i][0],this.list[this.i][1],"M",baton );
      });
    }
  );
  */

});