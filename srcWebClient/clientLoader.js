(function(){

  var browserCheck = [
    ["chrome" ,18,19,20,21,22,23,24],
    ["mozilla",17,18,19],
    ["safari" ,5,6]
  ];

  var found = false;
  for( var i=0,e=browserCheck.length; i<e; i++ ){
    var block = browserCheck[i];
    if( BrowserDetection[ block[0] ] === true ){
      found = true;
      var versionFound = false;
      for( var j=1,je=block.length; j<je; j++ ){
        if( BrowserDetection.version.indexOf(block[j]) === 0 ){
          versionFound = true;
        }
      }
      if( !found ){
        alert("Attention!\nThe version of your browser is not supported!");
      }
    }
  }
  if( !found ){
    alert("Attention!\nYour browser is not supported!");
  }


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