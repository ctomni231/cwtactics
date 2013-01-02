(function(){

  function invoke( key ){
    var data = controller.aquireActionDataObject();
    data.setAction( key );
    controller.pushActionDataIntoBuffer( data );
  }

  // ----------------------------------------------------------------------
  invoke( "loadMod" );
  invoke( "loadImages" );
  invoke( "cutImages" );
  invoke( "colorizeImages" );
  invoke( "loadInputDevices" );
  invoke( "loadSounds" );

  // FOR DEBUG PROCESS
  var data = controller.aquireActionDataObject();
  data.setAction( "loadGame" );
  data.setSubAction( testMap );
  controller.pushActionDataIntoBuffer( data );

  util.i18n_setLanguage("en");

  invoke( "startRendering" );
})();