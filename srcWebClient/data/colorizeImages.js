controller.colorizeImages = util.singleLazyCall(function( err, baton ){
  baton.take();

  var flow = jWorkflow.order(function(){
      if( DEBUG ) util.log("colorize images");
  });

  // units
  model.data_unitTypes.forEach(function(el){
    if( ! model.data_unitSheets[el].assets.gfx ) return;

    flow.andThen(function(){
      view.imageProcessor_colorizeUnit(el);
    });
  });

  // properties
  model.data_propertyTypes.forEach(function(el){
    if( ! model.data_tileSheets[el].assets.gfx ) return;

    flow.andThen(function(){
      view.imageProcessor_colorizeProperty(el);
    });
  });

  // tiles
  model.data_tileTypes.forEach(function(el){
    flow.andThen(function(){
      view.imageProcessor_colorizeTile(el);
    });
  });

  // tile variants
  model.data_tileTypes.forEach(function( el ){
    var obj = model.data_tileSheets[el];
    if( obj.assets.gfx_variants ){
      obj.assets.gfx_variants[1].forEach(function( sel ){
        flow.andThen(function(){
          view.imageProcessor_colorizeTile( sel[0] );
        });
      });
    }
  });

  flow.start(function(){
    if( DEBUG ) util.log("colorized images");
    baton.pass();
  });

});
