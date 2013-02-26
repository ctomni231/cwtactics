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

  util.injectMod = function( file ){
    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", file+".js" );
    document.getElementsByTagName("head")[0].appendChild(fileref)
  };
  
  // LOAD MODIFICATION
  if( controller.storage.has("mod") ){
         util.injectMod( controller.storage.get("mod") );
  } else util.injectMod( "mod" ); // mod.js - ATM IN THE RESULT BUILD

  util.i18n_setLanguage("en");
  
  controller.pushSharedAction("LDMD");
  controller.pushSharedAction("LOIM");
  controller.pushSharedAction("CUTI");
  controller.pushSharedAction("COLI");
  controller.pushSharedAction("LOID");
  controller.pushSharedAction("LOSO");
  controller.pushSharedAction( testMapNew, "LDGM" );  
  controller.pushSharedAction("LCFG");
  controller.pushSharedAction("STRE");
})();