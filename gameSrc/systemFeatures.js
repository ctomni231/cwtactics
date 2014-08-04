// browser type & version
var ua     = window.navigator.userAgent.toLowerCase(),
    mobile = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(ua);

// http://www.zytrax.com/tech/web/browser_ids.htm
// http://www.zytrax.com/tech/web/mobile_ids.dom
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
var Browser = {
  name   : browser,
  mobile : mobile,
  version: version
};

// Shortcut
Browser[browser] = true;

//
// Controls the availability of audio effects.
//
exports.audioSFX = ((Browser.chrome || Browser.safari || (Browser.ios && Browser.version >= 6)) === true);

//
// Controls the availability of music.
//
exports.audioMusic = ((Browser.chrome || Browser.safari) === true);

//
// Controls the availability of game-pad input.
//
exports.gamePad = ((Browser.chrome && !!navigator.webkitGetGamepads) === true);

//
// Controls the availability of computer keyboard input.
//
exports.keyboard = ((!Browser.mobile) === true);

//
// Controls the availability of mouse input.
//
exports.mouse = ((!Browser.mobile) === true);

//
// Controls the availability of touch input.
//
exports.touch = ((Browser.mobile) === true);

//
// Signals a official supported environment. If false then it doesn't mean the environment cannot run the game;
// but the status is not official tested. As result the game may runs fine; laggy or is completely broken.
//
exports.supported = ((Browser.chrome || Browser.safari || Browser.ios || Browser.android) === true);

//
// Controls the usage of the workaround for the iOS7 WebSQL DB bug.
//
exports.iosWebSQLFix = ((Browser.ios && Browser.version === 7) === true)
