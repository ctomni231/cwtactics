controller.registerCommand({

  key:"startRendering",
  localAction: true,

  // ------------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // ------------------------------------------------------------------------
  action: function(){

    view.showInfoBlocks();

    controller.noRendering = false;

    view.fitScreenToDeviceOrientation();
    view.completeRedraw();


    view.updateTileInfo();
    view.updatePlayerInfo();

    for( var i=0, e=model.units.length; i<e; i++ ){
      if( model.units[i].owner !== CWT_INACTIVE_ID ){
        controller.updateUnitStats( model.units[i] );
      }
    }
  }
});