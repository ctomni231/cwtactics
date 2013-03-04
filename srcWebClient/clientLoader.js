(function(){

  var notSupported = true;
  var browser = head.browser;
  if( head.mobile ){
    // MOBILE
    if( browser.ios    && browser.version >= 6 )  notSupported = false;
    if( browser.android && browser.webkit && browser.version >= 20 ) notSupported = false;
  }
  else{
    // DESKTOP
    if( browser.ie     && browser.version >= 9 ) notSupported = false;
    if( browser.safari && browser.version >= 6 ) notSupported = false;
    if( browser.chrome && browser.version >= 20 ) notSupported = false;
    if( browser.ff     && browser.version >= 17 ) notSupported = false;
  }
  
  if( notSupported ){
    alert("Attention!\nYour browser is not supported! --> "+JSON.stringify(browser) );
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