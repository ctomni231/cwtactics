controller.loadInputDevices = util.singleLazyCall(function( err, baton ){
  if( constants.DEBUG ) util.log("loading input devices");
  
  var canvas = document.getElementById( "cwt_canvas" );
  var menuEl = document.getElementById( "cwt_menu" );
  
  if( controller.clientFeatures.keyboard ) controller.setupKeyboardControls( canvas, menuEl );
  if( controller.clientFeatures.gamePad  ) controller.setupGamePadControls( canvas, menuEl );
  if( controller.clientFeatures.mouse    ) controller.setupMouseControls( canvas, menuEl );
  if( controller.clientFeatures.touch    ) controller.setupTouchControls( canvas, menuEl );
});
