controller.isEnvironmentSupported = function(){
  if( DEBUG ) util.log("checking HTML and Javascript environment");
  
  var notSupported = true;
  var browser = head.browser;

  if( head.mobile ){

    // MOBILE
    if( browser.ios    && browser.version >= 6                     ) notSupported = false;
    if( browser.android && browser.version >= 4 )                    notSupported = false;
    if( browser.safari && browser.version >= 6                     ) notSupported = false;
    if( browser.chrome && browser.version >= 18 )                    notSupported = false;
    if( browser.ff     && browser.version >= 17 ) notSupported = false;
  }
  else{

    // DESKTOP
    if( browser.ie     && browser.version >= 9  ) notSupported = false;
    if( browser.safari && browser.version >= 6  ) notSupported = false;
    if( browser.chrome && browser.version >= 18 ) notSupported = false;
    if( browser.ff     && browser.version >= 17 ) notSupported = false;
  }

  if( DEBUG ) util.log("brower is",((notSupported)?"not supported":"supported"));
  if( notSupported ) alert("Attention!\nYour browser is not supported! --> "+JSON.stringify(browser) );

  return notSupported === true;
};