/**
 * 
 * @param {function} fn
 * @returns {function} returns a new function that only allows to call fn one time
 */
util.singleLazyCall = function( fn ){
  var called = false;
  return function(){
    if( called ) util.raiseError("this function cannot be called twice");
    //called = true;
    
    fn.apply( null, arguments );
  };
};

util.scoped(function(){
  
  var xmlHttpReq;
  try {
    new XMLHttpRequest();
    xmlHttpReq = true;
  } 
  // FALL BACK
  catch (ex) { xmlHttpReq = false; }
  
  function reqListener(){
    if (this.readyState == 4 ){
      // FINE
      if (this.readyState == 4 && this.status == 200){
        util.log("grabbed file successfully");
        
        // JSON OBJECT
        if( this.asJSON ){
          
          try{ 
            this.winCallback( JSON.parse(this.responseText) ); 
          }
          // FAILED TO CONVERT JSON TEXT
          catch(e){ 
            this.failCallback( e ); 
          }
        }
        // PLAIN TEXT
        else{
          this.winCallback( this.responseText ); 
        }
      }
      // ERROR
      else{
        util.log("could not grab file");
        this.failCallback( this.statusText );
      }
    }
  }
  
  util.grabRemoteFile = function( options ){
    var oReq;
    
    util.log("try to grab file",options.path);
    
    // GENERATE REQUEST OBJECT
    if( xmlHttpReq ) oReq = new XMLHttpRequest();
    else oReq = new ActiveXObject("Microsoft.XMLHTTP");
    
    // WIN / FAIL CALLBACK
    oReq.asJSON = options.json;
    oReq.winCallback = options.success;
    oReq.failCallback = options.error;
    
    // META DATA
    oReq.onreadystatechange = reqListener;
    oReq.open("get", options.path, true);
    
    // SEND IT
    oReq.send();
  } 
});

/*
 * Browser Detection, taken from HeadJS.
 */
util.scoped(function(){
  "use strict";
  
  // browser type & version
  var ua     = window.navigator.userAgent.toLowerCase(),
      mobile = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(ua);
  
  // http://www.zytrax.com/tech/web/browser_ids.htm
  // http://www.zytrax.com/tech/web/mobile_ids.html
  ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) ||                  // Chrome & Firefox
    /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||  // Mobile IOS
    /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||           // Mobile Webkit
    /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||      // Safari & Opera
    /(msie) ([\w.]+)/.exec(ua) || [];                            // Internet Explorer
  
  var browser = ua[1],
      version = parseFloat(ua[2]);    
  
  switch (browser) {
    case 'msie':
      browser = 'ie';
      version = doc.documentMode || version;
      break;
      
    case 'firefox':
      browser = 'ff';
      break;
      
    case 'ipod':
    case 'ipad':
    case 'iphone':
      browser = 'ios';
      break;
      
    case 'webkit':
      browser = 'safari';
      break;
  }
  
  // Browser vendor and version
  window.Browser = {
    name   : browser,
    mobile : mobile,
    version: version
  };
  
  // Shortcut
  Browser[browser] = true;
  
});