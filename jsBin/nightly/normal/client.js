/**
 * @namespace
 */
view = {};
/* VERSION SCREEN */

var ID_MENU_SECTION_VERSION = "cwt_versus_screen";
var ID_ELMT_SECTION_VERSION_LIST = "map_selection_field";
var ID_ELMT_SECTION_VERSION_START = "versus_start";

/* MOBILE SCREEN */

var ID_ELMT_SECTION_MOBILE = "cwt_mobileSound_screen";
var ID_ELMT_SECTION_MOBILE_NEXT = "mobileSoundNext";

/* LOAD SCREEN */

var ID_MENU_SECTION_LOAD = "cwt_load_screen";

/* MAIN SCREEN */

var ID_MENU_SECTION_MAIN = "cwt_main_screen";
var ID_ELMT_SECTION_MAIN_ERROR = "main_screen_error_msg";
var ID_ELMT_SECTION_MAIN_BTN_1 = "main_screen_enter_1";
var ID_ELMT_SECTION_MAIN_BTN_2 = "main_screen_enter_2";
var ID_ELMT_SECTION_MAIN_BTN_3 = "main_screen_enter_3";
var ID_ELMT_SECTION_MAIN_BTN_4 = "main_screen_enter_4";
var ID_ELMT_SECTION_MAIN_BTN_5 = "main_screen_enter_5";
var ID_ELMT_SECTION_MAIN_BTN_6 = "main_screen_enter_6";

/* GAME SCREEN */

var ID_MENU_SECTION_GAME = "cwt_game_screen";
var ID_ELMT_GAME_CANVAS = "cwt_canvas";
var ID_ELMT_GAME_MENU = "cwt_menu";
var ID_ELMT_MENU = "cwt_menu";
var ID_ELMT_MENU_HEADER = "cwt_menu_header";
var ID_ELMT_MENU_CONTENT = "cwt_menu_content";
var ID_ELMT_MENU_ENTRIES = "cwt_menu_entries";

/* ERROR SCREEN */

var ID_MENU_SECTION_ERROR = "cwt_error_screen";
var ID_ELMT_ERROR_MSG = "error_screen_errorMsgField";

/* OPTIONS SCREEN */

var ID_MENU_SECTION_OPTIONS = "cwt_options_screen";
var ID_ELMT_OTIONS_SFX_VOL = "cwt_options_sfxVolume";
var ID_ELMT_OTIONS_MUSIC_VOL = "cwt_options_musicVolume";
var ID_ELMT_OTIONS_MOD_INFO = "cwt_options_modPath";
var ID_ELMT_OTIONS_MOD_TAKE = "cwt_options_modPath_take";
var ID_ELMT_OTIONS_RESET = "cwt_options_reset";
var ID_ELMT_OTIONS_GOBACK = "cwt_options_goBack";

/* UNIT PANEL */
var ID_ELMT_UNITINFOBOX = "cwt_unitinfo_box";
var ID_ELMT_UNITINFOBOX_NAME = "cwt_unitinfo_name";
var ID_ELMT_UNITINFOBOX_PIC = "cwt_unitinfo_picture";
var ID_ELMT_UNITINFOBOX_DESC = "cwt_unitinfo_description";
var ID_ELMT_UNITINFOBOX_CLASS_D = "cwt_unitinfo_class_D";
var ID_ELMT_UNITINFOBOX_CLASS = "cwt_unitinfo_class_C";
var ID_ELMT_UNITINFOBOX_MVTP_D = "cwt_unitinfo_movetype_D";
var ID_ELMT_UNITINFOBOX_MVTP = "cwt_unitinfo_movetype_C";
var ID_ELMT_UNITINFOBOX_MAINWP_D = "cwt_unitinfo_mainwp_D";
var ID_ELMT_UNITINFOBOX_MAINWP = "cwt_unitinfo_mainwp_C";
var ID_ELMT_UNITINFOBOX_SECWP_D = "cwt_unitinfo_secwp_D";
var ID_ELMT_UNITINFOBOX_SECWP = "cwt_unitinfo_secwp_C";
var ID_ELMT_UNITINFOBOX_HP_D = "cwt_unitinfo_HP_D";
var ID_ELMT_UNITINFOBOX_HP = "cwt_unitinfo_HP_C";
var ID_ELMT_UNITINFOBOX_GAS_D = "cwt_unitinfo_Gas_D";
var ID_ELMT_UNITINFOBOX_GAS = "cwt_unitinfo_Gas_C";
var ID_ELMT_UNITINFOBOX_GAS2 = "cwt_unitinfo_Gas_C2";
var ID_ELMT_UNITINFOBOX_AMMO_D = "cwt_unitinfo_Ammo_D";
var ID_ELMT_UNITINFOBOX_AMMO = "cwt_unitinfo_Ammo_C";
var ID_ELMT_UNITINFOBOX_AMMO2 = "cwt_unitinfo_Ammo_C2";
var ID_ELMT_UNITINFOBOX_MVRANGE_D = "cwt_unitinfo_mvrange_D";
var ID_ELMT_UNITINFOBOX_MVRANGE = "cwt_unitinfo_mvrange_C";
var ID_ELMT_UNITINFOBOX_VISION_D = "cwt_unitinfo_vision_D";
var ID_ELMT_UNITINFOBOX_VISION = "cwt_unitinfo_vision_C";
var ID_ELMT_UNITINFOBOX_ATTRANGE_D = "cwt_unitinfo_attrange_D";
var ID_ELMT_UNITINFOBOX_ATTRANGE = "cwt_unitinfo_attrange_C";
var ID_ELMT_UNITINFOBOX_ATTRANGE2 = "cwt_unitinfo_attrange_C2";
var ID_ELMT_UNITINFOBOX_AG_INF_D = "cwt_unitinfo_against_inf_D";
var ID_ELMT_UNITINFOBOX_AG_INF = "cwt_unitinfo_against_inf_C";
var ID_ELMT_UNITINFOBOX_AG_VEH_D = "cwt_unitinfo_against_veh_D";
var ID_ELMT_UNITINFOBOX_AG_VEH = "cwt_unitinfo_against_veh_C";
var ID_ELMT_UNITINFOBOX_AG_AIR_D = "cwt_unitinfo_against_air_D";
var ID_ELMT_UNITINFOBOX_AG_AIR = "cwt_unitinfo_against_air_C";
var ID_ELMT_UNITINFOBOX_AG_HELI_D = "cwt_unitinfo_against_heli_D";
var ID_ELMT_UNITINFOBOX_AG_HELI = "cwt_unitinfo_against_heli_C";
var ID_ELMT_UNITINFOBOX_AG_SHIP_D = "cwt_unitinfo_against_ship_D";
var ID_ELMT_UNITINFOBOX_AG_SHIP = "cwt_unitinfo_against_ship_C";
var ID_ELMT_UNITINFOBOX_AG_SUB_D = "cwt_unitinfo_against_sub_D";
var ID_ELMT_UNITINFOBOX_AG_SUB = "cwt_unitinfo_against_sub_C";

/* TILE PANEL */
var ID_ELMT_TILEINFOBOX = "cwt_tileinfo_box";
var ID_ELMT_TILEINFOBOX_NAME = "cwt_tileinfo_name";
var ID_ELMT_TILEINFOBOX_PIC = "cwt_tileinfo_picture";
var ID_ELMT_TILEINFOBOX_DESC = "cwt_tileinfo_description";
var ID_ELMT_TILEINFOBOX_DEFENSE_D = "cwt_tileinfo_defense_D";
var ID_ELMT_TILEINFOBOX_DEFENSE = "cwt_tileinfo_defense_C";
var ID_ELMT_TILEINFOBOX_OWNER_D = "cwt_tileinfo_owner_D";
var ID_ELMT_TILEINFOBOX_OWNER = "cwt_tileinfo_owner_C";
var ID_ELMT_TILEINFOBOX_CAPPT_D = "cwt_tileinfo_capturePoints_D";
var ID_ELMT_TILEINFOBOX_CAPPT = "cwt_tileinfo_capturePoints_C";

/* PLAYER PANEL */
var ID_ELMT_PLAYERINFOBOX = "cwt_playerinfo_box";
var ID_ELMT_PLAYERINFOBOX_NAME = "cwt_playerinfo_name";
var ID_ELMT_PLAYERINFOBOX_PIC = "cwt_playerinfo_picture";
var ID_ELMT_PLAYERINFOBOX_DESC = "cwt_playerinfo_description";
var ID_ELMT_PLAYERINFOBOX_POWER_D = "cwt_playerinfo_coPower_D";
var ID_ELMT_PLAYERINFOBOX_POWER = "cwt_playerinfo_coPower_C";
var ID_ELMT_PLAYERINFOBOX_PROPS_D = "cwt_playerinfo_numberProp_D";
var ID_ELMT_PLAYERINFOBOX_PROPS = "cwt_playerinfo_numberProp_C";
var ID_ELMT_PLAYERINFOBOX_UNITS_D = "cwt_playerinfo_numberUnits_D";
var ID_ELMT_PLAYERINFOBOX_UNITS = "cwt_playerinfo_numberUnits_C";
util.scoped(function(){
  
  function dropInputCommand(){ 
    if( DEBUG ) util.log("dropped input"); 
    return this.BREAK_TRANSITION;
  };
  
  controller.stateParent = {
    
    // MOVEMENT
    UP:        dropInputCommand,
    LEFT:      dropInputCommand,
    RIGHT:     dropInputCommand,
    DOWN:      dropInputCommand,
    
    // SPECIAL KEYS
    SPECIAL_1: dropInputCommand,
    SPECIAL_2: dropInputCommand,
    SPECIAL_3: dropInputCommand,
    SPECIAL_4: dropInputCommand,
    SPECIAL_5: dropInputCommand,
    SPECIAL_6: dropInputCommand,
    
    // BASIC ACTIONS
    ACTION:   dropInputCommand,
    CANCEL:   dropInputCommand,
    HOVER:    dropInputCommand,
  };
});
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
controller.colorizeImages = util.singleLazyCall(function( err, baton ){
  if( err ){
    if( DEBUG ) util.log("break at colorize images due error from previous inits"); 
    return baton.pass(true);
  }
  
  if( DEBUG ) util.log("colorize images");
  
  baton.take();
  
  try{
    
    var imageData = model.graphics;
    
    var UNIT_INDEXES = {
      BLACK_MASK:8,
      RED:0,
      BLUE:3,
      GREEN:4,
      colors:6
    };
    
    var PROPERTY_INDEXES = {
      RED:0,
      GRAY:1,
      BLUE:3,
      GREEN:4,
      YELLOW:5,
      BLACK_MASK:8,
      colors:4
    };
    
    function getImageDataArray( image ){
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");
      
      var imgW = image.width;
      var imgH = image.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage( image, 0, 0);
      return canvasContext.getImageData(0, 0, imgW, imgH).data;
    }
    
    /**
   * Changes colors in an image object by given replacement color
   * maps and returns a new image object (html5 canvas).
   *
   * @param image
   * @param oriColors
   * @param replColors
   */
    function replaceColors( image, colorData, numColors, oriIndex, replaceIndex ,tp ){
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");
      
      var imgW = image.width;
      var imgH = image.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage( image, 0, 0);
      var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
      
      var oriStart = (oriIndex*4)*numColors;
      var replStart = (replaceIndex*4)*numColors;
      
      var replaced = 0;
      var t = true;
      for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
          var xi = (y * 4) * imgPixels.width + x * 4;
          
          var oR = imgPixels.data[xi  ];
          var oG = imgPixels.data[xi+1];
          var oB = imgPixels.data[xi+2];
          for( var n=0,
              ne=(numColors*4); n<ne; n+=4 ){
            
            var sR = colorData[oriStart+n  ];
            var sG = colorData[oriStart+n+1];
            var sB = colorData[oriStart+n+2];
            
            if( sR === oR && sG === oG && sB === oB ){
              
              var r = replStart+n;
              var rR = colorData[r  ];
              var rG = colorData[r+1];
              var rB = colorData[r+2];
              imgPixels.data[xi  ] = rR;
              imgPixels.data[xi+1] = rG;
              imgPixels.data[xi+2] = rB;
              
              replaced++;
            }
          }
        }
      }
      
      // util.log("replaced",replaced,"pixels for the type",tp);
      // write changes back
      canvasContext.putImageData(imgPixels, 0, 0 );
      return canvas;
    }
    
    var UNIT_STATES = [
      view.IMAGE_CODE_IDLE,
      view.IMAGE_CODE_IDLE_INVERTED,
      view.IMAGE_CODE_DOWN,
      view.IMAGE_CODE_UP,
      view.IMAGE_CODE_RIGHT,
      view.IMAGE_CODE_LEFT
    ];
    
    // EXTRACT PROPERTY COLORS
    var IMG_MAP_PROP = getImageDataArray(
      view.getInfoImageForType( view.IMG_COLOR_MAP_PROPERTIES_ID )
    );
    
    var IMG_MAP_UNIT = getImageDataArray(
      view.getInfoImageForType( view.IMG_COLOR_MAP_UNITS_ID )
    );
    
    // FOR EVERY UNIT
    var unitTypes = imageData.units;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      var tp = unitTypes[i][0];
      
      for( var si=0,se=UNIT_STATES.length; si<se; si++ ){
        
        var cCode = UNIT_STATES[si];
        var redPic = view.getUnitImageForType(tp,cCode,view.COLOR_RED);
        
        view.setUnitImageForType(
          replaceColors(
            redPic, 
            IMG_MAP_UNIT,
            UNIT_INDEXES.colors,
            UNIT_INDEXES.RED, 
            UNIT_INDEXES.BLUE,
            tp
          ),
          tp,cCode,view.COLOR_BLUE
        );
        
        view.setUnitImageForType(
          replaceColors(
            redPic, 
            IMG_MAP_UNIT,
            UNIT_INDEXES.colors,
            UNIT_INDEXES.RED, 
            UNIT_INDEXES.GREEN,
            tp
          ),
          tp,cCode,view.COLOR_GREEN
        );
        
        view.setUnitImageForType(
          replaceColors(
            redPic, 
            IMG_MAP_UNIT,
            UNIT_INDEXES.colors,
            UNIT_INDEXES.RED, 
            UNIT_INDEXES.BLACK_MASK,
            tp
          ),
          tp,cCode,view.COLOR_BLACK_MASK
        );
      }
    }
    
    // FOR EVERY PROPERTY
    var propTypes = imageData.properties;
    for( var i=0,e=propTypes.length; i<e; i++ ){
      var tp = propTypes[i][0];
      
      var redPic = view.getPropertyImageForType(tp,view.COLOR_RED);
      
      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED, 
          PROPERTY_INDEXES.BLUE
        ),
        tp,view.COLOR_BLUE
      );
      
      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED,
          PROPERTY_INDEXES.GREEN
        ),
        tp,view.COLOR_GREEN
      );
      
      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED, 
          PROPERTY_INDEXES.GRAY
        ),
        tp,view.COLOR_NEUTRAL
      );
      
      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED, 
          PROPERTY_INDEXES.BLACK_MASK
        ),
        tp,view.COLOR_BLACK_MASK
      );
    }
    
    baton.pass(false);
  }
  catch( e ){
    controller.loadError = e;
    baton.pass(true);
  }
});
controller.cutImages = util.singleLazyCall(function( err, baton ){
  if( err ){
    if( DEBUG ) util.log("break at cutting images due error from previous inits"); 
    return baton.pass(true);
  }
  
  if( DEBUG ) util.log("cutting images");
  
  baton.take();
  
  try{
    
    var imageData = model.graphics;
    
    var BASE_SIZE = imageData.baseSize;
    
    // UNIT
    var UNIT_IMG_H = BASE_SIZE*2;
    var UNIT_IMG_W = BASE_SIZE*2;
    var UNIT_IMG_NUM = 3;
    
    // PROPERTY
    var PROPERTY_IMG_H = BASE_SIZE*2;
    var PROPERTY_IMG_W = BASE_SIZE;
    var PROPERTY_IMG_NUM = 4;
    
    // TILE
    var TILE_IMG_H = BASE_SIZE*2;
    var TILE_IMG_W = BASE_SIZE;
    var TILE_IMG_NUM = 1;
    
    // STATUS IMAGE
    var STAT_IMG_H = BASE_SIZE/4;
    var STAT_IMG_W = BASE_SIZE/4;
    
    
    // BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
    function flipImage(image, flipH, flipV) {
      var scaleH = flipH ? -1 : 1,
          scaleV = flipV ? -1 : 1,
          posX = flipH ? image.width * -1 : 0,
          posY = flipV ? image.height * -1 : 0;
      
      
      var nCanvas = document.createElement('canvas');
      nCanvas.height = image.height;
      nCanvas.width  = image.width;
      var nContext = nCanvas.getContext('2d');
      
      nContext.save();
      nContext.scale(scaleH, scaleV);
      nContext.drawImage(image, posX, posY, image.width, image.height);
      nContext.restore();
      
      return nCanvas;
    }
    
    
    // ----------------------------------------------------------------------
    
    if( DEBUG ){ util.log("cutting unit commands into single types"); }
    
    var unitTypes = imageData.units;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      
      var nCanvas;
      var nContext;
      var red = view.COLOR_RED;
      var tp = unitTypes[i][0];
      
      var img = view.getUnitImageForType( tp, view.IMAGE_CODE_IDLE, red );
      
      // LEFT
      nCanvas = document.createElement('canvas');
      nCanvas.height = 32;
      nCanvas.width  = 32*3;
      nContext = nCanvas.getContext('2d');
      nContext.drawImage( img, 0, 0, 32*3, 32, 0, 0, 32*3, 32 );
      view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_IDLE, red );
      
      // LEFT INVERTED
      nCanvas = document.createElement('canvas');
      nCanvas.height = 32;
      nCanvas.width  = 32*3;
      nContext = nCanvas.getContext('2d');
      nContext.drawImage( img, 0, 0, 32*3, 32, 0, 0, 32*3, 32 );
      view.setUnitImageForType(
        flipImage( nCanvas, true, false), tp,
        view.IMAGE_CODE_IDLE_INVERTED, red
      );
      
      // MOVE LEFT
      nCanvas = document.createElement('canvas');
      nCanvas.height = 32;
      nCanvas.width  = 32*3;
      nContext = nCanvas.getContext('2d');
      nContext.drawImage( img, 32*9, 0, 32*3, 32, 0, 0, 32*3, 32 );
      view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_LEFT, red );
      
      // MOVE LEFT INVERTED
      nCanvas = document.createElement('canvas');
      nCanvas.height = 32;
      nCanvas.width  = 32*3;
      nContext = nCanvas.getContext('2d');
      nContext.drawImage( img, 32*9, 0, 32*3, 32, 0, 0, 32*3, 32 );
      view.setUnitImageForType(
        flipImage( nCanvas, true, false), tp,
        view.IMAGE_CODE_RIGHT, red
      );
      
      // MOVE UP
      nCanvas = document.createElement('canvas');
      nCanvas.height = 32;
      nCanvas.width  = 32*3;
      nContext = nCanvas.getContext('2d');
      nContext.drawImage( img, 32*3, 0, 32*3, 32, 0, 0, 32*3, 32 );
      view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_UP, red );
      
      // MOVE DOWN
      nCanvas = document.createElement('canvas');
      nCanvas.height = 32;
      nCanvas.width  = 32*3;
      nContext = nCanvas.getContext('2d');
      nContext.drawImage( img, 32*6, 0, 32*3, 32, 0, 0, 32*3, 32 );
      view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_DOWN, red );
      
    }
    
    if( DEBUG ){ util.log("cutting unit commands into single types done"); }
    
    // ----------------------------------------------------------------------
    
    if( DEBUG ){ util.log("cutting misc into single types"); }
    
    var misc = imageData.misc;
    for( var i=0,e=misc.length; i<e; i++ ){
      var miscType = misc[i];
      if( miscType.length > 2 ){
        
        // CUT
        var img = view.getInfoImageForType( miscType[0] );
        
        nCanvas = document.createElement('canvas');
        nContext = nCanvas.getContext('2d');
        
        if( miscType.length > 6 ){
          if( miscType[6] === true ){
            
            //TODO FIX THAT
            nCanvas.height = 32;
            nCanvas.width  = 32*3;
            
            nCanvas = flipImage( nCanvas, true, false);
            
            nContext = nCanvas.getContext('2d');
          }
          else{
            
            nCanvas.height = 16;
            nCanvas.width  = 16;
            nContext.save();
            nContext.translate(8,8);
            nContext.rotate( miscType[6] * Math.PI/180);
            nContext.translate(-8,-8);
          }
        }
        else{
          nCanvas.height = 16;
          nCanvas.width  = 16;
        }
        
        if( miscType.length > 6 && miscType[6] === true ){
          // TODO FIX THAT
          nContext.drawImage(
            img,
            miscType[2], miscType[3],
            miscType[4], miscType[5],
            0, 0,
            32*3, 32
          );
        }
        else{
          nContext.drawImage(
            img,
            miscType[2], miscType[3],
            miscType[4], miscType[5],
            0, 0,
            16, 16
          );
        }
        
        if( miscType.length > 6 ){
          nContext.restore();
        }
        
        view.setInfoImageForType( nCanvas, miscType[0] );
      }
    }
    
    if( DEBUG ){ util.log("cutting misc into single types done"); } 
    
    baton.pass(false);
  }
  catch( e ){
    controller.loadError = e;
    baton.pass(true);
  }
});
util.scoped(function(){
  var context;
  var isMobile = Browser.ios;
  
  function loadIt( /*key, src, cb*/ list,baton,callback ){
    var key = list[ list.curStep_ ].id;
    var src = list[ list.curStep_ ].src;
    var isMusic = list[ list.curStep_ ].music;
    var isCoMusic = list[ list.curStep_ ].co_music;
    
    // MOBILE DOES NOT USING CO SOUNDS
    if( isMobile && ( isCoMusic || isMusic ) ){
      util.log("ignoring co music because device has iOS");
      callback(list,baton);
      return;
    }
    
    // ITEM AVAILABLE IN STORAGE?
    controller.storage.has(key,function( exists ){
      
      // IF YES THEN LOAD IT FROM STORAGE
      if( exists ){
        if( DEBUG ) util.log(key,"is in storage");
        
        controller.storage.get(key,function( obj ){
          if( DEBUG ) util.log(key,"will be cached");
          
          try{
            var audioData = Base64Helper.decodeBuffer( obj.value );
            context.decodeAudioData( audioData, function(buffer) {
              controller.registerSoundFile(key,buffer);
              callback(list,baton);
            }, function( e ){ 
              controller.loadError = e;
              baton.pass(true);
            });
          }
          catch( e ){
            controller.loadError = e;
            baton.pass(true);
          }
        });
        
      }
      // ELSE LOAD IT VIA HTTP
      else{
        if( DEBUG ) util.log("load",key,"with HTTP request");
        
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "arraybuffer";
        request.onload = function(){
          
          if( this.status === 404 ){
            controller.loadError = "failed to load music file "+key;
            baton.pass(true);
            return;
          }
          
          var audioData = request.response;
          if( DEBUG ) util.log("saving",key,"in storage");
          
          controller.storage.set(key, Base64Helper.encodeBuffer(audioData), function(){
            if( DEBUG ) util.log("saved",key,"successfully in storage");
            
            context.decodeAudioData(audioData, function(buffer) {
              controller.registerSoundFile(key,buffer);
              callback(list,baton);
            }, function( e ){  
              controller.loadError = e;
              baton.pass(true);
            });
          });
        };
        
        request.send();
      }
    });
  }
  
  function loadDone(list,baton){
    if( list === true ){
      controller.loadError = "could not grab music";
      return baton.pass(true);
      return;
    }
    
    list.curStep_++;
    
    // IF FINISHED ALL ITEMS LIST OF THE LIST THEN RETURN LOCK
    if( list.curStep_ === list.length ){
      util.log("finished initializing audio system"); 
      baton.pass(false);
    }
    // ELSE LOAD ANOTHER ITEM
    else{
      asyncLoad(list,baton);
    }
  }
  
  function asyncLoad( list, baton ){
    loadIt(list,baton,loadDone);
  }
  
  /**
   * Loads all sound files from mod descriptor or from storage if the storage has a persitent representation of the 
   * sound files.
   */
  controller.loadSoundFiles = util.singleLazyCall(function( err, baton ){
    if( err ){
      if( DEBUG ) util.log("break at init audio system due error from previous inits"); 
      return baton.pass(true);
    }
    
    util.log("init audio system"); 
    
    context = controller.audioContext();
    if( context === null ) return false;
    
    baton.take();
    
    if( model.sounds.length > 0 ){
      
      // COPY 
      var sounds = []; 
      sounds.curStep_ = 0;
      for( var i=0,e=model.sounds.length; i<e; i++ ) sounds[i] = model.sounds[i];
      
      // START LOADING
      asyncLoad( sounds,baton );
    }
    else baton.pass(false);
  });
  
});
controller.loadImages = util.singleLazyCall(function( err, masterbaton ){
  if( err ){
    if( DEBUG ) util.log("break at load images due error from previous inits"); 
    return masterbaton.pass(true);
  }
  
  masterbaton.take();
  
  // TODO MOVE HOOKS INTO SCOPE VARIABLES
  var i,e;
  
  function pictureSavedMsg( obj ){
    if( DEBUG ) util.log("saved image type",obj.key);
  }
  
  function insertPicture(){
    var mode = this.mode_;
    var baton = this.baton_;
    var list = this.list_;
    var key = this.pickey_;
    var saveIt = this.saveIt_;
    
    if( saveIt ){
      controller.storage.set( key,Base64Helper.canvasToBase64(this), pictureSavedMsg);
    }
    
    //if( DEBUG ) util.log("finished loading image type",key);
    
    // CLEAN IMAGE OBJECT
    delete this.pickey_;
    delete this.baton_;
    delete this.list_;
    delete this.mode_;
    delete this.saveIt_;
    
    // CHECK MODE
    switch( mode ){
        
      case "UNIT": 
        view.setUnitImageForType( this, key, view.IMAGE_CODE_IDLE, view.COLOR_RED ); 
        break;
        
      case "PROPERTY": 
        view.setPropertyImageForType( this, key, view.COLOR_RED );
        break;
        
      case "TILE": 
        view.setTileImageForType( this, key );
        break;
        
      case "MISC": 
        view.setInfoImageForType( this, key );
        break;
        
      default: util.raiseError("unknown mode key",mode);
    }
    
    if( list.curStep_ === list.length ){
      worklistStep++;
      if( worklistStep < worklist.length ) list = worklist[worklistStep];
      else list = null;
    }
    
    baton.pass(list);
  }
  
  function loadListPicture( list, baton ){
    
    // ERROR 
    if( list === true ) baton.pass(true);
      
    baton.take();
    
    if( list.curStep_ === list.length ) util.raiseError("illegal index");
    var desc = list[list.curStep_];
    list.curStep_++;
    
    img = new Image();
    
    // INSERT META DATA
    img.pickey_ = desc[0];
    img.baton_  = baton;
    img.mode_   = list.mode_;
    img.list_   = list;
    img.saveIt_ = false;
    img.onerror = function(){
      controller.loadError = { message:"could not load image "+img.pickey_ };
      baton.pass(true);
    };
    
    // ANIMATED ?
    if( desc[2] === "ANIMATED" ){
      view.animatedTiles[ img.pickey_ ] = true;
    }
    // OVERLAYER ?
    else if( desc[2] === "OVERLAYER" ){
      view.overlayImages[ img.pickey_ ] = true;
    }
      
      controller.storage.has( desc[0], function( exists ){
        
        // IMAGE EXISTS IN THE STORAGE
        if( exists ){
          // if( DEBUG ) util.log("try loading image",desc[0],"from storage");
          
          controller.storage.get( desc[0], function( obj ){
            img.onload  = insertPicture;
            img.src = "data:image/png;base64,"+obj.value;
          });
        }
        // IMAGE NEEDS TO BE LOADED
        else{
          // if( DEBUG ) util.log("try loading image",desc[0],"from remote server");
          
          img.saveIt_ = true;
          img.onload  = insertPicture;
          img.src     = desc[1];
        }
      });
  }
  
  // PREPARE LISTS
  var imageData = model.graphics;
  imageData.units.curStep_ = 0;
  imageData.units.mode_ = "UNIT";
  imageData.properties.curStep_ = 0;
  imageData.properties.mode_ = "PROPERTY";
  imageData.tiles.curStep_ = 0;
  imageData.tiles.mode_ = "TILE";
  imageData.misc.curStep_ = 0;
  imageData.misc.mode_ = "MISC";
  
  var worklistStep = 0;
  var worklist = [ imageData.units, imageData.properties, imageData.tiles, imageData.misc ];
  
  // CREAE WORKFLOW
  var workflow = jWorkflow.order(function(){
    if( DEBUG ) util.log("start loading images");
    return worklist[0];
  });
  
  // FILL STEPS
  for( i=0,e=imageData.units.length; i<e; i++ )       workflow.andThen(loadListPicture);
  for( i=0,e=imageData.properties.length; i<e; i++ )  workflow.andThen(loadListPicture);
  for( i=0,e=imageData.tiles.length; i<e; i++ )       workflow.andThen(loadListPicture);
  for( i=0,e=imageData.misc.length; i<e; i++ )        workflow.andThen(loadListPicture);
  
  // END WORKFLOW AND START IT
  workflow.andThen(function( pipe ){
    if( pipe === true ){
      if( DEBUG ) util.log("failed to load images");
      masterbaton.pass(true);
    }
    else{
      if( DEBUG ) util.log("finished loading images");
      masterbaton.pass(false);
    }
  }).start(); 
});
/**
 * 
 */
controller.loadInputDevices = util.singleLazyCall(function( err, baton ){
  
  var INPUT_KEYBOARD_CODE_LEFT  = 37;
  var INPUT_KEYBOARD_CODE_UP    = 38;
  var INPUT_KEYBOARD_CODE_RIGHT = 39;
  var INPUT_KEYBOARD_CODE_DOWN  = 40;
  
  var INPUT_KEYBOARD_CODE_BACKSPACE = 8;
  var INPUT_KEYBOARD_CODE_ENTER = 13;
  
  var INPUT_KEYBOARD_CODE_M = 77;
  var INPUT_KEYBOARD_CODE_N = 78;
  
  var INPUT_KEYBOARD_CODE_1 = 49;
  var INPUT_KEYBOARD_CODE_2 = 50;
  var INPUT_KEYBOARD_CODE_3 = 51;
  var INPUT_KEYBOARD_CODE_4 = 52;
  var INPUT_KEYBOARD_CODE_5 = 53;
  var INPUT_KEYBOARD_CODE_6 = 54;
  
  var INPUT_KEYBOARD_CODE_TAB = 9;
  
  baton.take(); 
  
  if( DEBUG ) util.log("loading input devices");
  
  var canvas = document.getElementById( ID_ELMT_GAME_CANVAS );
  var menuEl = document.getElementById( ID_ELMT_GAME_MENU );
  
  // ------------------------------------------ KEYBOARD CONTROLS -------------------------------------------
  // --------------------------------------------------------------------------------------------------------
  
  if( head.desktop ){
    
    if( DEBUG ) util.log("initializing keyboard support");
    
    // KEY DOWN
    document.onkeydown = function( ev ){
      var code = ev.keyCode;
      if( event.target.id === "cwt_options_mapIn" ){
        switch( code ){            
          case INPUT_KEYBOARD_CODE_UP:
            controller.screenStateMachine.event("UP",1);
            return false;
            
          case INPUT_KEYBOARD_CODE_DOWN:
            controller.screenStateMachine.event("DOWN",1);
            return false;
        }
        return true;
      } 
      
      switch( code ){
          
        case INPUT_KEYBOARD_CODE_1:
          controller.screenStateMachine.event("SPECIAL_1");
          return false;
          
        case INPUT_KEYBOARD_CODE_2:
          controller.screenStateMachine.event("SPECIAL_2");
          return false;
          
        case INPUT_KEYBOARD_CODE_3:
          controller.screenStateMachine.event("SPECIAL_3");
          return false;
          
        case INPUT_KEYBOARD_CODE_4:
          controller.screenStateMachine.event("SPECIAL_4");
          return false;
          
        case INPUT_KEYBOARD_CODE_5:
          controller.screenStateMachine.event("SPECIAL_5");
          return false;
          
        case INPUT_KEYBOARD_CODE_6:
          controller.screenStateMachine.event("SPECIAL_6");
          return false;
          
        case INPUT_KEYBOARD_CODE_LEFT:
          controller.screenStateMachine.event("LEFT",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_UP:
          controller.screenStateMachine.event("UP",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_RIGHT:
          controller.screenStateMachine.event("RIGHT",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_DOWN:
          controller.screenStateMachine.event("DOWN",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_BACKSPACE:
          controller.screenStateMachine.event("CANCEL");
          return false;
          
        case INPUT_KEYBOARD_CODE_ENTER:
          controller.screenStateMachine.event("ACTION");
          return false;
          
        case INPUT_KEYBOARD_CODE_M:
          controller.screenStateMachine.event("ZOOM_IN");
          return false;
          
        case INPUT_KEYBOARD_CODE_N:
          controller.screenStateMachine.event("ZOOM_OUT");
          return false;
          
        case INPUT_KEYBOARD_CODE_TAB: 
          return false;
      }
      
      return true;
    };
    
    // -------------------------------------------- MOUSE CONTROLS --------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    
    if( DEBUG ) util.log("initializing mouse support");
    
    // MENU HINTS
    var mouseInMenu = false;
    menuEl.onmouseout = function(){ mouseInMenu=false; };
    menuEl.onmouseover = function(){ mouseInMenu=true; };
    
    function MouseWheelHandler(e){
      if( controller.inputCoolDown > 0 ) return false;
      if( inClick ) return;
      
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      if( delta > 0 ) controller.screenStateMachine.event("SPECIAL_5");
      else            controller.screenStateMachine.event("SPECIAL_6");
      
      controller.inputCoolDown = 1000;
    }
    
    if( document.addEventListener){
      
      // IE9, Chrome, Safari, Opera
      document.addEventListener("mousewheel", MouseWheelHandler, false);
      
      // Firefox
      document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    
    var len = TILE_LENGTH;
    var msx = 0;
    var msy = 0;
    document.addEventListener("mousemove", function(ev){
      var x,y;
      ev = ev || window.event;
      if( inClick ) return;
      
      if( typeof ev.offsetX === 'number' ){
        x = ev.offsetX;
        y = ev.offsetY;
      }
      else {
        x = ev.layerX;
        y = ev.layerY;
      }
      
      // TO TILE POSITION
      x = parseInt( x/len , 10);
      y = parseInt( y/len , 10);
      
      controller.screenStateMachine.event("HOVER",x,y);
    });
    
    var inClick = false;
    document.onmousedown = function(ev){      
      ev = ev || window.event;
      inClick = true;
      
      if( typeof ev.offsetX === 'number' ){
        msx = ev.offsetX;
        msy = ev.offsetY;
      }
      else {
        msx = ev.layerX;
        msy = ev.layerY;
      }
    };
    
    document.onmouseup = function(ev){    
      
      ev = ev || window.event;
      inClick = false;
      
      var msex;
      var msey;
      if( typeof ev.offsetX === 'number' ){
        msex = ev.offsetX;
        msey = ev.offsetY;
      }
      else {
        msex = ev.layerX;
        msey = ev.layerY;
      }
      
      var dex = Math.abs( msx-msex );
      var dey = Math.abs( msy-msey );
      
      var state = controller.stateMachine.state;
      if( (state === "ACTION_MENU" || state === "ACTION_SUBMENU") && !mouseInMenu ){
        // MENU + MOUSE OUTSIDE === CANCEL
        controller.cursorActionCancel()
      }
      else{
        
        switch(ev.which){
            
          case 1: controller.screenStateMachine.event("ACTION"); break; // LEFT
          case 2: break;                                                // MIDDLE
            
            // RIGHT
          case 3: 
            if( dex > 32 || dey > 32 ){
              // EXTRACT DIRECTION
              var mode;
              if( dex > dey ){
                
                // LEFT OR RIGHT
                if( msx > msex ) mode = "SPECIAL_2";
                else mode = "SPECIAL_1";
              }
              else{
                
                // UP OR DOWN
                if( msy > msey ) mode = "SPECIAL_3";
                else mode = "SPECIAL_4";
              }
              
              controller.screenStateMachine.event( mode );
            }
            else controller.screenStateMachine.event("CANCEL"); 
            break; 
        }
      }
    };
  }
  
  // -------------------------------------------- TOUCH CONTROLS --------------------------------------------
  // --------------------------------------------------------------------------------------------------------
  
  if( head.mobile ){
    util.scoped(function(){
      
      // SELECTED POSITIONS ( FIRST FINGER )
      var sx,sy;
      var ex,ey;
      
      // SELECTED POSITIONS ( SECOND FINGER )
      var s2x,s2y;
      var e2x,e2y;
      
      // START TIMESTAMP
      var st;
      
      // PINCH VARS
      var pinDis,pinDis2;
      
      // DRAG VARS
      var dragDiff=0;
      var isDrag = false;
      
      // TOUCH STARTS
      document.addEventListener('touchstart', function(event) {
        if( event.target.id !== "cwt_options_mapIn" ) event.preventDefault();
        
        // SAVE POSITION AND CLEAR OLD DATA
        sx = event.touches[0].screenX;
        sy = event.touches[0].screenY;
        ex = sx;
        ey = sy;        
        isDrag = false;
        
        // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
        if( event.touches.length === 2 ){
          
          // SAVE POSITION AND CLEAR OLD DATA
          s2x = event.touches[1].screenX;
          s2y = event.touches[1].screenY;
          e2x = s2x;
          e2y = s2y;
          
          // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
          var dx = Math.abs(sx-s2x);
          var dy = Math.abs(sy-s2y);
          pinDis = Math.sqrt(dx*dx+dy*dy)
          
        } 
        else s2x = -1;
        
        // REMEMBER TIME STAMP
        st = event.timeStamp;
      }, false);
      
      // TOUCH MOVES
      document.addEventListener('touchmove', function(event) {
        if( event.target.id !== "cwt_options_mapIn" ) event.preventDefault();
        
        // SAVE POSITION 
        ex = event.touches[0].screenX;
        ey = event.touches[0].screenY;
        
        // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
        if( event.touches.length === 2 ){
          
          // SAVE POSITION 
          e2x = event.touches[1].screenX;
          e2y = event.touches[1].screenY;
          
          // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER
          // TO BE ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT
          // WILL BE TRIGGERED
          var dx = Math.abs(ex-e2x);
          var dy = Math.abs(ey-e2y);
          pinDis2 = Math.sqrt(dx*dx+dy*dy)
        } 
        else s2x = -1;
        
        // REMEMBER DISTANCE BETWEEN START POSITION AND CURRENT POSITION
        var dx = Math.abs(sx-ex);
        var dy = Math.abs(sy-ey);
        var d = Math.sqrt(dx*dx+dy*dy);
        
        var timeDiff = event.timeStamp - st;
        if( d > 16 ){
          
          // IT IS A DRAG MOVE WHEN THE DISTANCE IS GROWING AND A GIVEN TIME IS UP
          if( timeDiff > 300 ){
            
            // REMEMBER NOW THAT YOUR ARE IN A DRAG SESSION
            isDrag = true;
            
            // DRAG WOULD BE FIRED VERY OFTEN IN A SECOND
            // ONLY FIRE WHEN THE A GIVEN TIME IS UP SINCE START
            // OR THE LAST DRAG EVENT
            if( dragDiff > 75 ){
              
              // EXTRACT DIRECTION
              var mode;
              if( dx > dy ){
                
                // LEFT OR RIGHT
                if( sx > ex ) mode = "LEFT";
                else mode = "RIGHT";
              }
              else{
                
                // UP OR DOWN
                if( sy > ey ) mode = "UP";
                else mode = "DOWN";
              }
              
              // RESET META DATA AND SET START POSITION TO THE 
              // CURRENT POSITION TO EXTRACT CORRECT DIRECTION IN THE 
              // NEXT DRAG EVENT
              dragDiff = 0;
              sx = ex;
              sy = ey;
              
              controller.screenStateMachine.event( mode ,1);
            }
            else dragDiff += timeDiff;
          }
        }
      }, false);
      
      // TOUCH END
      document.addEventListener('touchend', function(event) {        
        if( event.target.id !== "cwt_options_mapIn" ) event.preventDefault();
        
        if( controller.inputCoolDown > 0 ) return;
        
        // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
        var dx = Math.abs(sx-ex);
        var dy = Math.abs(sy-ey);
        var d = Math.sqrt(dx*dx+dy*dy);
        var timeDiff = event.timeStamp - st;
        
        // IS IT A TWO PINCH GESTURE?
        if( s2x !== -1 ){
          
          var pinDis3 = Math.abs( pinDis2 - pinDis );
          if( pinDis3 <= 32 ){
            
            // EXTRACT DIRECTION
            var mode;
            if( dx > dy ){
              
              // LEFT OR RIGHT
              if( sx > ex ) mode = "SPECIAL_2";
              else mode = "SPECIAL_1";
            }
            else{
              
              // UP OR DOWN
              if( sy > ey ) mode = "SPECIAL_3";
              else mode = "SPECIAL_4";
            }
            
            controller.screenStateMachine.event( mode );
          }
          else{
            if( pinDis2<pinDis ){
              controller.screenStateMachine.event("SPECIAL_6"); 
            }
            else{
              controller.screenStateMachine.event("SPECIAL_5"); 
            }
          }
          
          // PLACE A COOLDOWN TO PREVENT ANOTHER COMMAND AFTER
          // THE SPECIAL COMMAND
          // THIS SEEMS TO HAPPEN WHEN YOU RELEASE BOTH FINGERS 
          // NOT EXACT AT THE SAME TIME
          controller.inputCoolDown = 500;
        }
        else{
          
          // IF DISTANCE IS 16 OR LOWER THEN THE FINGER HASN'T REALLY
          // MOVED THEN IT'S A TAP
          if( d <= 16 ){
            
            // SHORT TIME GAP MEAN TAP
            if( timeDiff <= 500 ){
              controller.screenStateMachine.event("ACTION"); 
            }
            // ELSE CANCEL IF YOU AREN'T IN A DRAG SESSION
            else if( !isDrag ){
              controller.screenStateMachine.event("CANCEL"); 
            }
              }
          // A VERY SHORT AND FAST DRAG IS A SWIPE GESTURE
          else if( timeDiff <= 300 ) {
            
            // EXTRACT DIRECTION
            var mode;
            if( dx > dy ){
              
              // LEFT OR RIGHT
              if( sx > ex ) mode = "LEFT";
              else mode = "RIGHT";
            }
            else{
              
              // UP OR DOWN
              if( sy > ey ) mode = "UP";
              else mode = "DOWN";
            }
            
            controller.screenStateMachine.event( mode ,1);
          }
            }
        
      }, false);
      
    });
  }
  
  baton.pass(false);   
});
controller.mapList = [];

/**
 * 
 */
controller.loadMaps = util.singleLazyCall(function( err, masterbaton ){
  if( err ){
    if( DEBUG ) util.log("break at load maps due error from previous inits"); 
    return masterbaton.pass(true);
  }
  
  if( DEBUG ) util.log("loading maps");
  masterbaton.take();
  
  var cStep = 0;
  var maps = model.maps;
  
  function loadMap( pipe, baton ){
    
    // ERROR
    if( pipe === true ) return true;
    
    baton.take();
    
    var map = maps[cStep];
    controller.storage.get( map, function( obj ){
      
      // DOES NOT EXISTS
      if( obj === null ){
        util.grabRemoteFile({
          path:map,
          json:true,
          error: function( msg ){ 
            controller.loadError = msg;
            baton.pass(true);
          }, 
          success: function( response ){
            if( DEBUG ) util.log("map grabbed, saving as",map);
            
            // SAVE GRABBED DATA
            controller.storage.set( map , response, function(){
              cStep++;
              controller.mapList.push({name:response.name, key:map});
              baton.pass();
            });
          }
        });
      }
      // DOES EXISTS
      else{
        cStep++;
        controller.mapList.push({name:obj.value.name, key:map});
        baton.pass();
      }
    });
  }
  
  // CREAE WORKFLOW
  var workflow = jWorkflow.order(function(){
    if( DEBUG ) util.log("start loading maps");
  });
  
  // FILL STEPS
  for( var i=0,e=maps.length; i<e; i++ ) workflow.andThen(loadMap);
  
  // END WORKFLOW AND START IT
  workflow.andThen(function( pipe ){
    if( pipe === true ){
      if( DEBUG ) util.log("failed to load maps");
      masterbaton.pass(true);
    }
    else{
      if( DEBUG ) util.log("finished loading maps");
      masterbaton.pass(false);
    }
  }).start();
});
/**
 * 
 */
controller.loadModification =  util.singleLazyCall( function( err, baton ){
  if( err ){
    if( DEBUG ) util.log("break at load modification due error from previous inits"); 
    return baton.pass(true);
  }
  
  if( DEBUG ) util.log("loading modification");
  
  baton.take();
  
  // TRY TO GRAB DATA FROM STORAGE
  controller.storage.has("mod",function( exists ){
    
    // USE EXISTING DATA
    if( exists ){
      if( DEBUG ) util.log("modification available, grab from storage");
      
      controller.storage.get("mod",function( obj ){
        try{
          var mod = obj.value;
          controller.stateMachine.event("start", mod );
          baton.pass(false);
        }
        catch( e ){
          controller.loadError = e.message;
          baton.pass(true);
        }
      });
    }
    // LOAD IT VIA REQUEST
    else{
      if( DEBUG ) util.log("modification not available, grab default one");
      
      controller.storage.get("modificationPath",function( obj ){
        var modName = ( obj === null )? "awds.json" : obj.value;
        util.grabRemoteFile({
          path:"awds.json",
          json:true,
          error: function( msg ) { 
            controller.loadError = msg;
            baton.pass(true);
          }, 
          success: function( resp ) {
            if( DEBUG ) util.log("modification grabbed, saving it");
            
            // SAVE GRABBED DATA
            controller.storage.set("mod",resp,function(){
              if( DEBUG ) util.log("modification saved, next initializing engine");
              
              try{
                controller.stateMachine.event("start", resp );
                baton.pass(false);
              }
              catch( e ){
                controller.loadError = e.message;
                baton.pass(true);
              }
            });
          }
        });
      });
    }
  });
  
});
util.scoped(function(){
  
  var spriteAnimation = {};
  
  var spriteAnimators_ = [];
  
  /**
   *
   */
  view.registerSpriteAnimator = function( key, steps, timePerStep, updatorFn ){
    
    var holder = {};
    holder.stps = steps;
    holder.tps = timePerStep;
    holder.upt = updatorFn;
    holder.step = 0;
    holder.time = 0;
    
    spriteAnimation[key] = holder;
    spriteAnimators_.push( holder );
  };
  
  /**
   *
   */
  view.getSpriteStep = function( key ){
    return spriteAnimation[key].step;
  };
  
  /**
   *
   */
  view.updateSpriteAnimations = function( delta ){
    for( var i=0,e=spriteAnimators_.length; i<e; i++ ){
      
      var anim = spriteAnimators_[i];
      anim.time += delta;
      if( anim.time >= anim.tps ){
        
        // INCREASE STEP AND RESET TIMER
        anim.time = 0;
        anim.step++;
        
        if( anim.step >= anim.stps ){
          anim.step = 0;
        }
        
        // CALL UPDATER
        anim.upt();
      }
    }
  };
  
});

util.scoped(function(){
  
  // CACHE
  var selection = controller.stateMachine.data.selection;
  
  view.registerSpriteAnimator( "SELECTION", 7, 150, function(){
    var state = controller.stateMachine.state;
    if( state !== "MOVEPATH_SELECTION" &&
        state !== "ACTION_SELECT_TARGET_A" &&
        state !== "ACTION_SELECT_TARGET_B" &&
        !controller.attackRangeVisible ) return;
    
    var x  = 0;
    var yS = 0;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    
    // ITERATE THROUGH THE SCREEN
    for( ; x<xe; x++ ){
      for( var y=yS ; y<ye; y++ ){
        if( selection.getValueAt( x, y ) > -1 ){
          
        // TODO : do not check all 
          view.markForRedraw( x,y );
        }
      }
    }
  });
});

view.registerSpriteAnimator( "STATUS", 20, 375, function(){
  
});

view.registerSpriteAnimator( "UNIT", 3, 250, function(){
  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  
  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      if( model.unitPosMap[x][y] !== null ){
        view.markForRedrawWithNeighbours(x,y);
      }
    }
  }
});

view.registerSpriteAnimator( "PROPERTY", 4, 400, function(){
  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  
  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      if( model.propertyPosMap[x][y] !== null ){
        view.markForRedrawWithNeighbours(x,y);
      }
    }
  }
});

view.registerSpriteAnimator( "ANIM_TILES", 4, 300, function(){
  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  
  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      
      // TODO : cache list with animated tiles
      if( view.animatedTiles[ view.mapImages[x][y] ] ){
        view.markForRedraw( x,y );
      }
    }
  }
});
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
  
}, false);

// The manifest returns 404 or 410, the download failed,
// or the manifest changed while the download was in progress.
window.applicationCache.addEventListener('error', function(){
  alert("could not download the game data into the offline storage");
}, false);
util.scoped(function(){
  
  // TODO: REMOVE FUNCTION CONSTRUCTION IN EVERY STEP
  
  var context = null; 
  var bufferMap = {};
  var sfxGainNode;
  var musicGainNode;
  var currentMusic;
  
  var sfxStorageParam = "__volume_sfx__";
  var musicStorageParam = "__music_sfx__";
  
  /**
   *
   */
  controller.saveSoundConfigs = function(){
    if( DEBUG ){ 
      util.log("saving volume config in storage");
    }
    
    controller.storage.set( sfxStorageParam, sfxGainNode.gain.value );
    controller.storage.set( musicStorageParam, musicGainNode.gain.value );
  };
  
  /**
   * Returns a web audio context. If no context is initialized then it will be created first.
   */
  controller.audioContext = function(){
    if( !context ){
      
      // LOAD SOUND CONTEXT
      try{
        util.log("init audio context");
        
        if( window.AudioContext ) {
          util.log("using standardized one");
          context = new window.AudioContext();
        } 
        else if ( window.webkitAudioContext ) {
          util.log("using webkit prefixed one");
          context = new window.webkitAudioContext();
        }
        else throw Error("no webaudio contructor found");
        
        // ------------------------------------------------------------------
        
        // SOUND VOLUME
        sfxGainNode = context.createGainNode();
        sfxGainNode.gain.value = 1;
        sfxGainNode.connect(context.destination);   
        
        // MUSIC VOLUME
        musicGainNode = context.createGainNode();
        musicGainNode.gain.value = 0.5;
        musicGainNode.connect(context.destination);  
        
        // ------------------------------------------------------------------
        
        // GET VOLUME FROM CONFIG
        controller.storage.get( sfxStorageParam, function( obj ){
          if( obj !== null ) sfxGainNode.gain.value = obj.value;
        });
        
        controller.storage.get( musicStorageParam, function( obj ){
          if( obj !== null ) musicGainNode.gain.value = obj.value;
        });
        
        util.log("finished init audio context");
      }
      // RETURN ERROR WHEN SOUND CONTEXT IS NOT INITIALIZE ABLE 
      catch(e){
        if( DEBUG ) util.log("could not grab audio context, your environment seems to be out of webAudio API support err:",e);
        context = null;
      }
    }
    
    return context;
  };
  
  /**
   * 
   * @param {type} key
   * @param {type} buffer
   */
  controller.registerSoundFile = function( key, buffer ){
    bufferMap[key] = buffer;
  };
  
  /**
   * 
   */
  controller.getSfxVolume = function( vol ){   
    if( !context ) return 0;
    
    return sfxGainNode.gain.value;
  };
  
  /**
   * 
   */
  controller.getMusicVolume = function( vol ){  
    if( !context ) return 0;
    
    return musicGainNode.gain.value;
  };
  
  /**
   * 
   * @param {Number} vol
   */
  controller.setSfxVolume = function( vol ){    
    if( !context ) return;
    
    if( vol < 0 ) vol = 0;
    else if( vol > 1 ) vol = 1;
    
    sfxGainNode.gain.value = vol;
  };
  
  /**
   * 
   * @param {Number} vol
   */
  controller.setMusicVolume = function( vol ){    
    if( !context ) return;
    
    if( vol < 0 ) vol = 0;
    else if( vol > 1 ) vol = 1;
    
    musicGainNode.gain.value = vol;
  };
  
  
  /*
    // http://www.html5rocks.com/en/tutorials/webaudio/intro/
     
    source.loop = false;
    source.noteOff(0);
    source.noteOn(0); // Play immediately.
   */
  
  /**
   * Plays a sound effect.
   * 
   * @param {String} id
   * @param {Boolean} loop
   * @param {Boolean} isMusic
   */
  controller.playSound = function( id, loop, isMusic ){
    if( context === null ) return;
    
    var gainNode = (isMusic)? musicGainNode : sfxGainNode;
    var source = context.createBufferSource(); 
    
    // LOOP IF LOOP ATTRIBUTE IS TRUE
    if( loop ) source.loop = true;
    
    source.buffer = bufferMap[id];  
    source.connect(gainNode);
    
    //source.start(0);
    source.noteOn(0);
    
    return source;
  };
    
  controller.playEmptyAudio = function(){
    if( context === null ) return;
    
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    
    // connect to output (your speakers)
    source.connect(context.destination);
    
    // play the file
    source.noteOn(0);
  }
  
  /**
   * Plays a background music.
   * 
   * @param {String} id
   */
  controller.playMusic = function( id ){
    if( context === null ) return;
    
    // STOP EXISTING BACKGROUND SOUND
    if( currentMusic ){
      currentMusic.noteOff(0);
      currentMusic.disconnect(0);
    }
    
    if( bufferMap[id] ) currentMusic = controller.playSound(id, true, true );
  };
  
});
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
/**
 * X coordinate of the cursor.
 */
controller.mapCursorX = 0;

/**
 * Y coordinate of the cursor.
 */
controller.mapCursorY = 0;

/**
 *
 */
controller.resetMapCursor = function(){
  controller.mapCursorX = 0;
  controller.mapCursorY = 0;
};

/**
 *
 * @param isCancel if true then it is a cancel action
 */
controller.cursorAction = function( isCancel ){
  
  // BREAK IF YOU ARE IN THE ANIMATION PHASE
  if( controller.inAnimationHookPhase() ) return;
  
  var bstate = controller.stateMachine.state;
  var bfocus = ( bstate === "MOVEPATH_SELECTION" ||
                bstate === "IDLE_R" ||
                bstate === "ACTION_SELECT_TARGET_A" ||
                bstate === "ACTION_SELECT_TARGET_B" );
  
  // INVOKE ACTION
  if( isCancel ){
    controller.stateMachine.event("cancel", controller.mapCursorX, controller.mapCursorY );
  }
  else{
    if( controller.menuCursorIndex !== -1 ){
      controller.stateMachine.event( "action",controller.menuCursorIndex );
    }
    else {
      controller.stateMachine.event( "action", controller.mapCursorX, controller.mapCursorY );
    }
  }
  
  var astate = controller.stateMachine.state;
  var afocus = ( astate === "MOVEPATH_SELECTION" ||
                astate === "IDLE_R" ||
                astate === "ACTION_SELECT_TARGET_A" ||
                astate === "ACTION_SELECT_TARGET_B"  );
  
  // RERENDERING
  if( ( bfocus && !afocus ) || afocus ){
    view.markSelectionMapForRedraw( controller.stateMachine.data );
  }
  
  // MENU
  if( astate === "ACTION_MENU" || astate === "ACTION_SUBMENU" ){
    
    var menu = controller.stateMachine.data.menu;
    controller.showMenu(
      menu,
      controller.mapCursorX,
      controller.mapCursorY
    );
  }
  else{
    if( bstate === "ACTION_MENU" || bstate === "ACTION_SUBMENU" ) controller.hideMenu();
  }
};

/**
 *
 */
controller.cursorActionCancel = function(){
  controller.cursorAction(true);
  controller.playSound("CANCEL");
};

/**
 *
 */
controller.cursorActionClick = function(){
  controller.cursorAction(false);
  controller.playSound("ACTION");
};

/**
 *
 * @param dir
 * @param len
 */
controller.moveCursor = function( dir, len ){
  if( arguments.length === 1 ) len = 1;
  
  var x = controller.mapCursorX;
  var y = controller.mapCursorY;
  
  switch( dir ){
    case model.MOVE_CODE_UP    : y--; break;
    case model.MOVE_CODE_RIGHT : x++; break;
    case model.MOVE_CODE_DOWN  : y++; break;
    case model.MOVE_CODE_LEFT  : x--; break;
  }
  
  controller.setCursorPosition(x,y);
};


/**
 * Moves the cursor to a given position. The view will be moved as well with
 * this function to make sure that the cursor is on the visible view.
 *
 * @param tx
 * @param ty
 */
controller.setCursorPosition = function( x,y,relativeToScreen ){  
  if( controller.isMenuOpen() ) return;
  
  if( relativeToScreen ){
    x = x + controller.screenX;
    y = y + controller.screenY;
  }
  
  //if( CLIENT_DEBUG ){
  if( !model.isValidPosition(x,y) ){
    //util.illegalPositionError();
    return ; // TODO
  }
  //}
  
  if( x === controller.mapCursorX && y === controller.mapCursorY ) return;
  
  // CLEAN OLD
  view.markForRedraw( controller.mapCursorX, controller.mapCursorY );
  if( controller.mapCursorY < model.mapHeight -1 ) view.markForRedraw( controller.mapCursorX, controller.mapCursorY+1 );
  
  controller.playSound("MAPTICK");
  view.markForRedraw( controller.mapCursorX, controller.mapCursorY );
  
  controller.mapCursorX = x;
  controller.mapCursorY = y;
  
  var scale = controller.screenScale;  
  if( scale === 0 ) scale = 0.8;
  else if( scale === -1 ) scale = 0.7;
  
  var scw = parseInt( parseInt( window.innerWidth/16,10 ) / scale ,10 );
  var sch = parseInt( parseInt( window.innerHeight/16,10 ) / scale ,10 );
  
  var moveCode = -1;
  if( x-controller.screenX <= 1 )          moveCode = model.MOVE_CODE_LEFT;
  else if( x-controller.screenX >= scw-1 ) moveCode = model.MOVE_CODE_RIGHT;
  else if( y-controller.screenY <= 1 )     moveCode = model.MOVE_CODE_UP;
  else if( y-controller.screenY >= sch-1 ) moveCode = model.MOVE_CODE_DOWN;
  
  if( moveCode !== -1 ){
    controller.shiftScreenPosition( moveCode, 5 );
  }
  
  if( DEBUG ){
    util.log(
      "set cursor position to",
      x,y,
      "screen node is at",
      controller.screenX,controller.screenY
    );
  }
  
  view.markForRedraw( x,y );
};
util.scoped(function(){
  
  var activeHock = null;
  var hasHocks = false;
  var savedDelta = 0;
  
  function tryToPopNextHook(){
    
    // CHECK HOOKS
    if( !view.hooksBuffer.isEmpty() ){
      hasHocks = true;
      var data = view.hooksBuffer.pop();
      var key = data[data.length-1];
      activeHock = view.animationHooks[ key ];
      activeHock.prepare.apply( activeHock, data );
    }
    else hasHocks = false;
  }
  
  /**
   * 
   */
  controller.prepareGameLoop = function(){
    savedDelta = 0;
  }
  
  /**
   * 
   * @param {type} delta
   * @returns {undefined}
   */
  controller.gameLoop = function( delta ){
    savedDelta += delta; // SAVE DELTAS FOR UPDATE LOGIC ( --> TURN TIMER AND SO ON )
    
    controller.updateInputCoolDown( delta );
    
    var inMove = (controller.moveScreenX !== 0 || controller.moveScreenY !== 0);
    
    // IF SCREEN IS IN MOVEMENT THEN UPDATE THE MAP SHIFT
    if( inMove ) controller.solveMapShift();
    // ELSE UPDATE THE LOGIC
    else{
      
      // IF MESSAGE PANEL IS VISIBLE THEN BREAK PROCESS UNTIL
      // IT CAN BE HIDDEN
      if( view.hasInfoMessage() ){
        view.updateMessagePanelTime(delta);
      }
      else{
        
        // IF NO HOCKS ARE IN THE BUFFER THEN UPDATE THE LOGIC
        if( !hasHocks ){
          
          // UPDATE LOGIC
          controller.updateState( savedDelta );
          savedDelta = 0;
          
          // CHECK HOOKS
          tryToPopNextHook();
        }
        // ELSE EVALUATE ACTIVE HOCK
        else{
          activeHock.update(delta);
          if( activeHock.isDone() ) tryToPopNextHook();
        }
      }
      
      // UPDATE SPRITE ANIMATION
      view.updateSpriteAnimations( delta );
    }
    
    // RENDER SCREEN
    if( view.drawScreenChanges > 0 ) view.renderMap( controller.screenScale );
    
    // RENDER ACTIVE HOCK AND POP NEXT ONE WHEN DONE
    if( hasHocks ){
      activeHock.render();
    }
    else{
      
      // UPDATE SELECTION CURSOR
      if( controller.stateMachine.state === "ACTION_SELECT_TILE" ){
        
        var r = view.selectionRange;
        var x = controller.mapCursorX;
        var y = controller.mapCursorY;
        var lX;
        var hX;
        var lY = y-r;
        var hY = y+r;
        if( lY < 0 ) lY = 0;
        if( hY >= model.mapHeight ) hY = model.mapHeight-1;
        for( ; lY<=hY; lY++ ){
          
          var disY = Math.abs( lY-y );
          lX = x-r+disY;
          hX = x+r-disY;
          if( lX < 0 ) lX = 0;
          if( hX >= model.mapWidth ) hX = model.mapWidth-1;
          for( ; lX<=hX; lX++ ){
            
            view.markForRedraw(lX,lY);
          }
        }
      }
    }
    
  };
  
  controller.inAnimationHookPhase = function(){
    return hasHocks;
  };
  
});
/**
 * 
 */
view.hooksBuffer = util.createRingBuffer(50);

/**
 * Contains all registered animation hacks.
 */
view.animationHooks = {};

/**
 * 
 * @param {type} impl
 */
view.registerAnimationHook = function(  impl ){
  var key = impl.key;
  
  if( view.animationHooks.hasOwnProperty(key) ){
    util.raiseError("animation algorithm for",key,"is already registered");
  }
  
  view.animationHooks[ key ] = impl;
  
  // REGISTER LISTENER
  model[key].listenCommand(function(){
    var data = [];
    
    for( var i=0,e=arguments.length; i<e; i++ ) data[i] = arguments[i];
    data[data.length] = key;

    view.hooksBuffer.push( data );
  });
  
  impl.isEnabled = true;
};
/** @constant */
view.IMAGE_CODE_IDLE          = "IDLE";

/** @constant */
view.IMAGE_CODE_IDLE_INVERTED = "IDLE_R";

/** @constant */
view.IMAGE_CODE_RIGHT         = "RIGHT";

/** @constant */
view.IMAGE_CODE_LEFT          = "LEFT";

/** @constant */
view.IMAGE_CODE_UP            = "UP";

/** @constant */
view.IMAGE_CODE_DOWN          = "DOWN";

/** @constant */
view.IMAGE_CODE_STATELESS     = "STATELESS";

/** @constant */
view.COLOR_RED                = "RED";

/** @constant */
view.COLOR_GREEN              = "GREEN";

/** @constant */
view.COLOR_BLUE               = "BLUE";

/** @constant */
view.COLOR_YELLOW             = "YELLOW";

/** @constant */
view.COLOR_BLACK_MASK         = "BLACK_MASK";

/** @constant */
view.COLOR_NEUTRAL            = "GRAY";

/** @constant */
view.COLOR_NONE               = "NONE";

/** @constant */
view.IMG_COLOR_MAP_PROPERTIES_ID = "IMG_MAP_PROPERTY";

/** @constant */
view.IMG_COLOR_MAP_UNITS_ID = "IMG_MAP_UNIT";

/** Contains all stateless commands. */
view.CodeStatelessview    = {
  RED:{}, 
  BLUE:{}, 
  YELLOW: {}, 
  GREEN:{},
  BLACK_MASK:{},
  NONE:{}, 
  GRAY:{}
};

view.overlayImages = {};

view.animatedTiles = {};

/** Contains all idle commands. */
view.CodeIdleview         = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all inverted idle commands. */
view.CodeIdleInvertedview = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeRightview        = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeLeftview         = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeUpview           = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeDownview         = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/**
 * Registers an image for an object type.
 *
 * @param image
 * @param type
 * @param state
 * @param color
 */
view.setImageForType = function( image, type, state, color ){

  // DEFAULT VALUES
  if( state === undefined ) state = view.IMAGE_CODE_STATELESS;
  if( color === undefined ) color = view.COLOR_NONE;

  // WHICH CODE
  switch( state ){

    case view.IMAGE_CODE_IDLE :
      view.CodeIdleview[color][type]         = image;
      break;

    case view.IMAGE_CODE_STATELESS :
      view.CodeStatelessview[color][type]    = image;
      break;

    case view.IMAGE_CODE_IDLE_INVERTED :
      view.CodeIdleInvertedview[color][type] = image;
      break;

    case view.IMAGE_CODE_LEFT :
      view.CodeLeftview[color][type]         = image;
      break;

    case view.IMAGE_CODE_RIGHT :
      view.CodeRightview[color][type]        = image;
      break;

    case view.IMAGE_CODE_DOWN :
      view.CodeDownview[color][type]         = image;
      break;

    case view.IMAGE_CODE_UP :
      view.CodeUpview[color][type]           = image;
      break;

    default: util.raiseError("unknown image state code ",state );
  }
};

view.setUnitImageForType = view.setImageForType;

view.setPropertyImageForType = function( image, type, color ){
  view.setImageForType( image, type, view.IMAGE_CODE_STATELESS, color );
};

view.setTileImageForType = function( image, type ){
  view.setImageForType(
    image, type,
    view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

view.setInfoImageForType = function( image, type ){
  view.setImageForType(
    image, type,
    view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

/**
 * Returns the html image object for the given object type in the given color
 * shema and state.
 *
 * @param type
 * @param code
 * @param color
 */
view.getImageForType = function( type, code, color ){
  switch( code ){

    case view.IMAGE_CODE_IDLE :
      return view.CodeIdleview[color][type];

    case view.IMAGE_CODE_IDLE_INVERTED :
      return view.CodeIdleInvertedview[color][type];

    case view.IMAGE_CODE_LEFT :
      return view.CodeLeftview[color][type];

    case view.IMAGE_CODE_RIGHT :
      return view.CodeRightview[color][type];

    case view.IMAGE_CODE_DOWN :
      return view.CodeDownview[color][type];

    case view.IMAGE_CODE_UP :
      return view.CodeUpview[color][type];

    case view.IMAGE_CODE_STATELESS :
      return view.CodeStatelessview[color][type];

    default: util.raiseError("unknown image state code ",code );
  }
};

/**
 * Returns the html image/canvas object for the given unit type in the given color
 * shema and state.
 *
 * @param type
 * @param code
 * @param color
 */
view.getUnitImageForType = view.getImageForType;

/**
 * Returns the html image/canvas object for the given property type in the
 * given color shema.
 *
 * @param type
 * @param color
 */
view.getPropertyImageForType = function( type, color ){
  return view.getImageForType( type, view.IMAGE_CODE_STATELESS, color );
};

/**
 * Returns the html image/canvas object for the given tile type in the
 * given color shema.
 *
 * @param type
 */
view.getTileImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

/**
 * Returns the html image/canvas object for the given info image type in the
 * given color shema.
 *
 * @param type
 */
view.getInfoImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};
controller.inputCoolDown = 0;

controller.updateInputCoolDown = function( delta ){
  controller.inputCoolDown -= delta;
  if( controller.inputCoolDown < 0 ) controller.inputCoolDown = 0;
}
/**
 * Map of used map images.
 */
view.mapImages = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

util.scoped(function(){
  
  function checkTileForConnection( x,y, index, data, cKeys ){
    if( x < 0 || y < 0 ||
       x >= model.mapWidth || y >= model.mapWidth ){
      
      data[index] = "_";
      return;
    }
    
    var short = cKeys[ model.map[x][y].ID ];
    if( short === undefined ) short = "";
    data[index] = short;
  };
  
  function getTileTypeForConnection( data, check, cross, type ){
    for( var i=0,e=data.length; i<e; i++ ){
      var toCheck = data[i];
      
      // CROSS
      if( toCheck[1] !== "" && toCheck[1] !== check[0] ) continue;
      if( toCheck[2] !== "" && toCheck[2] !== check[1] ) continue;
      if( toCheck[3] !== "" && toCheck[3] !== check[2] ) continue;
      if( toCheck[4] !== "" && toCheck[4] !== check[3] ) continue;
      
      // EDGES
      if( !cross ){
        if( toCheck[5] !== "" && toCheck[5] !== check[4] ) continue;
        if( toCheck[6] !== "" && toCheck[6] !== check[5] ) continue;
        if( toCheck[7] !== "" && toCheck[7] !== check[6] ) continue;
        if( toCheck[8] !== "" && toCheck[8] !== check[7] ) continue;
      }
      
      return toCheck[0];
    }
    
    return type;
  };
  
  /**
   *
   */
  view.updateMapImages = function(){
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var check = checkTileForConnection;
    var resultCheck = getTileTypeForConnection;
    var sdata = [];
    
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        
        var lX = x;
        var lY = y;
        
        // DO MAGIC HERE
        var tile = model.map[lX][lY].ID;
        if( model.graphics.connected[tile] ){
          
          var cKeys = model.graphics.connectedKeys[tile];
          if( model.graphics.connected[tile][0].length === 5 ){
            
            // ----------------------------
            check( x,y-1, 0, sdata, cKeys );
            check( x+1,y, 1, sdata, cKeys );
            check( x,y+1, 2, sdata, cKeys );
            check( x-1,y, 3, sdata, cKeys );
            
            view.mapImages[x][y] = resultCheck( 
              model.graphics.connected[tile], 
              sdata,
              true,
              tile
            );
          }
          else{
            
            // ----------------------------
            check( x  ,y-1, 0, sdata, cKeys );
            check( x+1,y-1, 1, sdata, cKeys );
            check( x+1,y  , 2, sdata, cKeys );
            check( x+1,y+1, 3, sdata, cKeys );
            check( x  ,y+1, 4, sdata, cKeys );
            check( x-1,y+1, 5, sdata, cKeys );
            check( x-1,y  , 6, sdata, cKeys );
            check( x-1,y-1, 7, sdata, cKeys );
            
            view.mapImages[x][y] = resultCheck( 
              model.graphics.connected[tile], 
              sdata,
              false,
              tile
            );
          }
        }
        else view.mapImages[lX][lY] = tile;
      }
    }
  };
  
});
util.scoped(function(){

  /**
   * @param {type} el
   * @param {type} index
   * @private
   */
  function connectMenuListener( el, index ){
    
    /*
    el.onclick = function(){
      if( DEBUG ){
        util.log("menu action will be triggered");
      }
      
      controller.cursorActionClick();
    };
    */
    
    el.onmouseover = function(){
      controller.setMenuIndex( index );
    };
  };
  
  /** @private */
  var menuRenderer = {};
  
  var menuElement = document.getElementById( ID_ELMT_MENU );
  
  var menuHeaderElement = document.getElementById( ID_ELMT_MENU_HEADER );
  
  var menuEntryContentElement = document.getElementById( ID_ELMT_MENU_CONTENT );
  
  var menuEntryListElement = document.getElementById( ID_ELMT_MENU_ENTRIES );
  
  /**
   *
   */
  controller.menuPosX = -1;  
  
  /**
   *
   */
  controller.menuPosY = -1;
  
  /**
   * Index of the current selected menu entry.
   */
  controller.menuCursorIndex = -1;
  
  /**
   *
   */
  controller.resetMenuCursor = function(){
    controller.menuCursorIndex = 0;
  };
  
  controller.setMenuIndex = function( index ){
    controller.playSound("MENUTICK");
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "";    
    controller.menuCursorIndex = index;  
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
  };
  
  /**
   *
   */
  controller.increaseMenuCursor = function(){
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
    
    controller.menuCursorIndex++;
    if( controller.menuCursorIndex === controller.stateMachine.data.menu.size ){
      controller.menuCursorIndex--;
    }
    else controller.playSound("MENUTICK");
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
    menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
  };
  
  /**
   *
   */
  controller.decreaseMenuCursor = function(){
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
    
    controller.menuCursorIndex--;
    if( controller.menuCursorIndex < 0 ) controller.menuCursorIndex = 0;
    else controller.playSound("MENUTICK");
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
    menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
  };
  
  /**
   * 
   * @param {type} menu
   * @param {type} size
   * @param {type} x
   * @param {type} y
   */
  controller.showMenu = function( menu, x, y ){
    if( DEBUG ){ util.log("opening GUI menu"); }
    
    var tileSize = TILE_LENGTH*controller.screenScale;
    
    var renderer = menuRenderer["__mainMenu__"];
    if( controller.stateMachine.state === "ACTION_SUBMENU" ){
      var newRend = menuRenderer[ controller.stateMachine.data.action ];
      if( newRend ) renderer = newRend;
    }
    
    if( arguments.length === 1 ){
      x = controller.menuPosX;
      y = controller.menuPosY;
    }
    
    if( !model.isValidPosition(x,y) ) util.raiseError("invalid menu position");
    
    var entries = menuEntryListElement.children;
    
    // HIDE THEM
    for( var i=0,e=entries.length; i<e; i++ ){
      entries[i].style.display = "none";
    }
    
    // SHOW THEM
    for( var i=0,e=menu.size; i<e; i++ ){
      var entry;
      
      if( entries.length > i ){
        entries[i].className = "";
        entry = entries[i].children[0];
      }
      else{
        
        // PERFORMANCE HIT ?
        entry = document.createElement("button");
        connectMenuListener( entry, i );
        var li = document.createElement("li");
        li.appendChild( entry );
        menuEntryListElement.appendChild( li );
      }
      
      renderer( menu.data[i], entry, i );
      // entry.innerHTML = util.i18n_localized( menu[i] );
      
      entries[i].style.display = "";
    }
    
    // RELATIVE SCREEN POS
    x = x - controller.screenX;
    y = y - controller.screenY;
    
    // CACHE POSITION
    controller.menuPosX = x;
    controller.menuPosY = y;
    
    controller.menuCursorIndex = 0;
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
    menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
    
    // SET MENU STYLE
    var menuStyle = menuElement.style;
    menuStyle.zIndex = -1;
    menuStyle.display = "block";
    menuStyle.left = parseInt( ((window.innerWidth/2) - (menuElement.offsetWidth/2)), 10 )+"px";
    menuStyle.top = parseInt( ((window.innerHeight/2) - (menuElement.offsetHeight/2)), 10 )+"px";
    menuStyle.zIndex = 9;
    
    controller.setMenuIndex( 0 );
  };
  
  /**
   *
   */
  controller.hideMenu = function(){
    if( DEBUG ){ util.log("closing GUI menu"); }
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
    
    menuElement.style.display = "none";
    controller.menuCursorIndex = -1;
  };
  
  controller.isMenuOpen = function(){
    return menuElement.style.display === "block";
  };
  
  controller.registerMenuRenderer = function( key, renderer ){
    if( menuRenderer.hasOwnProperty( key ) ){
      util.raiseError("renderer for",key,"is already registered");
    }
    
    menuRenderer[ key ] = renderer;
  };
  
});
util.scoped(function(){
  
  var panel = document.getElementById("cwt_info_box");
  var contentDiv = document.getElementById("cwt_info_box_content");
  
  var DEFAULT_MESSAGE_TIME = 1000;
  var timeLeft;
  
  view.updateMessagePanelTime = function(delta){
    if( timeLeft > 0 ){
      timeLeft -= delta;
      if( timeLeft < 0 ){
        panel.className = "tooltip out";
      }
    }
  };
  
  view.hasInfoMessage = function(){
    return timeLeft > 0;
  };
  
  view.showInfoMessage = function( msg, time ){
    if( arguments.length === 1 ) time = DEFAULT_MESSAGE_TIME;
    
    // panel.innerHTML = msg;
    contentDiv.innerHTML = msg;
    
    panel.className = "tooltip active";
    panel.style.position = "absolute";
    panel.style.left = parseInt( ((window.innerWidth/2) - (panel.offsetWidth/2)), 10 )+"px";
    panel.style.top = parseInt( ((window.innerHeight/2) - (panel.offsetHeight/2)), 10 )+"px";
    
    timeLeft = time;
  };
  
});
controller.isNetworkGame = function(){ 
  return false; 
}
  
/*

controller._incomingMessage = function( msg ){
  network.parse( msg );
};

controller._gameId   = -1;
controller._clientId = -1;
controller._target   = null;

controller.send = function( obj ){
  var msg = JSON.stringify( obj );

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET',
    network._target+"?cmd=pushCmd&gameId="+
                network._gameId+"&userId="+network._clientId+"&gamedata="+msg,
    true
  );
  xmlHttp.onreadystatechange = function () {};
  xmlHttp.send(null);
};

controller.isNetworkGame = function(){
  return network._gameId !== -1;
};

controller._testHoster = function(  ){
  network._target = "http://localhost:8080";

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET',
    network._target+"?cmd=createGame",
    true
  );

  xmlHttp.onreadystatechange = function () {

    if( xmlHttp.readyState == 4 ){
      var res = xmlHttp.responseText;
      util.logInfo( "RESPONSE: "+ res );

      var params = {};
      var data = res.split("&");
      for( var i=0,e=data.length; i<e; i++ ){

        var sData = data[i].split("=");
        params[ sData[0] ] = sData[1];
      }

      network._testClient( params.gid );
    }
  };
  xmlHttp.send(null);
};

controller._testClient = function( gameId ){
  network._target = "http://localhost:8080";

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET',
    network._target+"?cmd=addClient&gameId="+gameId,
    true
  );

  xmlHttp.onreadystatechange = function () {

    if( xmlHttp.readyState == 4 ){
      var res = xmlHttp.responseText;
      util.logInfo( "RESPONSE: "+ res );

      var params = {};
      var data = res.split("&");
      for( var i=0,e=data.length; i<e; i++ ){

        var sData = data[i].split("=");
        params[ sData[0] ] = sData[1];
      }

      network._gameId = gameId;
      network._clientId = params.uid;

      network._startTimer();
    }
  };
  xmlHttp.send(null);
};

controller._startTimer = function(){

  function look(){

    if( network.connected() ){

      var target = network._target+"?cmd=getCmds&gameId="+network._gameId+
        "&userId="+network._clientId;

      util.logInfo( "REQUEST ==> "+ target );

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET',
        target,
        true
      );
      //xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=encoding');
      xmlHttp.onreadystatechange = function () {

        if( xmlHttp.readyState == 4 ){
          var res = xmlHttp.responseText;

          if( res !== "" ){

            var data = res.split("_&_");
            util.logInfo( "RESPONSE COMMANDS ==> "+ data );

            for( var i=0,e=data.length; i<e; i++ ){

              if( data[i] !== undefined && data[i].length > 0 ) network._incomingMessage( data[i] );
            }

          }

          setTimeout( look, 5000 );
        }
      };
      xmlHttp.send(null);
    }
  }

  look();
};

 */
/**
 * Status map with status information for the unit objects.
 * 
 * @private
 */
controller.unitStatusMap = util.list( CWT_MAX_UNITS_PER_PLAYER*CWT_MAX_PLAYER, function(){
  return {
    HP_PIC: null,
    LOW_AMMO:false,
    LOW_FUEL:false,
    HAS_LOADS:false,
    CAPTURES: false,
    CLIENT_VISIBLE: false
  };
});

/**
 * 
 * @param {type} unit
 */
controller.getUnitStatusForUnit = function( unit ){
  var id = model.extractUnitId(unit);
  return controller.unitStatusMap[id];
};

controller.inVision_ = function( x,y, pid,tid ){
  if( !model.isValidPosition(x,y) ) return false;
  
  var unit = model.unitPosMap[x][y];
  return ( 
    unit !== null &&
    ( unit.owner === pid || model.players[ unit.owner ].team == tid )
  );
};

/**
 * 
 * @param {type} uid
 */
controller.updateUnitStatus = function( uid ){
  var unit = model.units[uid];
  var x = unit.x;
  var y = unit.y;
  var unitStatus = controller.unitStatusMap[uid];
  var uSheet = unit.type;
  
  // LOW AMMO ?
  var cAmmo = unit.ammo;
  var mAmmo = uSheet.ammo;
  if( cAmmo <= parseInt(mAmmo*0.25, 10) ) unitStatus.LOW_AMMO = true;
  else                                    unitStatus.LOW_AMMO = false;
  if( mAmmo === 0 )                       unitStatus.LOW_AMMO = false;
  
  // LOW FUEL
  var cFuel = unit.fuel;
  var mFuel = uSheet.fuel;
  if( cFuel < parseInt(mFuel*0.25, 10) ) unitStatus.LOW_FUEL = true;
  else                                   unitStatus.LOW_FUEL = false;
  
  // HP PICTURE
  var num = -1;
  if( unit.hp <= 90 ){
    num = parseInt( unit.hp/10 , 10 )+1;
  }
  
  switch ( num ){
    case 1: unitStatus.HP_PIC = view.getInfoImageForType("HP_1"); break;
    case 2: unitStatus.HP_PIC = view.getInfoImageForType("HP_2"); break;
    case 3: unitStatus.HP_PIC = view.getInfoImageForType("HP_3"); break;
    case 4: unitStatus.HP_PIC = view.getInfoImageForType("HP_4"); break;
    case 5: unitStatus.HP_PIC = view.getInfoImageForType("HP_5"); break;
    case 6: unitStatus.HP_PIC = view.getInfoImageForType("HP_6"); break;
    case 7: unitStatus.HP_PIC = view.getInfoImageForType("HP_7"); break;
    case 8: unitStatus.HP_PIC = view.getInfoImageForType("HP_8"); break;
    case 9: unitStatus.HP_PIC = view.getInfoImageForType("HP_9"); break;
    default: unitStatus.HP_PIC = null;
  }
  
  // HAS LOADS ?
  if( uSheet.transport ){
    if( !model.hasLoadedIds( uid ) ){
      unitStatus.HAS_LOADS = false;
    }
    else unitStatus.HAS_LOADS = true;
  }
  
  // CAPTURES ?
  if( unit.x >= 0 ){
    var property = model.propertyPosMap[ unit.x ][ unit.y ];
    if( property !== null && property.capturePoints < 20 ){
      unitStatus.CAPTURES = true;
    }
    else unitStatus.CAPTURES = false;
  }
  
  // VISIBLE FOR CLIENT ?
  unitStatus.CLIENT_VISIBLE = false;
  var tpid = model.turnOwner;
  var ttid = model.players[tpid].team;
  var inVis = controller.inVision_;
  
  if( inVis( x-1,y, tpid,ttid ) || 
     inVis( x,y-1, tpid,ttid ) || 
     inVis( x,y+1, tpid,ttid ) || 
     inVis( x+1,y, tpid,ttid ) ){
    
    unitStatus.CLIENT_VISIBLE = true;
  }
};
controller.mapAction({

  key:"options",  
  hasSubMenu: true,
  
  condition: function( data ){
    var unit = data.source.unit;
    if( unit !== null && unit.owner === model.turnOwner && model.canAct( data.source.unitId) ) return false;
       
    var property = data.source.property;
    if( property !== null && property.type.builds ) return false;
    
    return true;
  },
  
  prepareMenu: function( data ){
    data.menu.addEntry("options.sfx");
    data.menu.addEntry("options.music");
    data.menu.addEntry("options.yield");
  },
  
  invoke: function( data ){
    var cmd = data.action.selectedSubEntry;
    switch( cmd ){
        
      case "options.sfx":
        if( controller.getSfxVolume() > 0 ) controller.setSfxVolume(0);
        else controller.setSfxVolume(1);
        break;
        
      case "options.music":
        if( controller.getMusicVolume() > 0 ) controller.setMusicVolume(0);
        else controller.setMusicVolume(1);
        break;
        
      case "options.yield":
        controller.endGameRound();
        break;
    }
  }
  
});
/**
 * Indicates that the view needs to be redrawn.
 * (in future the value will be true|false)
 */
view.drawScreenChanges = 0;

/**
 *
 */
view.drawScreen = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, false );

/**
 * Marks a position for re-rendering.
 *
 * @param x
 * @param y
 */
view.markForRedraw = function( x,y ){
  if( x >= 0 && y >= 0 && x < model.mapWidth && y < model.mapHeight ){

    if( view.drawScreen[x][y] === true ) return;

    view.drawScreen[x][y] = true;
    view.drawScreenChanges++;

    // check bottom tile
    y++;
    if( y < model.mapHeight ){
      if( model.propertyPosMap[x][y] !== null ) view.markForRedraw(x,y);
      // else if( view.overlayImages[ model.map[x][y]] === true ){
      else if( view.overlayImages[ view.mapImages[x][y] ] === true ){
        view.markForRedraw(x,y);
      }
    }
  }
  else util.raiseError("illegal arguments ",x,",",y," -> out of view bounds");
};

/**
 * Rerenders a tile and all neightbours in a range around it.
 *
 * @example
 *
 * r = 2;
 *
 *      x
 *    x x x
 *  x x o x x
 *    x x x
 *      x
 *
 * @param x
 * @param y
 */
view.markForRedrawRange = function( x,y,r ){

  var lX;
  var hX;
  var lY = y-r;
  var hY = y+r;
  if( lY < 0 ) lY = 0;
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){

    var disY = Math.abs( lY-y );
    lX = x-r+disY;
    hX = x+r-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){

      view.markForRedraw(lX,lY);
    }
  }
};

/**
 * Rerenders a tile and all 4 neightbours in a plus around it.
 *
 * @example
 *    x
 *  x o x
 *    x
 *
 * @param x
 * @param y
 */
view.markForRedrawWithNeighbours = function( x,y ){

  if( y>0 ) view.markForRedraw(x,y-1);
  if( x>0 ) view.markForRedraw(x-1,y);
            view.markForRedraw(x,y);
  if( y< model.mapHeight-1 ) view.markForRedraw(x,y+1);
  if( x< model.mapWidth-1 )  view.markForRedraw(x+1,y);
};

/**
 * Rerenders a tile and all 8 neightbours around it.
 *
 * @example
 *  x x x
 *  x o x
 *  x x x
 *
 * @param x
 * @param y
 */
view.markForRedrawWithNeighboursRing = function( x,y ){
  var gW = model.mapWidth;
  var gH = model.mapHeight;

  // LEFT COLUMN
  if( x>0 ){
    if( y>0 )     view.markForRedraw(x-1,y-1);
    view.markForRedraw(x-1,y);
    if( y< gH-1 ) view.markForRedraw(x-1,y+1);
  }

  // MIDDLE COLUMN
  if( y>0 )       view.markForRedraw(x,y-1);
  view.markForRedraw(x,y);
  if( y< gH-1 )   view.markForRedraw(x,y+1);

  // RIGHT COLUMN
  if( x< gW-1 ){
    if( y>0 )     view.markForRedraw(x+1,y-1);
    view.markForRedraw(x+1,y);
    if( y< gH-1 ) view.markForRedraw(x+1,y+1);
  }
};

/**
 * Invokes a complete redraw of the view.
 */
view.completeRedraw = function(){
  view.drawScreenChanges = 1;
  for(var x=0,xe=model.mapWidth; x<xe; x++){
    for(var y=0,ye=model.mapHeight; y<ye; y++){
      view.drawScreen[x][y] = true;
    }
  }
};

/**
 * 
 */
view.markSelectionMapForRedraw = function( scope ){
  var cx = scope.selection.centerX;
  var cy = scope.selection.centerY;
  var data = scope.selection.data;

  for( var x=0;x<data.length; x++ ){
    var sMap = data[x];
    for( var y=0;y<sMap.length; y++ ){
      if( sMap[y] !== -1 ) view.markForRedraw( cx+x, cy+y );
    }
  }
};
/**
 *
 */
controller.screenElement = document.getElementById("cwt_canvas");

/**
 * Screen position on x axis.
 *
 * @example read_only
 */
controller.screenX = 0;

/**
 * Screen position on y axis.
 *
 * @example read_only
 */
controller.screenY = 0;

/**
 * Screen width in tiles.
 *
 * @example read_only
 */
controller.screenWidth = -1;

/**
 * Screen height in tiles.
 *
 * @example read_only
 */
controller.screenHeight = -1;

/**
 *
 */
controller.screenScale = 1;

/**
 * Screen movement on x axis.
 * If this variable is lower zero, the screen will move left a bit
 * in every update step until it reaches zero. If the value is
 * greater zero it will move right.
 */
controller.moveScreenX = 0;

/**
 * Screen movement on y axis.
 * If this variable is lower zero, the view will move up a bit
 * in every update step until it reaches zero. If the value is
 * greater zero it will move down.
 */
controller.moveScreenY = 0;

/**
 *
 * @param scale
 * @throws Error if the screen scale is not an integer
 */
controller.setScreenScale = function( scale ){
  if( scale < -1 || scale > 3 ){
    return;
  }
  
  controller.screenScale = scale;
  
  // INVOKES SCALING TRANSITION
  controller.screenElement.className = "scale"+scale;
  
  if( scale === 0 ) scale = 0.8;
  else if( scale === -1 ) scale = 0.7;
  
  // TODO: UPDATE SCREEN PARAMETERS
  var tileLen = TILE_LENGTH*scale;
  controller.screenWidth  = parseInt( window.innerWidth/  tileLen, 10 );
  controller.screenHeight = parseInt( window.innerHeight/ tileLen, 10 );
  
  controller.setScreenPosition(
    controller.screenX,
    controller.screenY,
    false
  );
};

/**
 *
 * @param x x coordinate
 * @param y y coordinate
 * @param centerIt if true, the screen position will be set to a position
 *                 that makes the given position x,y the center of the screen.
 */
controller.setScreenPosition = function( x,y, centerIt ){
  
  controller.screenX = x;
  controller.screenY = y;
  
  var style = controller.screenElement.style;
  var scale = controller.screenScale;
  var left = -( controller.screenX * TILE_LENGTH * scale );
  var top = -( controller.screenY * TILE_LENGTH * scale );
  
  switch( scale ){
      
    case 2:
      left += controller.screenElement.width/2;
      top += controller.screenElement.height/2;
      break;
      
    case 3:
      left += controller.screenElement.width;
      top += controller.screenElement.height;
      break;
  }
  
  style.position = "absolute";
  style.left = left+"px";
  style.top = top+"px";
};

/**
 * Shifts the screen into a given direction.
 *
 * @param code move code that represents the wanted direction
 * @param len length of tiles that will be shifted into the direction
 *            (default=1)
 */
controller.shiftScreenPosition = function( code, len ){
  if( arguments.length === 1 ) len = 1;
  
  var x = controller.screenX;
  var y = controller.screenY;
  switch( code ){
    case model.MOVE_CODE_DOWN:  y += len; break;
    case model.MOVE_CODE_RIGHT: x += len; break;
    case model.MOVE_CODE_UP:    y -= len; break;
    case model.MOVE_CODE_LEFT:  x -= len; break;
  }
  
  // CORRECT BOUNDS
  if( x < 0 ) x = 0;
  if( y < 0 ) y = 0;
  if( x >= model.mapWidth ) x = model.mapWidth-1;
  if( y >= model.mapHeight ) y = model.mapHeight-1;
  
  controller.setScreenPosition( x,y, false );
};

/**
 * 
 */
view.resizeCanvas = function(){
  var canvEl = controller.screenElement;

  canvEl.width = TILE_LENGTH*model.mapWidth;
  canvEl.height = TILE_LENGTH*model.mapHeight;

  controller.screenWidth  = parseInt( window.innerWidth/  TILE_LENGTH, 10 );
  controller.screenHeight = parseInt( window.innerHeight/ TILE_LENGTH, 10 );
};
var TILE_LENGTH = 16;

/**
 *
 */
controller.baseSize = 16;

/**
 *
 */
view.preventRenderUnit = null;

/**
 *
 */
view.canvasCtx = controller.screenElement.getContext("2d");

/**
 *
 */
view.selectionRange = 2;

/**
 *
 */
view.colorArray = [
  view.COLOR_RED,
  view.COLOR_BLUE,
  view.COLOR_GREEN,
  view.COLOR_YELLOW
];

/**
 *
 * @example this is a god method because it would hit the performance
 *          extremly on non-JIT compatible environments like ios home
 *          screen apps if the single draw parts would be separated.
 * @param scale
 */
view.renderMap = function( scale ){
  var tileSize = TILE_LENGTH;
  var ctx = view.canvasCtx;
  var sx = controller.screenX;
  var sy = controller.screenY;
  var cursx = controller.mapCursorX;
  var cursy = controller.mapCursorY;
  var type;
  var pic;
  var scx;
  var scy;
  var scw;
  var sch;
  var tcx;
  var tcy;
  var tcw;
  var tch;
  var sprStepSel = view.getSpriteStep("SELECTION");
  var sprStepUnit = view.getSpriteStep("UNIT");
  var sprStepProp = view.getSpriteStep("PROPERTY");
  var sprStepStat = view.getSpriteStep("STATUS");
  var sprStepTiles = view.getSpriteStep("ANIM_TILES");
  var BASESIZE = controller.baseSize;
  var teamId = model.players[ model.turnOwner ].team;
  
  var focusExists = (
      controller.stateMachine.state === "MOVEPATH_SELECTION" ||
      controller.stateMachine.state === "ACTION_SELECT_TARGET_A" ||
      controller.stateMachine.state === "ACTION_SELECT_TARGET_B" ||
      controller.attackRangeVisible
  );
  
  var inFreeSelection = ( controller.stateMachine.state === "ACTION_SELECT_TILE" );
  var stmData = controller.stateMachine.data;
  var selection = stmData.selection;
  
  var inShadow;

  // ITERATE BY ROW
  var ye = model.mapHeight-1;
  for(var y = 0; y<=ye; y++){

    // ITERATE BY COLUMN
    var xe = model.mapWidth-1;
    for(var x= 0; x<=xe; x++){

      inShadow = (model.fogData[x][y] === 0);

      // RENDER IF NEEDED
      if( view.drawScreen[x][y] === true ){

        // --------------------------------------------------------------------
        // DRAW TILE

        //type = model.map[x][y];
        type = view.mapImages[x][y];
        pic = view.getTileImageForType( type );

        scx = 0;
        scy = 0;
        
        if( view.animatedTiles[type] ){
          scx += BASESIZE*sprStepTiles;
        }
        
        scw = BASESIZE;
        sch = BASESIZE*2;
        tcx = (x)*tileSize;
        tcy = (y)*tileSize - tileSize;
        tcw = tileSize;
        tch = tileSize*2;

        if( tcy < 0 ){
          scy = scy + BASESIZE;
          sch = sch - BASESIZE;
          tcy = tcy + tileSize;
          tch = tch - tileSize;
        }

        if( pic !== undefined ){
          ctx.drawImage(
            pic,
            scx,scy,
            scw,sch,
            tcx,tcy,
            tcw,tch
          );

          // RENDER GRAY OVERLAY TO MARK AS USED
          /*
          if( inShadow && tch > 16 && view.OVERLAYER[type] === true ){

            pic = view.getTileImageForType( type , view.COLOR_BLACK_MASK );

            ctx.globalAlpha = 0.35;
            ctx.drawImage(
              pic,
              scx,scy,
              scw,sch/2,
              tcx,tcy,
              tcw,tch/2
            );
            ctx.globalAlpha = 1;
          }
          */
        }
        else{
          ctx.fillStyle="rgb(0,0,255)";
          ctx.fillRect( tcx,tcy, tileSize,tileSize );
        }

        // continue;
        // --------------------------------------------------------------------
        // DRAW PROPERTY

        var property = model.propertyPosMap[x][y];
        if( property !== null ){

          var color;
          type = property.type.ID;
          if( property.owner === -1 ){
            color = view.COLOR_NEUTRAL;
          }
          else{
            color = view.colorArray[ property.owner ];
            
            if( property.type.factionSprites ){
              type = property.type.factionSprites[ model.players[property.owner].mainCo.faction ]
            }
          }

          if( inShadow ) color = view.COLOR_NEUTRAL;
          
          pic = view.getPropertyImageForType( type, color );
          scx = 0 + BASESIZE*sprStepProp;
          scy = 0;
          scw = BASESIZE;
          sch = BASESIZE*2;
          tcx = (x)*tileSize;
          tcy = (y)*tileSize - tileSize;
          tcw = tileSize;
          tch = tileSize*2;

          if( tcy < 0 ){
            scy = scy + BASESIZE;
            sch = sch - BASESIZE;
            tcy = tcy + tileSize;
            tch = tch - tileSize;
          }

          if( pic !== undefined ){
            ctx.drawImage(
              pic,
              scx,scy,
              scw,sch,
              tcx,tcy,
              tcw,tch
            );

            // RENDER GRAY OVERLAY TO MARK AS USED
            if( inShadow && tch > 16 && property !== null ){

              pic = view.getPropertyImageForType(
                property.type.ID, view.COLOR_BLACK_MASK
              );

              ctx.globalAlpha = 0.35;
              ctx.drawImage(
                pic,
                scx,scy,
                scw,sch/2,
                tcx,tcy,
                tcw,tch/2
              );
              ctx.globalAlpha = 1;
            }
          }
          else{
            tcx = (x)*tileSize;
            tcy = (y)*tileSize;
            tcw = tileSize;
            tch = tileSize;

            ctx.fillStyle="rgb(0,255,0)";
            ctx.fillRect(
              tcx,tcy,
              tcw,tch
            );
          }
        }

        // --------------------------------------------------------------------
        // DRAW SHADOW

        if( inShadow ){
          tcx = (x)*tileSize;
          tcy = (y)*tileSize;
          tcw = tileSize;
          tch = tileSize;

          ctx.globalAlpha = 0.2;
          ctx.fillStyle="black";
          ctx.fillRect(
            tcx,tcy,
            tcw,tch
          );
          ctx.globalAlpha = 1;
        }

        // --------------------------------------------------------------------
        // DRAW FOCUS
        if( focusExists ){
          pic = view.getInfoImageForType(
            ( controller.stateMachine.state === "MOVEPATH_SELECTION" )? "MOVE_FOC" : "ATK_FOC"
          );

          var value = selection.getValueAt(x,y);
          if( value > 0 ){

            scx = BASESIZE*sprStepSel;
            scy = 0;
            scw = BASESIZE;
            sch = BASESIZE;
            tcx = (x)*tileSize;
            tcy = (y)*tileSize;
            tcw = tileSize;
            tch = tileSize;

            ctx.globalAlpha = 0.65;
            ctx.drawImage(
              pic,
              scx,scy,
              scw,sch,
              tcx,tcy,
              tcw,tch
            );
            ctx.globalAlpha = 1;
          }
        }
        
        // --------------------------------------------------------------------
        // FREE SELCTION WALLS 
        
        if( inFreeSelection ){
          var dis = model.distance( cursx,cursy, x,y );
          if( view.selectionRange === dis ){
            
            var pic = null;
            if( dis === 0 ){
              pic = view.getInfoImageForType("SILO_ALL");
            }
            else {
              if( cursx === x ){
                if( y < cursy ) pic = view.getInfoImageForType("SILO_N");
                else pic = view.getInfoImageForType("SILO_S");
              }
              else if( cursy === y ){
                if( x < cursx ) pic = view.getInfoImageForType("SILO_W");
                else pic = view.getInfoImageForType("SILO_E");
              }
              else{
                if( x < cursx ){
                  if( y < cursy ) pic = view.getInfoImageForType("SILO_NW");
                  else pic = view.getInfoImageForType("SILO_SW");
                }
                else {
                  if( y < cursy ) pic = view.getInfoImageForType("SILO_NE");
                  else pic = view.getInfoImageForType("SILO_SE");
                }
              }
            }
            
            tcx = (x)*tileSize;
            tcy = (y)*tileSize; 
            if( pic !== null ){
              ctx.drawImage(
                pic,
                tcx,tcy
              );
            }
          }
        }

        // --------------------------------------------------------------------
        // DRAW UNIT

        var unit = model.unitPosMap[x][y];
        var stats = (unit !== null )? controller.getUnitStatusForUnit( unit ) : null;
        if( !inShadow && unit !== null && 
           ( !unit.hidden || unit.owner === model.turnOwner || model.players[ unit.owner ].team == teamId ||
              stats.TURN_OWNER_VISIBLE ) ){
          
          if( unit !== view.preventRenderUnit ){
            var color;
            if( unit.owner === -1 ){
              color = view.COLOR_NEUTRAL;
            }
            else{
              color = view.colorArray[ unit.owner ];
            }

            var state = ( unit.owner % 2 === 1 )?
              view.IMAGE_CODE_IDLE : view.IMAGE_CODE_IDLE_INVERTED;

            pic = view.getUnitImageForType( unit.type.ID, state, color );

            scx = (BASESIZE*2)*sprStepUnit;
            scy = 0;
            scw = BASESIZE*2;
            sch = BASESIZE*2;
            tcx = (x)*tileSize-tileSize/2; // TODO fix scale
            tcy = (y)*tileSize-tileSize/2;
            tcw = tileSize+tileSize;
            tch = tileSize+tileSize;

            if( pic !== undefined ){
              ctx.drawImage(
                pic,
                scx,scy,
                scw,sch,
                tcx,tcy,
                tcw,tch
              );

              // RENDER GRAY OVERLAY TO MARK AS USED
              if( unit.owner === model.turnOwner &&
                !model.canAct( model.extractUnitId( unit ) ) ){

                ctx.globalAlpha = 0.5;
                ctx.drawImage(
                  view.getUnitImageForType(
                    unit.type.ID, state, view.COLOR_BLACK_MASK
                  ),
                  scx,scy,
                  scw,sch,
                  tcx,tcy,
                  tcw,tch
                );
                ctx.globalAlpha = 1;
              }
            }
            else{
              tcx = (x)*tileSize;
              tcy = (y)*tileSize;
              tcw = tileSize;
              tch = tileSize;

              ctx.fillStyle="rgb(255,0,0)";
              ctx.fillRect(
                tcx,tcy,
                tcw,tch
              );
            }

            pic = stats.HP_PIC;
            if( pic !== null ){
              ctx.drawImage(
                pic,
                tcx+tileSize,tcy+tileSize
              );
            }

            // ------------------------------------------------------------

            if( sprStepStat !== 0 &&
              sprStepStat !== 1 &&

              sprStepStat !== 4 &&
              sprStepStat !== 5 &&

              sprStepStat !== 8 &&
              sprStepStat !== 9 &&

              sprStepStat !== 12 &&
              sprStepStat !== 13 &&
              
              sprStepStat !== 16 &&
              sprStepStat !== 17 ){

              var st = parseInt( sprStepStat/4 , 10 );

              pic = null;
              var stIn = st;
              do{

                // TODO
                if( stIn === 0 && stats.LOW_AMMO ){
                  pic = view.getInfoImageForType("SYM_AMMO");
                }
                else if( stIn === 1 && stats.CAPTURES ){
                  pic = view.getInfoImageForType("SYM_CAPTURE");
                }
                else if( stIn === 2 && stats.LOW_FUEL ){
                  pic = view.getInfoImageForType("SYM_FUEL");
                }
                else if( stIn === 3 && stats.HAS_LOADS ){
                  pic = view.getInfoImageForType("SYM_LOAD");
                }
                else if( stIn === 4 && unit.hidden ){
                  pic = view.getInfoImageForType("SYM_HIDDEN");
                }

                if( pic !== null ) break;

                stIn++;
                if( stIn === 5 ) stIn = 0;
              }
              while( stIn !== st );

              if( pic !== null ){
                ctx.drawImage(
                  pic,
                  tcx+tileSize/2,tcy+tileSize
                );
              }
            }

            // ------------------------------------------------------------
          }
        }

        view.drawScreen[x][y] = false;
      }
    }
  }

  // DRAW ARROW
  if( controller.stateMachine.state === "MOVEPATH_SELECTION" ){
    var currentMovePath = stmData.movePath.data;
    var cX = stmData.source.x;
    var cY = stmData.source.y;
    var oX;
    var oY;
    var tX;
    var tY;

    for( var i=0,e=currentMovePath.length; i<e; i++ ){
      if( currentMovePath[i] === null ) break;

      oX = cX;
      oY = cY;

      // TODO reduce 3 switches to 1

      // CURRENT TILE
      switch( currentMovePath[i] ){
        case model.MOVE_CODE_UP :    cY--; break;
        case model.MOVE_CODE_RIGHT : cX++; break;
        case model.MOVE_CODE_DOWN :  cY++; break;
        case model.MOVE_CODE_LEFT :  cX--; break;
      }

      // NEXT TILE
      if( i === e-1 || currentMovePath[i+1] === null ){
        tX = -1; tY = -1;
      }
      else{
        switch( currentMovePath[i+1] ){
          case model.MOVE_CODE_UP :    tX = cX;   tY = cY-1; break;
          case model.MOVE_CODE_RIGHT : tX = cX+1; tY = cY;   break;
          case model.MOVE_CODE_DOWN :  tX = cX;   tY = cY+1; break;
          case model.MOVE_CODE_LEFT :  tX = cX-1; tY = cY;   break;
        }
      }

      if( tX == -1 ){

        // TARGET TILE
        switch( currentMovePath[i] ){
          case model.MOVE_CODE_UP :
            pic = view.getTileImageForType("ARROW_N"); break;
          case model.MOVE_CODE_RIGHT :
            pic = view.getTileImageForType("ARROW_E"); break;
          case model.MOVE_CODE_DOWN :
            pic = view.getTileImageForType("ARROW_S"); break;
          case model.MOVE_CODE_LEFT :
            pic = view.getTileImageForType("ARROW_W"); break;
        }
      }
      else{

        var diffX = Math.abs( tX-oX );
        var diffY = Math.abs( tY-oY );

        // IN THE MIDDLE OF THE WAY
        if( diffX === 2 ){
          pic = view.getTileImageForType("ARROW_WE");
        }
        else if( diffY === 2 ){
          pic = view.getTileImageForType("ARROW_NS");
        }
        else if( (tX<cX && oY>cY) || (oX<cX && tY>cY)  ){
          pic = view.getTileImageForType("ARROW_SW");
        }
        else if( (tX<cX && oY<cY) || (oX<cX && tY<cY) ){
          pic = view.getTileImageForType("ARROW_WN");
        }
        else if( (tX>cX && oY<cY) || (oX>cX && tY<cY) ){
          pic = view.getTileImageForType("ARROW_NE");
        }
        else if( (tX>cX && oY>cY) || (oX>cX && tY>cY) ){
          pic = view.getTileImageForType("ARROW_ES");
        }
        else{
          util.raiseError(
            "illegal move arrow state",
            "old (",oX,",",oY,")",
            "current (",cX,",",cY,")",
            "next (",tX,",",tY,")",
            "path (", currentMovePath ,")"
          );

          continue;
        }
      }

      if( cX >= 0 && cY >= 0 &&
        cX < controller.screenWidth && cY < controller.screenHeight ){
        ctx.drawImage(
          pic,
          cX*tileSize,
          cY*tileSize
        );
      }
    }
  }

  // DRAW CURSOR
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f00';
  ctx.strokeRect(
    tileSize*controller.mapCursorX+1,
    tileSize*controller.mapCursorY+1,
    tileSize-2,tileSize-2
  );

  view.drawScreenChanges=0;
};
/**
 *
 */
controller.screenStateMachine = simpleStateMachine();

controller.screenStateMachine.name = "CLIENT";

controller.screenStateMachine.data = {};
controller.loadStorageController = util.singleLazyCall(function( err, baton ){
  if( err ){
    if( DEBUG ) util.log("break at init storage system due error from previous inits"); 
    return err;
  }
  
  baton.take();
  
  if( DEBUG ) util.log("initializing storage system"); 
  
  var MAX_MOD_CHARACTERS = 10000000;
  var MAX_MAP_CHARACTERS = 14000000;
  var chars = 0;
  
  var browser = Browser;
  
  if( DEBUG ) util.log("using lawnchair storage system with",((browser.mobile)? 'webkit-sqlite':'indexed-db'),"adapter"); 
  
  var store = new Lawnchair({
    adaptor: (browser.mobile)? 'webkit-sqlite':'indexed-db',
    maxSize: 45*1024+1024,
    name:'cwt'
  },function(){
    
    var get,has,clear,remove,set,keys;
    
    get = function( key, cb ){
      store.get(key,cb);
    };
    
    has = function( key, cb ){
      store.exists( key, cb );
    };
    
    clear = function( cb ){
      store.nuke(cb);
    };
    
    keys = function( cb ){
      store.keys(cb);
    };
    
    remove = function( key, cb, isMod ){
      store.get(key,obj,cb);
    };
    
    set = function( key, value, cb, isMod ){
      // ONLY AS INFORMATION AT THE MOMENT
      if( DEBUG ){
        chars += JSON.stringify( {key:key, value:value} ).length;
        util.log(chars,"used in storage");
      }
      
      store.save({key:key, value:value},cb);
    };    
    
    /**
   * Storage controller.
   * 
   * @namespace
   */
    controller.storage = {
      get: get,
      has: has,
      set: set,
      keys: keys,
      clear: clear,
      remove: remove
    };
    
    baton.pass( false ); 
  });
});
controller.screenStateMachine.data.mapToLoad = null;
controller.screenStateMachine.data.openedSection = null;
  
controller.screenStateMachine.data.openSection = function( id ){
  var element = document.getElementById(id);
  if( !element ) util.raiseError("unknown id",id);

  if( this.openedSection !== null ){
    this.openedSection.style.display = "none"; 
  }

  element.style.display = "";
  this.openedSection = element;
};
util.scoped(function(){
  
  /** @private */
  function loadMapCb( obj ){
    controller.startGameRound( obj.value );
      
    // UPDATE SCREEN DATA
    controller.setCursorPosition(0,0);
    view.resizeCanvas();
    view.updateMapImages();
    view.completeRedraw();
    
    // UPDATE UNIT STATS
    for( var i=0,e=model.units.length; i<e; i++ ){
      if( model.units[i].owner !== CWT_INACTIVE_ID ) controller.updateUnitStatus( i );
    }
    
    controller.playSoundForPlayer( model.turnOwner );
    controller.renderPlayerInfo();
    
    // INIT LOOP
    setupAnimationFrame();
  }
  
  function setupAnimationFrame(){
    if( DEBUG ) util.log("setup animation frame");
    
    // PREPARE LOOP
    controller.prepareGameLoop();
    
    var oldTime = new Date().getTime();
    function looper(){
      if( !controller.inGameRound ){
        controller.screenStateMachine.event("gameHasEnded");
        return;
      }
      
      requestAnimationFrame( looper );
      
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;
      
      controller.gameLoop( delta );
    }
        
    // ENTER LOOP
    requestAnimationFrame( looper );
  }
  
  function hideInfoScreens(){
    if( controller.unitInfoVisible ) controller.hideUnitInfo();
    if( controller.tileInfoVisible ) controller.hideTileInfo();
    if( controller.playerInfoVisible ) controller.hidePlayerInfo();
    if( controller.attackRangeVisible ) controller.hideAttackRangeInfo();
  }
    
  // -----------------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.GAMEROUND = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.GAMEROUND.onenter = function(){
    this.data.openSection( ID_MENU_SECTION_GAME );
    controller.storage.get( this.data.mapToLoad, loadMapCb );
  };
  
  controller.screenStateMachine.structure.GAMEROUND.gameHasEnded = function(){
    hideInfoScreens();
    return "MAIN";
  };
  
  
  
  // ++++++++++++ INPUT MOVE ++++++++++++
  
  controller.screenStateMachine.structure.GAMEROUND.LEFT = function( ev, distance ){
    hideInfoScreens();
    
    // IN TARGET TILE SELECTION MODE ?
    var state = controller.stateMachine.state;
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, true, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    if( !distance ) distance = 1;
    
    if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_LEFT, distance );
    else controller.shiftScreenPosition( model.MOVE_CODE_LEFT, distance );
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.RIGHT = function( ev, distance ){
    hideInfoScreens();
    
    // IN TARGET TILE SELECTION MODE ?
    var state = controller.stateMachine.state;
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, false, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    if( !distance ) distance = 1;
    
    if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_RIGHT, distance );
    else controller.shiftScreenPosition( model.MOVE_CODE_RIGHT, distance );
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.UP = function( ev, distance ){
    hideInfoScreens();
    
    var state = controller.stateMachine.state;
    
    // IN TARGET TILE SELECTION MODE ?
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, true, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    var inMenu = ( state === "ACTION_MENU" || state === "ACTION_SUBMENU" );
    
    if( !distance ) distance = 1;
    
    if( !inMenu ){
      if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_UP, distance );
      else controller.shiftScreenPosition( model.MOVE_CODE_UP, distance );
    }
    else controller.decreaseMenuCursor();
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.DOWN = function( ev, distance ){
    hideInfoScreens();
    
    var state = controller.stateMachine.state;
    
    // IN TARGET TILE SELECTION MODE ?
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, false, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    var inMenu = ( state === "ACTION_MENU" || state === "ACTION_SUBMENU" );
    
    if( !distance ) distance = 1;
    
    if( !inMenu ){ 
      if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_DOWN, distance );
      else controller.shiftScreenPosition( model.MOVE_CODE_DOWN, distance );
    }
    else controller.increaseMenuCursor();
    return this.BREAK_TRANSITION;
  };
  
  
  // ++++++++++++ INPUT ACTIONS ++++++++++++
  
  controller.screenStateMachine.structure.GAMEROUND.ACTION = function( ev,x,y ){
    hideInfoScreens();
    
    if( typeof x === "number" ) controller.setCursorPosition(x,y);
    controller.cursorActionClick();
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.HOVER = function( ev,x,y ){
    controller.setCursorPosition(x,y);
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.CANCEL = function( ev,x,y ){
    hideInfoScreens();
    
    if( typeof x === "number" ) controller.setCursorPosition(x,y);
    controller.cursorActionCancel();
    return this.BREAK_TRANSITION;
  };
  
  
  
  // ++++++++++++ INPUT SPECIAL ++++++++++++
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_1 = function(){
    if( !controller.tileInfoVisible ){
      hideInfoScreens();
      controller.showTileInfo();
    }
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_2 = function(){
    if( !controller.unitInfoVisible ){
      hideInfoScreens();
      controller.showUnitInfo();
    }
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_3 = function(){
    if( !controller.attackRangeVisible ){
      hideInfoScreens();
      controller.showAttackRangeInfo();
    }
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_4 = function(){
    if( !controller.playerInfoVisible ){
      hideInfoScreens();
      controller.showPlayerInfo();
    }
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_5 = function(){
    hideInfoScreens();
    controller.setScreenScale( controller.screenScale+1 );
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_6 = function(){
    hideInfoScreens();
    controller.setScreenScale( controller.screenScale-1 );
    return this.BREAK_TRANSITION;
  };
  
});
controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent);

controller.screenStateMachine.structure.LOAD.onenter = function(){
  this.data.openSection(ID_MENU_SECTION_LOAD);
  
  var workflow = jWorkflow.order(controller.isEnvironmentSupported)
    .andThen(controller.loadStorageController)
    .andThen(function( err, baton ){
      if( err ) return err;
      baton.take();
      
      controller.storage.get("resetDataAtStart",function( obj ){
        var  wipeOut = (obj !== null && obj.value);
        if( !wipeOut ) wipeOut = getQueryParams(document.location.search).wipeoutMod === "1";
        if(  wipeOut ){
          if( DEBUG ) util.log("wipe out cached data");
          
          // NUKE STORAGE
          controller.storage.clear( function(){
            baton.pass(false); 
          });
        }
        else baton.pass(false);
      });
      
    })
    .andThen(controller.loadModification)
    .andThen(controller.loadMaps)
    .andThen(controller.loadImages)
    .andThen(controller.cutImages)
    .andThen(controller.colorizeImages)
    .andThen(controller.loadSoundFiles)
    .andThen(controller.loadInputDevices)
    .andThen(function(){ 
      controller.screenStateMachine.event("complete"); 
    })
    .start();
};

controller.screenStateMachine.structure.LOAD.complete = function(){
  return "MOBILE";
};

controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine;
controller.loadError = null;

util.scoped(function(){
  
  var elements = [
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_1),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_2),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_3),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_4),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_5),
    document.getElementById(ID_ELMT_SECTION_MAIN_BTN_6)
  ];
  
  var index = -1;
  
  function changeFocus( mode, relative ){
    if( relative === undefined ) relative = true;
    
    // DROP FOCUS COLOR
    if( index !== -1 ) elements[ index ].className = "menuButton";
    
    // CHANGE INDEX
    if( relative ){
      if( mode > 0 ){
        index++;
        if( index >= elements.length ) index = 0;
      }
      else{
        index--;
        if( index < 0 ) index = elements.length-1;
      }
    }
    else{
      if( mode < 0 || mode >= elements.length ) util.raiseError("wrong index");
      index = mode;
    }
    
    // SET FOCUS COLOR
    // elements[ index ].style.background = "red";
    var vl = elements[index].attributes.key.value;
    
    if( ( !controller.loadError && vl === "VERSUS" ) || vl === "OPTIONS" ) vl = "menuButton active";
    else vl = "menuButton inactive";
    
    elements[ index ].className = vl;
      
  }
  
  function tick(){
    if( DEBUG ) util.log("got click on button", elements[ index ].attributes.key.value);
  }
  
  function register(i){
    elements[i].onmouseover = function(){
      changeFocus(i,false);
    };
  }
  
  // REGISTERS MOUSE ONHOVER EVENT
  for( var i=0,e=elements.length; i<e; i++ ) register(i);
  
  // ------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.MAIN = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.MAIN.onenter = function(){
    controller.playEmptyAudio();
    controller.playMusic("BG");
    
    for( var i=0,e=elements.length; i<e; i++ ){
      elements[i].innerHTML = model.localized( elements[i].attributes.key.value );
    }
    
    if( controller.loadError ){
      var el = document.getElementById(ID_ELMT_SECTION_MAIN_ERROR);
      
      el.innerHTML = controller.loadError;
      el.style.display = "block";
    }
    
    this.data.openSection(ID_MENU_SECTION_MAIN);
    changeFocus(1,false);
  };
  
  controller.screenStateMachine.structure.MAIN.UP = function(){
    changeFocus(-1);
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.MAIN.DOWN = function(){
    changeFocus(+1);
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.MAIN.ACTION = function(){
    var selEl = elements[index];
    var key = selEl.attributes.key.value;
    
    controller.loadError = null;
    
    if( !controller.loadError && key === "VERSUS" ) return "VERSUS";
    else if( key === "OPTIONS" ) return "OPTIONS";
      
    return this.BREAK_TRANSITION;
  };
});
controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.MOBILE.onenter = function(){
  this.data.openSection(ID_ELMT_SECTION_MOBILE);
  
  var button = document.getElementById(ID_ELMT_SECTION_MOBILE_NEXT);
  button.innerHTML = model.localized( button.attributes.key.value );
};

controller.screenStateMachine.structure.MOBILE.ACTION = function(){ 
  return "MAIN"; 
};
controller.screenStateMachine.structure.NONE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.NONE.start = function(){
  return "LOAD"; 
};
util.scoped(function(){
  
  function saveComplete(){
    if( DEBUG ) util.log("successfully set new mod path");
  }
  
  function wipeComplete(){
    if( DEBUG ) util.log("successfully set wipe out... next start with clean data");
  }
  
  var index = -1;
  var elements = [
    document.getElementById(ID_ELMT_OTIONS_SFX_VOL),
    document.getElementById(ID_ELMT_OTIONS_MUSIC_VOL),
    document.getElementById(ID_ELMT_OTIONS_RESET),
    document.getElementById("cwt_options_mapIn"),
    document.getElementById("cwt_options_addMap"),
    document.getElementById(ID_ELMT_OTIONS_GOBACK)
  ];
  
  var label1 = document.getElementById("cwt_options_sfxVolume_desc");
  var label2 = document.getElementById("cwt_options_musicVolume_desc");
  var label3 = document.getElementById("cwt_options_reset");
  var label4 = document.getElementById("cwt_options_goBack");
  var label5 = document.getElementById("cwt_options_addMap");
  
  var nodeSfx   = document.getElementById( "cwt_options_sfxVolume" );
  var nodeMusic = document.getElementById( "cwt_options_musicVolume" );
  
  var modText = document.getElementById( ID_ELMT_OTIONS_MOD_INFO );
  
  function register(i){
    elements[i].onmouseover = function(){
      if( index !== 3 ) elements[index].className = "menuButton";
      index = i;
      if( index !== 3 ) elements[index].className = "menuButton active";
    };
  }
  
  // REGISTERS MOUSE ONHOVER EVENT
  for( var i=0,e=elements.length; i<e; i++ ) register(i);
  
  // ------------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.OPTIONS.onenter = function(){
    
    // SET LOCALIZED BUTTONS
    label1.innerHTML = model.localized( label1.attributes.key.value );
    label2.innerHTML = model.localized( label2.attributes.key.value );
    label3.innerHTML = model.localized( label3.attributes.key.value );
    label4.innerHTML = model.localized( label4.attributes.key.value );
    label5.innerHTML = model.localized( label5.attributes.key.value );
    
    this.data.openSection( ID_MENU_SECTION_OPTIONS );
    if( index !== -1 && index !== 3 ) elements[index].className = "menuButton";
    
    index = 0;
    elements[index].className = "menuButton active";
    
    nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
    nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
  };
  
  controller.screenStateMachine.structure.OPTIONS.UP = function(){
    if( index !== 3 ) elements[index].className = "menuButton";
    
    index--;
    if( index < 0 ) index = elements.length-1;
    
    if( index !== 3 ) elements[index].className = "menuButton active";
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.DOWN = function(){
    if( index !== 3 ) elements[index].className = "menuButton";
    
    index++;
    if( index >= elements.length ) index = 0;
    
    if( index !== 3 ) elements[index].className = "menuButton active";
    return this.BREAK_TRANSITION;    
  };
  
  controller.screenStateMachine.structure.OPTIONS.ACTION = function(){
    var selectedId = elements[index].id;
    
    switch( selectedId ){
        
      case ID_ELMT_OTIONS_MOD_TAKE: 
        var content = modText.value;
        controller.storage.set("modificationPath",content, saveComplete );
        controller.storage.set("resetDataAtStart",{value:true}, wipeComplete );
        break;
        
      case ID_ELMT_OTIONS_RESET:
        controller.storage.set("resetDataAtStart",{value:true}, wipeComplete );
        break;
        
      case "cwt_options_addMap":
        try{
          var data = document.getElementById("cwt_options_mapIn").value;
          data = JSON.parse( data );
          model.checkMap( data );
        }
        catch( e ){
          controller.loadError = "illegal map";
          return "MAIN";
        }
        
        controller.storage.set( data.name , data, function(){
          controller.mapList.push({ name:data.name, key:data.name });
        });
        break;
        
      case ID_ELMT_OTIONS_GOBACK: 
        controller.saveSoundConfigs();
        return "MAIN";
    }
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.LEFT = function(){
    var selectedId = elements[index].id;
    
    switch( selectedId ){
        
      case ID_ELMT_OTIONS_SFX_VOL:
        controller.setSfxVolume( controller.getSfxVolume()-0.05 );
        nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
        break;
        
      case ID_ELMT_OTIONS_MUSIC_VOL:
        controller.setMusicVolume( controller.getMusicVolume()-0.05 );
        nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
        break;
    }
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.RIGHT = function(){
    var selectedId = elements[index].id;
    
    switch( selectedId ){
        
      case ID_ELMT_OTIONS_SFX_VOL:
        controller.setSfxVolume( controller.getSfxVolume()+0.05 );
        nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
        break;
        
      case ID_ELMT_OTIONS_MUSIC_VOL:
        controller.setMusicVolume( controller.getMusicVolume()+0.05 );
        nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
        break;
    }
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.OPTIONS.CANCEL = function(){
    controller.saveSoundConfigs();
    return "MAIN";
  };
  
});
util.scoped(function(){
  
  var mapElement = document.getElementById("map_selection");
  var startButton = document.getElementById("versus_start_btn");
  var mapIndex;
  
  function updateMapElement(){
    mapElement.innerHTML = controller.mapList[ mapIndex ].name;
  }
  
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.VERSUS = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.VERSUS.onenter = function(){
    this.data.openSection("cwt_versus_screen");
    
    startButton.innerHTML = model.localized( startButton.attributes.key.value );
    
    mapIndex = 0;
    updateMapElement();
  };
  
  controller.screenStateMachine.structure.VERSUS.UP = function(){
    if( mapIndex > 0 ) mapIndex--;
    else mapIndex = controller.mapList.length-1;
    
    updateMapElement();
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.VERSUS.DOWN = function(){
    if( mapIndex < controller.mapList.length-1 ) mapIndex++;
    else mapIndex = 0;
    
    updateMapElement();
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.VERSUS.CANCEL = function(){
    return "MAIN";
  };
  
  controller.screenStateMachine.structure.VERSUS.ACTION = function(){
    if( !controller.mapList ) return this.BREAK_TRANSITION;
    this.data.mapToLoad = controller.mapList[ mapIndex ].key;
    
    // START GAME
    return "GAMEROUND";
  };
});
view.registerAnimationHook({

  key: "captureProperty",

  prepare: function( cid, prid, px,py, points ){
    var property = model.properties[ prid ];
    controller.updateUnitStatus( cid );

    if( property.capturePoints === 20 ){
      view.showInfoMessage( model.localized("propertyCaptured") );
    }
    else view.showInfoMessage( model.localized("propertyPointsLeft")+" "+property.capturePoints );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});
view.registerAnimationHook({

  key: "changeWeather",

  prepare: function( wth ){
    view.showInfoMessage( model.localized("weatherChange")+" "+model.localized( wth ) );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});

view.registerAnimationHook({

  key: "destroyUnit",

  prepare: function( id ){
    var unit = model.units[ id ];

    this.step = 0;
    this.time = 0;

    this.x = -unit.x;
    this.y = -unit.y;
    
    controller.playSound("EXPLODE");
  },
  
  render: function(){
    var step = this.step;

    var pic = view.getInfoImageForType("EXPLOSION_GROUND");

    var x = this.x;
    var y = this.y;

    var tileSize = TILE_LENGTH;
    var scx = 48*step;
    var scy = 0;
    var scw = 48;
    var sch = 48;
    var tcx = (x)*tileSize;
    var tcy = (y)*tileSize;
    var tcw = tileSize;
    var tch = tileSize;

    view.canvasCtx.drawImage(
      pic,
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );

    view.markForRedraw(x,y);
  },

  update: function( delta ){
    this.time += delta;
    if( this.time > 75 ){
      this.step++;
      this.time = 0;
    }
  },

  isDone: function(){
    return this.step === 10;
  }

});
model.modifyVisionAt.listenCommand(
function( x,y, pid, range, value ){
    range = 10; // TAKE THE MAXIMUM RANGE
  
    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){

      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){
        view.markForRedraw( lX,lY );
        
        var unit = model.unitPosMap[lX][lY];
        if( unit !== null && unit.hidden ){
          controller.updateUnitStatus( model.extractUnitId( unit ) );
        }
      }
    }
});

model.recalculateFogMap.listenCommand(
function(range){
  view.completeRedraw();
});
view.registerAnimationHook({
  
  key: "moveUnit",
  
  prepare: function( way, uid, x,y ){
    
    this.moveAnimationX     = x;
    this.moveAnimationY     = y;
    this.moveAnimationIndex = 0;
    this.moveAnimationPath  = way;
    this.moveAnimationUid   = uid;
    this.moveAnimationShift = 0;
    
    this.moveAnimationDustX = -1;
    this.moveAnimationDustY = -1;
    this.moveAnimationDustTime = -1;
    this.moveAnimationDustStep = -1;
    this.moveAnimationDustPic = null;
    
    view.preventRenderUnit = model.units[ uid ];
    var mvType = model.units[ uid ].type.movetype;
    
    /*
    var mvSoundId;
    if( mvType === "MV_INFANTRY" || mvType === "MV_MECH" ) mvSoundId = "MV_FOOT";
    else if( mvType === "MV_TANK" ) mvSoundId = "MV_TANK";
    else if( mvType === "MV_AIR" ) mvSoundId = "MV_AIR";
    else mvSoundId = "MV_VHCL";
    
    this.snd = controller.playSound( mvSoundId );
    */
    
    if( DEBUG ){
      util.log(
        "drawing move from",
        "(",this.moveAnimationX,",",this.moveAnimationY,")",
        "with path",
        "(",this.moveAnimationPath,")"
      );
    }
  },
  
  update: function( delta ){
    var tileSize = TILE_LENGTH;
    
    // MOVE 4 TILES / SECOND
    this.moveAnimationShift += ( delta/1000 ) * ( tileSize*8);
    
    view.markForRedrawWithNeighboursRing(
      this.moveAnimationX, this.moveAnimationY
    );
    
    // DUST
    if( this.moveAnimationDustStep !== -1 ){
      
      this.moveAnimationDustTime += delta;
      if( this.moveAnimationDustTime > 30 ){
        
        this.moveAnimationDustStep++;
        this.moveAnimationDustTime = 0;
        
        if( this.moveAnimationDustStep === 3 ){
          this.moveAnimationDustStep = -1;
        }
      }
    }
    
    if( this.moveAnimationShift > tileSize ){
      
      this.moveAnimationDustX = this.moveAnimationX;
      this.moveAnimationDustY = this.moveAnimationY;
      this.moveAnimationDustTime = 0;
      this.moveAnimationDustStep = 0;
      
      // UPDATE ANIMATION POS
      switch( this.moveAnimationPath[ this.moveAnimationIndex ] ){
          
        case model.MOVE_CODE_UP :
          this.moveAnimationY--;
          this.moveAnimationDustPic = view.getInfoImageForType("DUST_U");
          break;
          
        case model.MOVE_CODE_RIGHT :
          this.moveAnimationX++;
          this.moveAnimationDustPic = view.getInfoImageForType("DUST_R");
          break;
          
        case model.MOVE_CODE_DOWN :
          this.moveAnimationY++;
          this.moveAnimationDustPic = view.getInfoImageForType("DUST_D");
          break;
          
        case model.MOVE_CODE_LEFT :
          this.moveAnimationX--;
          this.moveAnimationDustPic = view.getInfoImageForType("DUST_L");
          break;
      }
      
      this.moveAnimationIndex++;
      
      this.moveAnimationShift -= tileSize;
      // this.moveAnimationShift = 0;
      
      if( this.moveAnimationIndex === this.moveAnimationPath.length ){
        this.moveAnimationX     = 0;
        this.moveAnimationY     = 0;
        this.moveAnimationIndex = 0;
        this.moveAnimationPath  = null;
        this.moveAnimationUid   = -1;
        this.moveAnimationShift = 0;
        view.preventRenderUnit = null; // RENDER UNIT NOW NORMALLY
      }
    }
  },
  
  render: function(){
    var uid      = this.moveAnimationUid;
    var cx       = this.moveAnimationX;
    var cy       = this.moveAnimationY;
    var shift    = this.moveAnimationShift;
    var moveCode = this.moveAnimationPath[ this.moveAnimationIndex ];
    var unit     = model.units[ uid ];
    var color = view.colorArray[ unit.owner ];
    var state;
    var tp = unit.type;
    
    // GET CORRECT IMAGE STATE
    switch( moveCode ){
      case model.MOVE_CODE_UP :    state = view.IMAGE_CODE_UP;    break;
      case model.MOVE_CODE_RIGHT : state = view.IMAGE_CODE_RIGHT; break;
      case model.MOVE_CODE_DOWN :  state = view.IMAGE_CODE_DOWN;  break;
      case model.MOVE_CODE_LEFT :  state = view.IMAGE_CODE_LEFT;  break;
    }
    
    var pic = view.getUnitImageForType( tp.ID, state, color );
    
    var tileSize = TILE_LENGTH;
    var BASESIZE = controller.baseSize;
    var scx = (BASESIZE*2)*view.getSpriteStep("UNIT");
    var scy = 0;
    var scw = BASESIZE*2;
    var sch = BASESIZE*2;
    var tcx = ( cx )*tileSize -tileSize/2; // TODO
    var tcy = ( cy )*tileSize -tileSize/2;
    var tcw = tileSize+tileSize;
    var tch = tileSize+tileSize;
    
    // ADD SHIFT
    switch( moveCode ){
      case model.MOVE_CODE_UP:    tcy -= shift; break;
      case model.MOVE_CODE_LEFT:  tcx -= shift; break;
      case model.MOVE_CODE_RIGHT: tcx += shift; break;
      case model.MOVE_CODE_DOWN:  tcy += shift; break;
    }
    
    // DRAW IT
    if( pic !== undefined ){
      view.canvasCtx.drawImage(
        pic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tcw
      );
    }
    else{
      tcx = ( cx )*tileSize;
      tcy = ( cy )*tileSize;
      tcw = tileSize;
      tch = tileSize;
      
      // ADD SHIFT
      switch( moveCode ){
        case model.MOVE_CODE_UP:    tcy -= shift; break;
        case model.MOVE_CODE_LEFT:  tcx -= shift; break;
        case model.MOVE_CODE_RIGHT: tcx += shift; break;
        case model.MOVE_CODE_DOWN:  tcy += shift; break;
      }
      
      view.canvasCtx.fillStyle="rgb(255,0,0)";
      view.canvasCtx.fillRect(
        tcx,tcy,
        tcw,tch
      );
    }
    
    // DUST
    if( this.moveAnimationDustStep !== -1 ){
      
      var tileSize = TILE_LENGTH;
      scx = (BASESIZE*2)*this.moveAnimationDustStep;
      scy = 0;
      scw = BASESIZE*2;
      sch = BASESIZE*2;
      tcx = ( this.moveAnimationDustX )*tileSize -tileSize/2;
      tcy = ( this.moveAnimationDustY )*tileSize -tileSize/2;
      tcw = tileSize+tileSize;
      tch = tileSize+tileSize;
      
      view.canvasCtx.drawImage(
        this.moveAnimationDustPic,
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );
    }
  },
  
  isDone: function(){
    var done = (this.moveAnimationUid === -1);
    
    if( done ){
       util.log("DONE");
    }
    
    return done;
  }
  
});
model.invokeNextStep_.listenCommand(function(){
  if( controller.stateMachine.state !== "IDLE" ){
    controller.showMenu(
      controller.stateMachine.data.menu,
      controller.mapCursorX,
      controller.mapCursorY
    );
  }
});
controller.playSoundForPlayer = function( pid ){
  var co = model.players[pid].mainCo;
  
  if( Browser.ios ){
    
    // PLAY FACTION SOUND
    controller.playMusic( model.factionTypes[co.faction].music );
  }
  else{ 
    
    // PLAY CO SOUND
    controller.playMusic( co.music );
  }
};

view.registerAnimationHook({
  key: "nextTurn",
  
  prepare: function(){
    controller.renderPlayerInfo();
    
    controller.playSoundForPlayer( model.turnOwner );
    
    view.showInfoMessage( model.localized("day")+" "+model.day );
  },
  
  render: function(){},
  
  update: function( delta ){},
  
  isDone: function(){
    return !view.hasInfoMessage();
  }
  
});

util.scoped(function(){
  
  var expl_img;
  
  function renderSmoke( x,y, step, distance ){
    step -= (distance-1);
    if( step < 0 || step > 9 ) return;
    
    var tileSize = TILE_LENGTH;
    var scx = 48*step;
    var scy = 0;
    var scw = 48;
    var sch = 48;
    var tcx = (x)*tileSize;
    var tcy = (y)*tileSize;
    var tcw = tileSize;
    var tch = tileSize;
    
    view.canvasCtx.drawImage(
      expl_img,
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );
    
    view.markForRedraw(x,y);
  }
  
  function checkStatus( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        controller.updateUnitStatus( model.extractUnitId(unit) );
      }
    }
  }
  
  view.registerAnimationHook({
    
    key: "fireSilo",
        
    prepare: function( siloId, tx,ty, range, owner ){
      if( !expl_img ) expl_img = view.getInfoImageForType("EXPLOSION_GROUND");
      
      this.x = tx;
      this.y = ty;   
      this.range = range;
      this.step = 0;
      this.time = 0;
    },
    
    render: function(){
      model.doInRange( this.x, this.y, this.range, renderSmoke, this.step );
    },
    
    update: function( delta ){
      this.time += delta;
      if( this.time > 75 ){
        this.step++;
        this.time = 0;
      }
    },
    
    isDone: function(){
      var done = this.step === 13;
      
      // RENDER HP LOST
      if( done ) model.doInRange( this.x, this.y, this.range, checkStatus );
      
      return done;
    }
    
  });
});
view.registerAnimationHook({
  
  key:"trapWait",
  
  prepare: function( uid ){
    var unit = model.units[ uid ];
    this.time = 0;
    this.xp = unit.x+1;
    this.yp = unit.y;
    this.x = (unit.x+1) * TILE_LENGTH;
    this.y = unit.y * TILE_LENGTH;
  },

  render: function(){
    var pic = view.getInfoImageForType("TRAPPED");
    view.canvasCtx.drawImage( pic, this.x, this.y );
  },

  update: function( delta ){
    this.time += delta;
  },

  isDone: function(){
    var res = this.time > 1000;
    if( res ){
      var pic = view.getInfoImageForType("TRAPPED");
      var y = this.yp;
      for( var i=this.xp,e=i+( parseInt(pic.width/TILE_LENGTH,10) ); i<=e; i++ ){
        view.markForRedraw( i , y );
      }
    }
    return res;
  }

})
model.damageUnit.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});

model.healUnit.listenCommand(function( uid ){
  controller.updateUnitStatus( uid );
});

model.battleBetween.listenCommand(function( auid,duid ){
  controller.renderPlayerInfo();
  controller.updateUnitStatus( auid );
  controller.updateUnitStatus( duid );
});

model.buildUnit.listenCommand(function(){
  controller.renderPlayerInfo();
});

model.transferUnit.listenCommand(function( suid, tuid ){
  controller.updateUnitStatus( tuid );
});

model.loadUnitInto.listenCommand(function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.unloadUnitFrom.listenCommand(function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

model.joinUnits.listenCommand(function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.refillResources.listenCommand(function( uid ){
  if( typeof uid.x === "number" ) uid = model.extractUnitId(uid);
  controller.updateUnitStatus( uid );
});
util.scoped(function(){
  
  var tmpData = util.matrix(  
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    0 
  );
  
  controller.attackRangeVisible = false;
  
  controller.showAttackRangeInfo = function(){
    if( controller.attackRangeVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var unit = model.unitPosMap[x][y];
    if( unit === null ) return;
    var unitId = model.extractUnitId(unit);
    
    if( DEBUG ) util.log("show attack range information");
    
    var selection = controller.stateMachine.data.selection;
    
    selection.setCenter(x,y,CWT_INACTIVE_ID);
    
    if( model.isIndirectUnit( unitId) ){
      
      // CALCULATE ATTACKABLE TILES
      model.attackRangeMod_( unitId, x, y, selection );
    }
    else{
      
      // GET MOVE DATA
      controller.stateMachine.data.movePath.fillMoveMap( x,y, unit );
      selection.data.cloneValues( tmpData );
      selection.setCenter(x,y,CWT_INACTIVE_ID);
      
      // FOR EVERY MOVE TILE
      var e = tmpData.length;
      for (var ax = 0; ax < e; ax++) {
        for (var ay = 0; ay < e; ay++) {
          
          // IF MOVABLE
          if( tmpData[ax][ay] >= 0 ){
            
            // CALCULATE ATTACKABLE TILES
            model.attackRangeMod_( unitId, ax, ay, selection, true );
          }
        }
      }
    }
    
    controller.attackRangeVisible = true;
  };
  
  controller.hideAttackRangeInfo = function(){
    if( !controller.attackRangeVisible ) return;
    
    if( DEBUG ) util.log("hide attack range information");
    view.markSelectionMapForRedraw( controller.stateMachine.data );
    
    controller.attackRangeVisible = false;
  };
  
});
controller.registerMenuRenderer("buildUnit",
function( content, entry, index ){
  
  var cost = model.unitTypes[ content ].cost;
  entry.innerHTML = model.localized(content)+" ("+cost+"$)";
});
controller.registerMenuRenderer("__mainMenu__",
function( content, entry, index ){
  
  entry.innerHTML = model.localized( content );
});
controller.playerInfoEl_gold = document.getElementById("playerGold");
controller.playerInfoEl_power = document.getElementById("playerPower");

controller.renderPlayerInfo = function(){
  var activePl = model.players[ model.turnOwner ];
  
  controller.playerInfoEl_gold.innerHTML = activePl.gold;
  controller.playerInfoEl_power.innerHTML = activePl.power;
};

// ------------------------------------------------------------------------

util.scoped(function(){
  
  var elements = {
    BOX: document.getElementById( ID_ELMT_PLAYERINFOBOX),
    
    NAME: document.getElementById( ID_ELMT_PLAYERINFOBOX_NAME),
    PIC: document.getElementById( ID_ELMT_PLAYERINFOBOX_PIC),
    DESC: document.getElementById( ID_ELMT_PLAYERINFOBOX_DESC),
    
    POWER: document.getElementById( ID_ELMT_PLAYERINFOBOX_POWER),
    POWER_D: document.getElementById( ID_ELMT_PLAYERINFOBOX_POWER_D),
    
    PROPS: document.getElementById( ID_ELMT_PLAYERINFOBOX_PROPS),
    PROPS_D: document.getElementById( ID_ELMT_PLAYERINFOBOX_PROPS_D),
    
    UNITS: document.getElementById( ID_ELMT_PLAYERINFOBOX_UNITS),
    UNITS_D: document.getElementById( ID_ELMT_PLAYERINFOBOX_UNITS_D)
  }
  
  controller.showPlayerInfo = function(){
    if( controller.playerInfoVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var pid = -1;
    
    // TRY PROPERTY
    var prop = model.propertyPosMap[x][y];
    if( prop !== null ) pid = prop.owner;
    else{
    
      // TRY UNIT
      var unit = model.unitPosMap[x][y];
      if( unit !== null ) pid = unit.owner;
    }
    
    if( pid === -1 ) return;
    var player = model.players[pid];
    
    if( DEBUG ) util.log("show player information screen");
    
    // BASE
    elements.NAME.innerHTML = player.name;
    
    elements.POWER_D.innerHTML = "POWER_METER";
    elements.POWER.innerHTML = player.power;
    
    elements.PROPS_D.innerHTML = "NUMBER PROPERTIES";
    elements.PROPS.innerHTML = model.countProperties(pid);
    
    elements.UNITS_D.innerHTML = "NUMBER UNITS";
    elements.UNITS.innerHTML = model.countUnits(pid);
    
    // SHOW ELEMENT
    elements.BOX.className = "tooltip active";
    elements.BOX.style.position = "absolute";
    elements.BOX.style.left = parseInt( ((window.innerWidth/2) - (elements.BOX.offsetWidth/2)), 10 )+"px";
    elements.BOX.style.top = parseInt( ((window.innerHeight/2) - (elements.BOX.offsetHeight/2)), 10 )+"px";
    controller.playerInfoVisible = true;
  };
  
  controller.playerInfoVisible = false;
  
  controller.hidePlayerInfo = function(){
    if( !controller.playerInfoVisible ) return;
    if( DEBUG ) util.log("hide player information screen");
    
    // HIDE ELEMENT
    elements.BOX.className = "tooltip out";
    controller.playerInfoVisible = false;
  };
  
});
util.scoped(function(){
  
  var elements = {
    BOX: document.getElementById( ID_ELMT_TILEINFOBOX),
    
    NAME: document.getElementById( ID_ELMT_TILEINFOBOX_NAME),
    PIC: document.getElementById( ID_ELMT_TILEINFOBOX_PIC),
    DESC: document.getElementById( ID_ELMT_TILEINFOBOX_DESC),
    
    DEFENSE: document.getElementById( ID_ELMT_TILEINFOBOX_DEFENSE),
    CAPPT: document.getElementById( ID_ELMT_TILEINFOBOX_CAPPT),
    OWNER: document.getElementById( ID_ELMT_TILEINFOBOX_OWNER),
    
    DEFENSE_D: document.getElementById( ID_ELMT_TILEINFOBOX_DEFENSE_D),
    OWNER_D: document.getElementById( ID_ELMT_TILEINFOBOX_OWNER_D),
    CAPPT_D: document.getElementById( ID_ELMT_TILEINFOBOX_CAPPT_D)
  }
  
  controller.showTileInfo = function(){
    if( controller.tileInfoVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var type = model.map[x][y];
    var prop = model.propertyPosMap[x][y];
    if( prop !== null ) type = prop.type;
    
    if( DEBUG ) util.log("show tile information screen");
    
    // BASE
    elements.NAME.innerHTML = model.localized( type.ID );
    elements.DEFENSE.innerHTML = type.defense;
    elements.DEFENSE_D.innerHTML = model.localized( "DEFENSE" );
    
    elements.CAPPT_D.innerHTML = model.localized( "CAPTURE_PT" );
    elements.CAPPT.innerHTML = ( prop !== null )? prop.capturePoints : "-";
    
    elements.OWNER_D.innerHTML = model.localized( "OWNER" );
    elements.OWNER.innerHTML = ( prop !== null )? model.players[prop.owner].name : "-";
    
    // SHOW ELEMENT
    elements.BOX.className = "tooltip active";
    elements.BOX.style.position = "absolute";
    elements.BOX.style.left = parseInt( ((window.innerWidth/2) - (elements.BOX.offsetWidth/2)), 10 )+"px";
    elements.BOX.style.top = parseInt( ((window.innerHeight/2) - (elements.BOX.offsetHeight/2)), 10 )+"px";
    controller.tileInfoVisible = true;
  };
  
  controller.tileInfoVisible = false;
  
  controller.hideTileInfo = function(){
    if( !controller.tileInfoVisible ) return;
    if( DEBUG ) util.log("hide tile information screen");
    
    // HIDE ELEMENT
    elements.BOX.className = "tooltip out";
    controller.tileInfoVisible = false;
  };
  
});
controller.registerMenuRenderer("transferMoney",
function( content, entry, index ){
  
  entry.innerHTML = content+"$"; 
});
util.scoped(function(){
  
  var extractPlayer = function( content, entry, index ){
    entry.innerHTML = model.players[content].name;  
  };

  controller.registerMenuRenderer("transferProperty",extractPlayer);
  controller.registerMenuRenderer("transferUnit",extractPlayer);
});
util.scoped(function(){
  
  var elements = {
    
    BOX: document.getElementById( ID_ELMT_UNITINFOBOX),
    
    NAME: document.getElementById( ID_ELMT_UNITINFOBOX_NAME),
    PIC: document.getElementById( ID_ELMT_UNITINFOBOX_PIC),
    DESC: document.getElementById( ID_ELMT_UNITINFOBOX_DESC),
    
    CLASS: document.getElementById( ID_ELMT_UNITINFOBOX_CLASS),
    MVTP: document.getElementById( ID_ELMT_UNITINFOBOX_MVTP),
    MAINWP: document.getElementById( ID_ELMT_UNITINFOBOX_MAINWP),
    SECWP: document.getElementById( ID_ELMT_UNITINFOBOX_SECWP),
    HP: document.getElementById( ID_ELMT_UNITINFOBOX_HP),
    GAS: document.getElementById( ID_ELMT_UNITINFOBOX_GAS),
    AMMO: document.getElementById( ID_ELMT_UNITINFOBOX_AMMO),
    GAS2: document.getElementById( ID_ELMT_UNITINFOBOX_GAS2),
    AMMO2: document.getElementById( ID_ELMT_UNITINFOBOX_AMMO2),
    MVRANGE: document.getElementById( ID_ELMT_UNITINFOBOX_MVRANGE),
    VISION: document.getElementById( ID_ELMT_UNITINFOBOX_VISION),
    ATTRANGE: document.getElementById( ID_ELMT_UNITINFOBOX_ATTRANGE),
    ATTRANGE2: document.getElementById( ID_ELMT_UNITINFOBOX_ATTRANGE2),
    AG_INF: document.getElementById( ID_ELMT_UNITINFOBOX_AG_INF),
    AG_VEH: document.getElementById( ID_ELMT_UNITINFOBOX_AG_VEH),
    AG_AIR: document.getElementById( ID_ELMT_UNITINFOBOX_AG_AIR),
    AG_HELI: document.getElementById( ID_ELMT_UNITINFOBOX_AG_HELI),
    AG_SHIP: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SHIP),
    AG_SUB: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SUB),
    
    CLASS_D: document.getElementById( ID_ELMT_UNITINFOBOX_CLASS_D),
    MVTP_D: document.getElementById( ID_ELMT_UNITINFOBOX_MVTP_D),
    MAINWP_D: document.getElementById( ID_ELMT_UNITINFOBOX_MAINWP_D),
    SECWP_D: document.getElementById( ID_ELMT_UNITINFOBOX_SECWP_D),
    HP_D: document.getElementById( ID_ELMT_UNITINFOBOX_HP_D),
    GAS_D: document.getElementById( ID_ELMT_UNITINFOBOX_GAS_D),
    AMMO_D: document.getElementById( ID_ELMT_UNITINFOBOX_AMMO_D),
    MVRANGE_D: document.getElementById( ID_ELMT_UNITINFOBOX_MVRANGE_D),
    VISION_D: document.getElementById( ID_ELMT_UNITINFOBOX_VISION_D),
    ATTRANGE_D: document.getElementById( ID_ELMT_UNITINFOBOX_ATTRANGE_D),
    AG_INF_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_INF_D),
    AG_VEH_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_VEH_D),
    AG_AIR_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_AIR_D),
    AG_HELI_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_HELI_D),
    AG_SHIP_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SHIP_D),
    AG_SUB_D: document.getElementById( ID_ELMT_UNITINFOBOX_AG_SUB_D)
  }
  
  controller.showUnitInfo = function(){
    if( controller.unitInfoVisible ) return;
    
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    var unit = model.unitPosMap[x][y];
    if( !unit ) return; // NO UNIT SELECTED
    var type = unit.type;
    
    if( DEBUG ) util.log("show unit information screen");
    
    // BASE
    elements.NAME.innerHTML = model.localized( type.ID );
    
    // SUPPLY DATA
    elements.MVTP_D.innerHTML = model.localized( "MOVETYPE" );
    elements.MVTP.innerHTML = model.localized( type.movetype );
    elements.MAINWP_D.innerHTML = model.localized( "PRIMARY_WP" );
    elements.MAINWP.innerHTML = "";
    elements.SECWP_D.innerHTML = model.localized( "SECONDARY_WP" );
    elements.SECWP.innerHTML = "";
    elements.HP_D.innerHTML = model.localized( "HP" );
    elements.HP.innerHTML = unit.hp;
    elements.GAS_D.innerHTML = model.localized( "FUEL" );
    elements.GAS.innerHTML = unit.fuel;
    elements.GAS2.innerHTML = type.fuel;
    elements.AMMO_D.innerHTML = model.localized( "AMMO" );
    elements.AMMO.innerHTML = unit.ammo;
    elements.AMMO2.innerHTML = type.ammo;
    elements.MVRANGE_D.innerHTML = model.localized( "MOVERANGE" );
    elements.MVRANGE.innerHTML = type.range;
    elements.VISION_D.innerHTML = model.localized( "VISION" );
    elements.VISION.innerHTML = type.vision;
    elements.ATTRANGE_D.innerHTML = model.localized( "ATTACK_RANGE" );
    
    // ATTACK DATA
    var attack = type.attack;
    if( attack ){
      elements.ATTRANGE.innerHTML = attack.minrange || 1;
      elements.ATTRANGE2.innerHTML = attack.maxrange || 1;
    }
    else{
      elements.ATTRANGE.innerHTML = "";
      elements.ATTRANGE2.innerHTML = "";
    }
    
    // SHOW ELEMENT
    elements.BOX.className = "tooltip active";
    elements.BOX.style.position = "absolute";
    elements.BOX.style.left = parseInt( ((window.innerWidth/2) - (elements.BOX.offsetWidth/2)), 10 )+"px";
    elements.BOX.style.top = parseInt( ((window.innerHeight/2) - (elements.BOX.offsetHeight/2)), 10 )+"px";
    controller.unitInfoVisible = true;
  };
  
  controller.unitInfoVisible = false;
  
  controller.hideUnitInfo = function(){
    if( !controller.unitInfoVisible ) return;
    if( DEBUG ) util.log("hide unit information screen");
    
    // HIDE ELEMENT
    elements.BOX.className = "tooltip out";
    controller.unitInfoVisible = false;
  };
  
});
controller.registerMenuRenderer("unloadUnit",
function( content, entry, index ){
  
  if( content === "done" ){
    entry.innerHTML = model.localized( "done" );  
  }
  else entry.innerHTML = model.localized( model.units[ content ].type.ID );  
});