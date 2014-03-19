controller.cutImages = util.singleLazyCall(function( err, baton ){
  var d1 = new Date().getTime();
  
  baton.take();

  var flow = jWorkflow.order(function(){
    if( this.DEBUG ) util.log("crop images");
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
    if( this.DEBUG ) util.log("cropped images");
    util.log("Cutting Images: "+(new Date().getTime()-d1)+"ms");
    baton.pass();
  });
});
