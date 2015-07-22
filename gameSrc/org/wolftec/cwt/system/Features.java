package org.wolftec.cwt.system;

import org.stjs.javascript.JSObjectAdapter;

public class Features {
  
/**
* Controls the availability of audio effects.
*/
  public static final boolean audioSFX;

/**
* Controls the availability of music.
*/
public static final boolean audioMusic;

/**
* Controls the availability of game-pad input.
*/
public static final boolean gamePad;

/**
* Controls the availability of computer keyboard input.
*/
public static final boolean keyboard;

/**
* Controls the availability of mouse input.
*/
public static final boolean mouse;

/**
* Controls the availability of touch input.
*/
public static final boolean touch;

/**
*  Signals a official supported environment. If false then it doesn't mean the environment cannot run the game,
*  but the status is not official tested. As result the game may runs fine; laggy or is completely broken.
*/
public static final boolean supported;

/**
* Controls the usage of the workaround for the iOS7 WebSQL DB bug.
*/
public static final boolean iosWebSQLFix;

static {

//browser type & version
String ua     = JSObjectAdapter.$js("window.navigator.userAgent.toLowerCase()");
boolean mobile = JSObjectAdapter.$js("/mobile|android|kindle|silk|midp|(windows nt 6\\.2.+arm|touch)/.test(ua)");

//http://www.zytrax.com/tech/web/browser_ids.htm
//http://www.zytrax.com/tech/web/mobile_ids.dom
String[]  data  =  /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) ||                  // Chrome & Firefox
     /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||  // Mobile IOS
     /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||           // Mobile Webkit
     /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||      // Safari & Opera
     /(msie) ([\w.]+)/.exec(ua) || [];                            // Internet Explorer

String browser = data[1],
String version = parseFloat(data[2]);

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

//Browser vendor and version
var Browser = {
 name   : browser,
 mobile : mobile,
 version: version
};

//Shortcut
Browser[browser] = true;

audioSFX = ((Browser.chrome || Browser.safari || (Browser.ios && Browser.version >= 6)) === true);

audioMusic = ((Browser.chrome || Browser.safari) === true);

gamePad = ((Browser.chrome && !!navigator.webkitGetGamepads) === true);

exports.keyboard = (Browser.mobile !== true);

mouse = (Browser.mobile !== true);

touch = (Browser.mobile === true);

supported = ((Browser.chrome || Browser.safari || Browser.ios || Browser.android) === true);
 iosWebSQLFix = ((Browser.ios && Browser.version == 7) == true);
}

}
