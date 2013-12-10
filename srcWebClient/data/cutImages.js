controller.cutImages = util.singleLazyCall(function( err, baton ){

  
  baton.take();

  var flow = jWorkflow.order(function(){
    if( DEBUG ) util.log("crop images");
  });

  // units
  model.data_unitTypes.forEach(function(el){
    if( ! model.data_unitSheets[el].assets.gfx ) return;

    flow.andThen(function(){
      view.imageProcessor_cropUnitSprite(el);
    });
  });

  // misc
  model.data_graphics.misc.forEach(function(el){
    flow.andThen(function(){
      view.imageProcessor_cropMiscSprite(el);
    });
  });

  flow.start(function(){
    if( DEBUG ) util.log("cropped images");
    baton.pass();
  });
});
