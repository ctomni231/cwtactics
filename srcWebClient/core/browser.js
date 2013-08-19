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
  ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) ||               // Chrome & Firefox
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