var CLIENT_DEBUG = true;
/**
controller._soundContext = null;
window.addEventListener('load', function(){
  try {
    controller.context = new webkitAudioContext();
  }
  catch(e) {
    util.logWarn('Web Audio API is not supported in this browser');
  }
}, false);

controller._sounds = {};

controller._enabled = false;

controller.enable = function(){
  if( controller._enabled === false ){
    controller._enabled = true;
  }
};

controller.loadSound = function( key, url ){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function(){
    controller._soundContext.decodeAudioData(
      request.response, function(buffer) {

      controller._sounds[key] = buffer;
    }, null );
  };

  util.logInfo("try to load sound");
  try{
    request.send();
  }
  catch(e){
    util.logWarn("could not load sound");
    controller._enabled = -1; // NEVER ENABLE
  }
};

controller.playMusic = function( key ){

};
controller.playSfx = function( key ){
  if( controller._enabled !== true ) return;

  var buffer = controller._sounds[key];
  var source = controller._soundContext.createBufferSource();
  source.buffer = buffer;
  source.connect( controller._soundContext.destination );
  source.noteOn(0);
};
*/

createjs.Sound.registerPlugin(createjs.WebAudioPlugin);

createjs.Sound.addEventListener("loadComplete", function(){
  if( CLIENT_DEBUG ){
    util.log("finised loading sound");
  }
});

createjs.Sound.registerManifest([
  { src:"sound/ok.wav", id:"ACTION" }, 
  { src:"sound/cancel.wav",  id:"CANCEL" }
]);

/**
 * Plays a sound effect.
 */
controller.playSfx = function( id ){
  createjs.Sound.play( id );
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
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";    
  controller.menuCursorIndex = index;  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
};

/**
 *
 */
controller.increaseMenuCursor = function(){
  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
  
  controller.menuCursorIndex++;
  if( controller.menuCursorIndex === controller.stateMachine.data.menuSize ){
    controller.menuCursorIndex--;
  }
  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
};

/**
 *
 */
controller.decreaseMenuCursor = function(){
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
  
  controller.menuCursorIndex--;
  if( controller.menuCursorIndex < 0 ) controller.menuCursorIndex = 0;
  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
};

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
  if( controller.currentAnimatedKey !== null ) return;

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
      controller.stateMachine.data.menuSize,
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
  controller.playSfx("CANCEL");
};

/**
 *
 */
controller.cursorActionClick = function(){
  controller.cursorAction(false);
  controller.playSfx("ACTION");
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

  if( controller.menuElement.style.display === "block" ) return;
  
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

  view.markForRedraw( controller.mapCursorX, controller.mapCursorY );

  controller.mapCursorX = x;
  controller.mapCursorY = y;
  
  var scw = parseInt( parseInt( window.innerWidth/16,10 ) / controller.screenScale ,10 );
  var sch = parseInt( parseInt( window.innerHeight/16,10 ) / controller.screenScale ,10 );

  var moveCode = -1;
  if( x-controller.screenX <= 1 )          moveCode = model.MOVE_CODE_LEFT;
  else if( x-controller.screenX >= scw-1 ) moveCode = model.MOVE_CODE_RIGHT;
  else if( y-controller.screenY <= 1 )     moveCode = model.MOVE_CODE_UP;
  else if( y-controller.screenY >= sch-1 ) moveCode = model.MOVE_CODE_DOWN;

  if( moveCode !== -1 ){
    controller.shiftScreenPosition( moveCode, 5 );
  }

  if( CLIENT_DEBUG ){
    util.log(
      "set cursor position to",
      x,y,
      "screen node is at",
      controller.screenX,controller.screenY
    );
  }

  view.markForRedraw( x,y );
};

/**
 *
 */
controller.currentAnimatedKey = null;

// controller.currentAnimatedKeyNext = null;

/**
 *
 */
controller.noRendering = true;

/**
 *
 */
controller.lockCommandEvaluation = false;

/**
 *
 * @param delta
 */
controller.gameLoop = function( delta ){

  controller.updateTurnTimer( delta );

  var inMove = (controller.moveScreenX !== 0 || controller.moveScreenY !== 0);
  
  // 0. MAP SHIFT
  if( inMove ){
    controller.solveMapShift();
  }
  else{

    // 1.1. UPDATE LOGIC
    if( controller.currentAnimatedKey === null ){


      if( controller.lockCommandEvaluation === false ){

        if( !controller.noNextActions() ){
          var data = controller.doNextAction();
          if( data !== null ){

            var key = data[ data.length-1 ];

            /*
             MOVE ANIMATED ?
            var move = actionData.getMovePath();
            if( move !== null && move.length > 0 ){

              var moveAnimCmd = view.getCommandHook("move");
              controller.currentAnimatedKey = moveAnimCmd;
              moveAnimCmd.prepare( actionData );

              if( CLIENT_DEBUG ){
                util.logInfo( "preparing command animation for",moveAnimCmd.key );
              }
            }
            */

            view.invokeCommandListener(key,data);

            // IS ANIMATED ?
            var animCmd = view.getCommandHook(key);
            if( animCmd !== null ){

              animCmd.prepare.apply( animCmd, data );
              controller.currentAnimatedKey = animCmd;

              if( CLIENT_DEBUG ){
                util.log( "preparing command animation for", key );
              }
            }

            /*
             SWAP IF NO MOVE ANIMATION IS AVAILABLE
            if( controller.currentAnimatedKey === null &&
              controller.currentAnimatedKeyNext !== null ){

              controller.currentAnimatedKey = controller.currentAnimatedKeyNext;
              controller.currentAnimatedKeyNext = null;
            }
            
            controller.releaseActionDataObject( actionData );
            */
          }
        }

      }
    }
    // 1.2. UPDATE COMMAND ANIMATION
    else{
      controller.currentAnimatedKey.update( delta );
    }

    // 2. UPDATE SPRITE ANIMATION
    view.updateSpriteAnimations( delta );
  }

  // 3. RENDER SCREEN
  if( !controller.noRendering && view.drawScreenChanges > 0 ){
    view.renderMap( controller.screenScale );
  }

  if( !controller.noRendering && !inMove ){
    
    // 4. RENDER COMMAND ANIMATION
    if( controller.currentAnimatedKey !== null ){

      if( controller.currentAnimatedKey.isDone() ){

        if( CLIENT_DEBUG ){
          util.log( "completed command animation for", controller.currentAnimatedKey.key );
        }

        controller.currentAnimatedKey = null;
      } else { 
        controller.currentAnimatedKey.render(); 
      }
    }
  }
};

/**
 *
 */
controller.enterGameLoop = function(){

  if( CLIENT_DEBUG ) util.logInfo("enter game loop");

  var fps = 0, now, lastUpdate = (new Date())*1 - 1;
  var fpsFilter = 50;
  var oldTime = new Date().getTime();
  function looper(){
    requestAnimationFrame( looper );

    var now = new Date().getTime();
    var delta = now - oldTime;
    oldTime = now;

    var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
    if( !isNaN(thisFrameFPS) ) fps += (thisFrameFPS - fps) / fpsFilter;
    lastUpdate = now;

    controller.gameLoop( delta );
  }

  var fpsOut = document.getElementById('fps');
  setInterval(function(){
    fpsOut.innerHTML = CWT_VERSION + " " + fps.toFixed(1) + "fps";
  }, 1000);

  controller.stateMachine.event("start");
  view.fitScreenToDeviceOrientation();

  // ENTER LOOP
  window.requestAnimationFrame( looper );
};
/**
 *
 */
controller.menuPosX = -1;

/**
 *
 */
controller.menuPosY = -1;

/**
 *
 */
controller.menuElement = document.getElementById("cwt_menu");

/**
 *
 */
controller.menuHeaderElement = document.getElementById("cwt_menu_header");

/**
 *
 */
controller.menuEntryContentElement = document.getElementById("cwt_menu_content");

/**
 *
 */
controller.menuEntryListElement = document.getElementById("cwt_menu_entries");

/** @private */
controller._connectMenuListener = function( el, index ){

  el.onclick = function(){
    if( CLIENT_DEBUG ){
      util.log("menu action will be triggered");
    }

    controller.cursorActionClick();
  };

  // TODO FAIL!!!
  el.onmouseover = function(){
    controller.setMenuIndex( index );
  };
};

/**
 *
 * @param menu
 * @param x
 * @param y
 */
controller.showMenu = function( menu, size, x, y ){
  if( CLIENT_DEBUG ){ util.logInfo("opening GUI menu"); }

  var tileSize = TILE_LENGTH*controller.screenScale;

  var renderer = controller.menuRenderer_["__mainMenu__"];
  if( controller.stateMachine.state === "ACTION_SUBMENU" ){
    var newRend = controller.menuRenderer_[ controller.stateMachine.data.action ];
    if( newRend ){
      renderer = newRend;
    }
  }
  
  if( arguments.length === 1 ){
    x = controller.menuPosX;
    y = controller.menuPosY;
  }

  if( CLIENT_DEBUG && !model.isValidPosition(x,y) ){
    throw Error("invalid menu position");
  }

  var entries = controller.menuEntryListElement.children;

  controller.menuRenderer_["__infoPanel__"]( x,y,controller.menuHeaderElement );
  
  // HIDE THEM
  for( var i=0,e=entries.length ; i<e; i++ ){
    entries[i].style.display = "none";
  }

  // SHOW THEM
  for( var i=0,e=size ; i<e; i++ ){
    var entry;

    if( entries.length > i ){
      entries[i].className = "";
      entry = entries[i].children[0];
    }
    else{

      // PERFORMANCE HIT ?
      entry = document.createElement("button");
      controller._connectMenuListener( entry, i );
      var li = document.createElement("li");
      li.appendChild( entry );
      controller.menuEntryListElement.appendChild( li );
    }

    renderer( menu[i], entry, i );
    // entry.innerHTML = util.i18n_localized( menu[i] );
    
    entries[i].style.display = "";
  }

  // RELATIVE SCREEN POS
  x = x - controller.screenX;
  y = y - controller.screenY;

  var tileSizeMenuX = parseInt( 150/tileSize , 10 );
  var tileSizeMenuY = parseInt( 160/tileSize , 10 );
  if( y > (controller.screenHeight-tileSizeMenuX) ) y = y - parseInt( (160/tileSize),10 );
  if( x > (controller.screenWidth-tileSizeMenuY) )  x = x - parseInt( (150/tileSize),10 );

  // CACHE POSITION
  controller.menuPosX = x;
  controller.menuPosY = y;
  
  
  controller.menuCursorIndex = 0;
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
  
  // SET MENU STYLE
  var menuStyle = controller.menuElement.style;
  menuStyle.top = ((y*tileSize)+10)+"px";
  menuStyle.left = ((x*tileSize)-10)+"px";
  menuStyle.zIndex = 2000;
  menuStyle.display = "block";
  
  controller.setMenuIndex( 0 );
};

/**
 *
 */
controller.hideMenu = function(){
  if( CLIENT_DEBUG ){ util.logInfo("closing GUI menu"); }

  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";

  controller.menuElement.style.display = "none";
  controller.menuCursorIndex = -1;
};

/** @private */
controller.menuRenderer_ = {};

controller.registerMenuRenderer = function( key, renderer ){
  if( controller.menuRenderer_.hasOwnProperty( key ) ){
    util.raiseError("renderer for",key,"is already registered");
  }
  
  controller.menuRenderer_[ key ] = renderer;
};

/**
 * Status map with status information for the unit objects.
 * 
 * @private
 */
controller.statusMap_ = util.list( CWT_MAX_UNITS_PER_PLAYER*CWT_MAX_PLAYER, function(){
  return {
    HP_PIC: null,
    LOW_AMMO:false,
    LOW_FUEL:false,
    HAS_LOADS:false,
    CAPTURES: false
  };
});

/**
 * 
 * @param {type} unit
 */
controller.getUnitStatusForUnit = function( unit ){
  var id = model.extractUnitId(unit);
  return controller.statusMap_[id];
};

/**
 * 
 * @param {type} uid
 */
controller.updateUnitStatus = function( uid ){
  var unit = model.units[uid];
  var unitStatus = controller.statusMap_[uid];
  var uSheet = model.sheets.unitSheets[ unit.type ];
  
  var cAmmo = unit.ammo;
  var mAmmo = uSheet.maxAmmo;
  if( cAmmo <= parseInt(mAmmo*0.25, 10) ) unitStatus.LOW_AMMO = true;
  else                                    unitStatus.LOW_AMMO = false;
  if( mAmmo === 0 )                       unitStatus.LOW_AMMO = false;
  
  var cFuel = unit.fuel;
  var mFuel = uSheet.maxFuel;
  if( cFuel < parseInt(mFuel*0.25, 10) ) unitStatus.LOW_FUEL = true;
  else                                   unitStatus.LOW_FUEL = false;
  
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
  
  if( uSheet.transport ){
    if( !model.hasLoadedIds( uid ) ){
         unitStatus.HAS_LOADS = false;
    }
    else unitStatus.HAS_LOADS = false;
  }
  
  if( unit.x !== -1 ){
    var property = model.propertyPosMap[ unit.x ][ unit.y ];
    if( property !== null && property.capturePoints < 20 ){
      unitStatus.CAPTURES = true;
    }
    else unitStatus.CAPTURES = false;
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

controller._transEndEventNames = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition'    : 'transitionend',
  'OTransition'      : 'oTransitionEnd otransitionend',
  'msTransition'     : 'MSTransitionEnd',
  'transition'       : 'transitionend'
};

/**
 *
 * @param scale
 * @throws Error if the screen scale is not an integer
 */
controller.setScreenScale = function( scale ){
  if( scale !== 1 && scale !== 2 && scale !== 3 ){

    util.illegalArgumentError();
  }

  controller.screenScale = scale;

  // INVOKES SCALING TRANSITION
  if( scale === 1 ) controller.screenElement.className = "";
  else              controller.screenElement.className = "scale"+scale;

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
controller.storage = {

  get: function( key ){
    var o = localStorage.getItem( key );
    return o !== null ? JSON.parse(o) : null;
  },

  has: function( key ){
    return localStorage.getItem(key) !== null;
  },

  clear: function(){
    localStorage.clear();
  },

  remove: function( key ){
    localStorage.removeItem( key );
  },

  set: function( key, value ){
    localStorage.setItem( key, JSON.stringify(value) );
  }
};
view._animCommands = {};

view.registerCommandHook = function( impl ){
  view._animCommands[ impl.key ] = impl;
  impl.isEnabled = true;
};

view.getCommandHook = function( key ){
  var obj = view._animCommands[key];
  return obj !== undefined ? obj: null;
};

view._commandListeners = {};

view.registerCommandListener = function( key, listener ){
  if( !view._commandListeners.hasOwnProperty(key) ){
    view._commandListeners[key] = [];
  }
  
  view._commandListeners[key].push( listener );
};

view.invokeCommandListener = function( key, args ){
  var list = view._commandListeners[key];
  if( list ){
    for( var i=0,e=list.length; i<e; i++ ){
      list[i].apply( null, args );
    }
  }
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
  RED:{}, BLUE:{}, YELLOW: {}, GREEN:{},
  BLACK_MASK:{},
  NONE:{}, GRAY:{}
};

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

  if( CLIENT_DEBUG ){
    util.logInfo(
      "registering image for type",type,"\n",
      "state",state,"\n",
      "color",color
    );
  }

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
 * Returns the html image object for the given unit type in the given color
 * shema and state.
 *
 * @param type
 * @param code
 * @param color
 */
view.getUnitImageForType = view.getImageForType;

/**
 * Returns the html image object for the given property type in the
 * given color shema.
 *
 * @param type
 * @param color
 */
view.getPropertyImageForType = function( type, color ){
  return view.getImageForType( type, view.IMAGE_CODE_STATELESS, color );
};

/**
 * Returns the html image object for the given property type in the
 * given color shema.
 *
 * @param type
 * @param color
 */
view.getTileImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

view.getInfoImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};
var TILE_LENGTH = 16;

controller.baseSize = CWT_MOD_DEFAULT.graphic.baseSize;

/**
 *
 */
view.preventRenderUnit = null;

/**
 *
 */
view.canvasCtx = controller.screenElement.getContext("2d");

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
  var BASESIZE = controller.baseSize;
  
  var focusExists = (
    controller.stateMachine.state === "MOVEPATH_SELECTION" ||
      controller.stateMachine.state === "IDLE_R" ||
      controller.stateMachine.state === "ACTION_SELECT_TARGET_A" ||
      controller.stateMachine.state === "ACTION_SELECT_TARGET_B"
  );

  var inShadow;

  // ITERATE BY ROW
  var ye = model.mapHeight-1;
  for(var y = 0; y<=ye; y++){

    // ITERATE BY COLUMN
    var xe = model.mapWidth-1;
    for(var x= 0; x<=xe; x++){

      inShadow = model.fogData[x][y] === 0;

      // RENDER IF NEEDED
      if( view.drawScreen[x][y] === true ){

        // --------------------------------------------------------------------
        // DRAW TILE

        type = model.map[x][y];
        pic = view.getTileImageForType( type );

        scx = 0;
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
          if( property.owner === -1 ){
            color = view.COLOR_NEUTRAL;
          }
          else{
            color = view.colorArray[ property.owner ];
          }

          if( inShadow ) color = view.COLOR_NEUTRAL;

          pic = view.getPropertyImageForType( property.type, color );
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
                property.type, view.COLOR_BLACK_MASK
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

          var value = controller.stateMachine.data.getSelectionValueAt(x,y);
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
        // DRAW UNIT

        var unit = model.unitPosMap[x][y];
        if( !inShadow && unit !== null ){
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

            pic = view.getUnitImageForType( unit.type, state, color );

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
                    unit.type, state, view.COLOR_BLACK_MASK
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

            var stats = controller.getUnitStatusForUnit( unit );

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
              sprStepStat !== 13 ){

              var st = parseInt( sprStepStat/4 , 10 );

              pic = null;
              var stIn = st;
              do{

                // TODO
                if( stIn === 0 && stats.LOW_AMMO ){
                  pic = view.getInfoImageForType("SYM_AMMO");
                }
                else if( stIn === 1 && stats.LOW_FUEL ){
                  pic = view.getInfoImageForType("SYM_FUEL");
                }
                else if( stIn === 2 && stats.CAPTURES ){
                  pic = view.getInfoImageForType("SYM_CAPTURE");
                }
                else if( stIn === 3 && stats.HAS_LOADS ){
                  pic = view.getInfoImageForType("SYM_LOAD");
                }

                if( pic !== null ) break;

                stIn++;
                if( stIn === 4 ) stIn = 0;
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
    var actiondataObj = controller.stateMachine.data;
    var currentMovePath = actiondataObj.movePath;
    var cX = actiondataObj.sourceX;
    var cY = actiondataObj.sourceY;
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
          util.logError(
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
view.fitScreenToDeviceOrientation = function(){
  var canvEl = controller.screenElement;

  canvEl.width = TILE_LENGTH*model.mapWidth;
  canvEl.height = TILE_LENGTH*model.mapHeight;

  controller.screenWidth  = parseInt( window.innerWidth/  TILE_LENGTH, 10 );
  controller.screenHeight = parseInt( window.innerHeight/ TILE_LENGTH, 10 );
};
view.ID_DIV_CWTWC_MSG_PANEL            = "cwt_info_box";
view.ID_DIV_CWTWC_MSG_PANEL_CONTENT    = "cwt_info_box_content";

view.DEFAULT_MESSAGE_TIME = 1000;

view._hideInfoMessage = function(){
  var panel = document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL );

  panel.className = "tooltip out";
};

view.hasInfoMessage = function(){
  return document.getElementById( view.ID_DIV_CWTWC_MSG_PANEL
            ).className !== "tooltip out";
};

view.showInfoMessage = function( msg, time ){
  if( arguments.length === 1 ) time = view.DEFAULT_MESSAGE_TIME;

  var panel = document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL );

  // panel.innerHTML = msg;
  document.getElementById(view.ID_DIV_CWTWC_MSG_PANEL_CONTENT ).innerHTML = msg;

  panel.className = "tooltip active";
  panel.style.position = "absolute";
  panel.style.left = parseInt(
    ((window.innerWidth/2) - (panel.offsetWidth/2)), 10
  )+"px";
  panel.style.top = parseInt(
    ((window.innerHeight/2) - (panel.offsetHeight/2)), 10
  )+"px";

  setTimeout( view._hideInfoMessage, time );
};
/**
 * SOME TILES THAT ARE KNOWN AS OVERLAYERS --> TODO this should be
 * set able via configs ( custom graphics )
 */
view.OVERLAYER = {
  MNTN:true,
  FRST:true
};

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
      else if( view.OVERLAYER[model.map[x][y]] === true ){
        view.markForRedraw(x,y);
      }
    }
  }
  else util.logError("illegal arguments ",x,",",y," -> out of view bounds");
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

view.markSelectionMapForRedraw = function( scope ){
  var cx = scope.selectionCX;
  var cy = scope.selectionCY;
  var data = scope.selectionData;

  for( var x=0;x<data.length; x++ ){
    var sMap = data[x];
    for( var y=0;y<sMap.length; y++ ){
      if( sMap[y] !== -1 ) view.markForRedraw( cx+x, cy+y );
    }
  }
};
view.spriteAnimation = {};

view._spriteAnimators = [];

view.registerSpriteAnimator = function( key, steps, timePerStep, updatorFn ){

  var holder = {};
  holder._stps = steps;
  holder._tps = timePerStep;
  holder._upt = updatorFn;
  holder.step = 0;
  holder.time = 0;

  view.spriteAnimation[key] = holder;
  view._spriteAnimators.push( holder );
};

view.getSpriteStep = function( key ){
  return view.spriteAnimation[key].step;
};

view.updateSpriteAnimations = function( delta ){
  var list = view._spriteAnimators;
  for( var i=0,e=list.length; i<e; i++ ){

    var anim = list[i];
    anim.time += delta;
    if( anim.time >= anim._tps ){

      // INCREASE STEP AND RESET TIMER
      anim.time = 0;
      anim.step++;

      if( anim.step >= anim._stps ){
        anim.step = 0;
      }

      // CALL UPDATER
      anim._upt();
    }
  }
};

// ---------------------------------------------------------------------------

view.registerSpriteAnimator( "SELECTION", 7, 150, function(){
  if( controller.stateMachine.state !== "MOVEPATH_SELECTION" &&
      controller.stateMachine.state !== "IDLE_R" &&
      controller.stateMachine.state !== "ACTION_SELECT_TARGET_A" &&
      controller.stateMachine.state !== "ACTION_SELECT_TARGET_B"  ) return;

  var x  = 0;
  var yS = 0;
  var xe = model.mapWidth;
  var ye = model.mapHeight;

  // ITERATE THROUGH THE SCREEN
  for( ; x<xe; x++ ){
    for( var y=yS ; y<ye; y++ ){
      if( controller.stateMachine.data.getSelectionValueAt( x, y ) > -1 ){

        view.markForRedraw( x,y );
      }
    }
  }
});

view.registerSpriteAnimator( "STATUS", 16, 375, function(){});

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
view.registerCommandHook({

  key: "AVIS",

  prepare: function( x,y, range ){
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
      }
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});
view.registerCommandHook({

  key: "ATUN",

  // ------------------------------------------------------------------------

  prepare: function( aid, admg, aUseAmmo, did, ddmg, dUseAmmo ){
    var sUnit = model.units[ aid ];
    var tUnit = model.units[ did ];

    this.step = 0;
    this.time = 0;

    if(        sUnit.hp <= 0 ){
      this.x = sUnit.x;
      this.y = sUnit.y;
    }
    else{
      //controller.updateUnitStats( sUnit );

      if(   tUnit.hp <= 0 ){
        this.x = tUnit.x;
        this.y = tUnit.y;
      }
      else{
        //controller.updateUnitStats( tUnit );
        this.step = -1;
      }
    }
  },

  // ------------------------------------------------------------------------

  render: function(){
    var step = this.step;
    if( step === -1 ) return;

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

  // ------------------------------------------------------------------------

  update: function( delta ){
    this.time += delta;
    if( this.time > 50 ){
      this.step++;
      this.time = 0;
    }
  },

  // ------------------------------------------------------------------------

  isDone: function(){
    return this.step === -1 || this.step === 10;
  }

});
view.registerCommandHook({

  key: "BDUN",

  prepare: function(  ){
    view.completeRedraw();
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});
view.registerCommandHook({

  key: "CTPR",

  prepare: function( cid, prid, px,py, points ){
    var property = model.properties[ prid ];

    if( property.capturePoints === 20 ){
      view.showInfoMessage( util.i18n_localized("propertyCaptured") );
    }
    else view.showInfoMessage(
      util.i18n_localized("propertyPointsLeft")+" "+property.capturePoints
    );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});
view.registerCommandHook({

  key: "EDGM",

  prepare: function( ){
    view.showInfoMessage( util.i18n_localized("gameHasEnded"), 1000*60*60 );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return false; // HACKY STOP FOR THE MILESTONES:P
  }

});
view.registerCommandHook({

  key: "IVMS",

  prepare: function(){
    var state = controller.stateMachine.state;
    var data = controller.stateMachine.data;
    if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){

      /*
      var menu = data.menu;
      if( data.action === 'unloadUnit' ){
        var old = menu;
        menu = [];
        for( var i=0, e=controller.input.menuSize-1; i<e; i++ ){
          menu[i] = model.units[ old[i] ].type;
        }
        menu[controller.input.menuSize-1] = old[ controller.input.menuSize-1 ];
      }
      */

      controller.showMenu( data.menu, data.menuSize, controller.mapCursorX, controller.mapCursorY );
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});
view.registerCommandHook({
  
  key: "MOVE",
  
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
    
    if( CLIENT_DEBUG ){
      util.logInfo(
        "drawing move from",
        "(",this.moveAnimationX,",",this.moveAnimationY,")",
        "with path",
        "(",this.moveAnimationPath,")"
      );
    }
    
    // CHECK STATUS
    // controller.updateUnitStats( model.units[ uid ] );
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
    
    var pic = view.getUnitImageForType( tp, state, color );
    
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
    return this.moveAnimationUid === -1;
  }
  
});
view.registerCommandHook({

  key: "NXTR",

  prepare: function(  ){
    if( model.rules.fogEnabled ){
      view.completeRedraw();
    }

    view.showInfoMessage( util.i18n_localized("day")+": "+model.day );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});
view.registerCommandHook({

  key: "RVIS",

  prepare: function( x,y, range ){
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
      }
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});
view.registerCommandHook({

  key: "SLFR",

  _check: function( x,y ){
  },

  _render: function( x,y, step, img ){
    if( step < 0 || step >= 10 ) return;

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
      img,
      scx,scy,
      scw,sch,
      tcx,tcy,
      tcw,tch
    );

    view.markForRedraw(x,y);
  },

  prepare: function( uid, sx,sy, prid, tx,ty ){
    var x = tx;
    var y = ty;
    this.x = x;
    this.y = y;
    var chk = this._check;

    chk( x, y-2 );

    chk( x-1, y-1 );
    chk( x  , y-1 );
    chk( x+1, y-1 );

    chk( x-2, y );
    chk( x-1, y );
    chk( x  , y );
    chk( x+1, y );
    chk( x+2, y );

    chk( x-1, y+1 );
    chk( x  , y+1 );
    chk( x+1, y+1 );

    chk( x, y+2 );

    this.step = 0;
    this.time = 0;
  },

  render: function(){
    var pic = view.getInfoImageForType("EXPLOSION_GROUND");
    var step = this.step;
    var chk = this._render;
    var x = this.x;
    var y = this.y;

    // CENTER
    chk( x  , y, step,pic );

    // INNER RING
    step -= 1;
    chk( x  , y-1, step,pic );
    chk( x-1, y, step,pic );
    chk( x+1, y, step,pic );
    chk( x  , y+1, step,pic );

    // OUTER RING
    step -= 3;
    chk( x-1, y+1, step,pic );
    chk( x+1, y+1, step,pic );
    chk( x-1, y-1, step,pic );
    chk( x+1, y-1, step,pic );
    chk( x, y-2, step,pic );
    chk( x, y+2, step,pic );
    chk( x-2, y, step,pic );
    chk( x+2, y, step,pic );
  },

  update: function( delta ){
    this.time += delta;
    if( this.time > 50 ){
      this.step++;
      this.time = 0;
    }
  },

  isDone: function(){
    return this.step === 13;
  }

});
view.registerCommandHook({

  key: "TRWT",

  prepare: function( x,y,uid ){
    this.time = 0;
    this.xp = x;
    this.yp = y;
    this.x = x * TILE_LENGTH;
    this.y = y * TILE_LENGTH;
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

});
view.registerCommandListener("ATUN",function( aid, admg, aUseAmmo, did ){
  controller.updateUnitStatus( aid );
  controller.updateUnitStatus( did );
});

view.registerCommandListener("CTPR",function( cid ){
  controller.updateUnitStatus( cid );
});

view.registerCommandListener("CRUN",function( x,y ){
  controller.updateUnitStatus( model.extractUnitId( model.unitPosMap[x][y] ) );
});

view.registerCommandListener("DMUN",function( uid ){
  controller.updateUnitStatus( uid );
});

view.registerCommandListener("HEUN",function( uid ){
  controller.updateUnitStatus( uid );
});

view.registerCommandListener("GUTP",function( uid ){
  var old = model.units[uid];
  controller.updateUnitStatus( model.extractUnitId( model.unitPosMap[ old.x ][ old.y ]  ));
});

view.registerCommandListener("LODU",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

view.registerCommandListener("JNUN",function( sid, tid ){
  controller.updateUnitStatus( tid );
});

view.registerCommandListener("MOVE",function( way, uid, x,y ){
  controller.updateUnitStatus( uid );
});

(function(){
  function dmgF( x,y ){
    if( model.isValidPosition(x,y) ){
      var unit = model.unitPosMap[x][y];
      if( unit !== null ){
        controller.updateUnitStatus( model.extractUnitId(unit) );
      }
    }
  }
  
  view.registerCommandListener("SLFR",function( uid, sx,sy, prid, tx,ty ){
    var x = tx;
    var y = ty;
    
    dmgF( x  ,y-2 );
    dmgF( x-1,y-1 );
    dmgF( x  ,y-1 );
    dmgF( x+1,y-1 );
    dmgF( x-2,y   );
    dmgF( x-1,y   );
    dmgF( x  ,y   );
    dmgF( x+1,y   );
    dmgF( x+2,y   );
    dmgF( x-1,y+1 );
    dmgF( x  ,y+1 );
    dmgF( x+1,y+1 );
    dmgF( x  ,y+2 );
  });
  
  view.registerCommandListener("SPPL",function( sid, x,y ){
    dmgF( x,y-1   );
    dmgF( x-1,y   );
    dmgF( x  ,y   );
    dmgF( x+1,y   );
    dmgF( x,y+1   );
  });
})();

view.registerCommandListener("UNUN",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

view.registerCommandListener("LDGM",function(){
  for( var i=0,e=model.units.length; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      controller.updateUnitStatus( i );
    }
  }
});

view.registerCommandListener("AVIS",function( x,y,range ){
  view.markForRedrawRange(x,y,range);
});

view.registerCommandListener("RVIS",function( x,y,range ){
  view.markForRedrawRange(x,y,range);
});

controller.registerMenuRenderer("BDUN",function( content, entry, index ){
  
  var cost = model.sheets.unitSheets[ content ].cost
  entry.innerHTML = util.i18n_localized(content)+" ("+cost+"$)";
});
controller.registerMenuRenderer("GMTP",function( content, entry, index ){
  entry.innerHTML = content+"$";
});
controller.infoPanelRender_ = {

  tile: function( x,y, unit, property, row, left, right ){
    left.innerHTML = util.i18n_localized(model.map[x][y]);
  },
  
  defense: function( x,y, unit, property, row, left, right ){
    left.innerHTML = util.i18n_localized("defense");
    right.innerHTML = model.sheets.tileSheets[ model.map[x][y] ].defense;
  },
  
  property: function( x,y, unit, property, row, left, right ){
    row.style.display = (property !== null)? "table-row": "none";
    if( property === null ) return;
    
    left.innerHTML = util.i18n_localized( property.type );
  },
  
  capturePoints: function( x,y, unit, property, row, left, right ){
    row.style.display = (property !== null)? "table-row": "none";
    if( property === null ) return;
    
    left.innerHTML = util.i18n_localized("capturePoints");
    right.innerHTML = property.capturePoints;
  },
  
  unit: function( x,y, unit, property, row, left, right ){
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized( unit.type );
  },
  
  hp: function( x,y, unit, property, row, left, right ){
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized("health");
    right.innerHTML = (parseInt( unit.hp/10,10)+1);
  },
  
  ammo: function( x,y, unit, property, row, left, right ){
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized("ammo");
    right.innerHTML = unit.ammo;  
  },
  
  fuel: function( x,y, unit, property, row, left, right ){
    row.style.display = (unit !== null)? "table-row": "none";
    if( unit === null ) return;
    
    left.innerHTML = util.i18n_localized("fuel");
    right.innerHTML = unit.fuel;  
  }
};

controller.infoPanelRenderComponents_ = {
  empty:true
};

// RENDERS THE INFORMATION PANEL IN THE MENU
controller.registerMenuRenderer("__infoPanel__",function( x,y, entry ){
  
  // COLLECT
  if( controller.infoPanelRenderComponents_.empty ){
    var table = document.getElementsByName("cwt_menu_header_table")[0];
    var rows = table.getElementsByTagName("tr");
    for( var i=0,e=rows.length; i<e; i++ ){
        
      var row = rows[i];
      var columns = row.getElementsByTagName("td");
      
      if( columns.length !== 2 ) util.raiseError();
      
      controller.infoPanelRenderComponents_[ row.attributes.name.value ] = [
        row,
        columns[0], columns[1]
      ];
    }
    
    delete controller.infoPanelRenderComponents_.empty;
  }
  
  var keys = Object.keys( controller.infoPanelRenderComponents_ );
  for( var i=0,e=keys.length; i<e; i++ ){
    
    var key = keys[i];
    var renderFn = controller.infoPanelRender_[key];
    var renderEl = controller.infoPanelRenderComponents_[key];
    
    var unit = model.unitPosMap[x][y];
    var property = model.propertyPosMap[x][y];
    
    if( renderFn === undefined ) continue;
    
    renderFn( x,y, unit, property, renderEl[0],renderEl[1],renderEl[2] );
  }
});
controller.registerMenuRenderer("__mainMenu__",function( content, entry, index ){
  entry.innerHTML = util.i18n_localized( content );
});
controller.registerMenuRenderer("UNUN",function( content, entry, index ){
  entry.innerHTML = model.units[ content ].type;  
});
controller.engineAction({

  name: "colorizeImages",
  key: "COLI",

  UNIT_INDEXES:{
    BLACK_MASK:8,
    RED:0,
    BLUE:3,
    GREEN:4,
    colors:6
  },

  PROPERTY_INDEXES:{
    RED:0,
    GRAY:1,
    BLUE:3,
    GREEN:4,
    YELLOW:5,
    BLACK_MASK:8,
    colors:4
  },
  
  action: function(){

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

      util.logInfo("replaced",replaced,"pixels for the type",tp);
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
    var unitTypes = CWT_MOD_DEFAULT.graphic.units;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      var tp = unitTypes[i][0];

      for( var si=0,se=UNIT_STATES.length; si<se; si++ ){

        var cCode = UNIT_STATES[si];
        var redPic = view.getUnitImageForType(tp,cCode,view.COLOR_RED);

        view.setUnitImageForType(
          replaceColors(
            redPic, IMG_MAP_UNIT,
            this.UNIT_INDEXES.colors,
            this.UNIT_INDEXES.RED, this.UNIT_INDEXES.BLUE
            ,tp
          ),
          tp,cCode,view.COLOR_BLUE
        );

        view.setUnitImageForType(
          replaceColors(
            redPic, IMG_MAP_UNIT,
            this.UNIT_INDEXES.colors,
            this.UNIT_INDEXES.RED, this.UNIT_INDEXES.GREEN
            ,tp
          ),
          tp,cCode,view.COLOR_GREEN
        );

        view.setUnitImageForType(
          replaceColors(
            redPic, IMG_MAP_UNIT,
            this.UNIT_INDEXES.colors,
            this.UNIT_INDEXES.RED, this.UNIT_INDEXES.BLACK_MASK
            ,tp
          ),
          tp,cCode,view.COLOR_BLACK_MASK
        );
      }
    }

    // FOR EVERY PROPERTY
    var propTypes = CWT_MOD_DEFAULT.graphic.properties;
    for( var i=0,e=propTypes.length; i<e; i++ ){
      var tp = propTypes[i][0];

      var redPic = view.getPropertyImageForType(tp,view.COLOR_RED);

      view.setPropertyImageForType(
        replaceColors(
          redPic, IMG_MAP_PROP,
          this.PROPERTY_INDEXES.colors,
          this.PROPERTY_INDEXES.RED, this.PROPERTY_INDEXES.BLUE
        ),
        tp,view.COLOR_BLUE
      );

      view.setPropertyImageForType(
        replaceColors(
          redPic, IMG_MAP_PROP,
          this.PROPERTY_INDEXES.colors,
          this.PROPERTY_INDEXES.RED, this.PROPERTY_INDEXES.GREEN
        ),
        tp,view.COLOR_GREEN
      );

      view.setPropertyImageForType(
        replaceColors(
          redPic, IMG_MAP_PROP,
          this.PROPERTY_INDEXES.colors,
          this.PROPERTY_INDEXES.RED, this.PROPERTY_INDEXES.GRAY
        ),
        tp,view.COLOR_NEUTRAL
      );

      view.setPropertyImageForType(
        replaceColors(
          redPic, IMG_MAP_PROP,
          this.PROPERTY_INDEXES.colors,
          this.PROPERTY_INDEXES.RED, this.PROPERTY_INDEXES.BLACK_MASK
        ),
        tp,view.COLOR_BLACK_MASK
      );
    }
  }
});
controller.engineAction({

  name: "cutImages",
  key: "CUTI",

  action: function(){

    var BASE_SIZE = CWT_MOD_DEFAULT.graphic.baseSize;

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

    if( DEBUG ){ util.logInfo("cutting unit commands into single types"); }

    var unitTypes = CWT_MOD_DEFAULT.graphic.units;
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

    if( DEBUG ){ util.logInfo("cutting unit commands into single types done"); }

    // ----------------------------------------------------------------------

    if( DEBUG ){ util.logInfo("cutting misc into single types"); }

    var misc = CWT_MOD_DEFAULT.graphic.misc;
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

    if( DEBUG ){ util.logInfo("cutting misc into single types done"); }
  }
});
controller.engineAction({

  name:"loadConfig",
  key:"LCFG",
  
  action: function(){
    var config = controller.storage.get("CWT_CONFIG")
    if( config === null ){

      if( CLIENT_DEBUG ){
        util.logInfo("creating fresh configuration object");
      }

      config = {
        lastUpdate: new Date()
      };

      controller.storage.set("CWT_CONFIG", config);
    }

    if( CLIENT_DEBUG ){
      util.logInfo(
        "loaded configuration object (timestamp:",
        config.lastUpdate,
        ")"
      );
    }

    // TODO do what is needed :P
  }
});
controller.engineAction({

  name:"loadImages",
  key:"LOIM",
  
  action: function(){
    if( CLIENT_DEBUG ){
      util.log("loading images... place lock");
    }
    
    controller.lockCommandEvaluation = true;

    // STEP 1 - LOADING THEM

    /** Contains the path to the image base. */
    var IMAGE_PATH = "../../../image/";

    var allLoaded = function( imgArray ){
      for( var i=0,e=imgArray.length; i<e; i++ ){

        // NOT ALL IMAGES ARE LOADED
        if( imgArray[i].complete !== true ) return false;
      }

      // ALL IMAGES ARE LOADED
      return true;
    };

    var loadImages = function( imgArray, cb ){
      var imgObjs = [];
      var types = [];
      var img;

      // CREATE IMAGE INSTANCES
      for( var i=0,e=imgArray.length; i<e; i++ ){
        img = new Image();
        img.src = IMAGE_PATH+imgArray[i][1];
        imgObjs[i] = img;
        types[i] = imgArray[i][0];
      }

      // WAIT FOR LOAD END
      var cbCaller = function(){
        if( allLoaded( imgObjs ) )  cb( types, imgObjs );
        else                        setTimeout( cbCaller, 250 );
      };
      cbCaller();
    };

    // ------------------------------------------------------------------------
    var leftToLoad = 4;

    // LOAD UNITS (1)
    if( CLIENT_DEBUG ){ util.logInfo("loading unit commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.units, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setUnitImageForType(
          images[i], types[i],
          view.IMAGE_CODE_IDLE, view.COLOR_RED
        );
      }
      if( CLIENT_DEBUG ){ util.logInfo("unit commands loaded"); }
      leftToLoad--;
    });

    // LOAD PROPERTIES (2)
    if( CLIENT_DEBUG ){ util.logInfo("loading property commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.properties, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setPropertyImageForType(
          images[i], types[i],
          view.COLOR_RED
        );
      }
      if( CLIENT_DEBUG ){ util.logInfo("property commands loaded"); }
      leftToLoad--;
    });

    // LOAD TILES (3)
    if( CLIENT_DEBUG ){ util.logInfo("loading tile commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.tiles, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setTileImageForType( images[i], types[i] );
      }
      if( CLIENT_DEBUG ){ util.logInfo("tile commands loaded"); }
      leftToLoad--;
    });

    // LOAD OTHER (4)
    if( CLIENT_DEBUG ){ util.logInfo("loading other commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.misc, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setInfoImageForType( images[i], types[i] );
      }
      if( CLIENT_DEBUG ){ util.logInfo("other commands loaded"); }
      leftToLoad--;
    });

    // WAIT FOR LOADING
    if( CLIENT_DEBUG ){ util.logInfo("waiting for commands"); }
    var modifyWaiter = function(){
      if( leftToLoad === 0 ){
        if( CLIENT_DEBUG ){
          util.logInfo("all images are loaded.. releasing lock");
        }
        controller.lockCommandEvaluation = false;
      }
      else{
        setTimeout( modifyWaiter, 250 );
      }
    };
    modifyWaiter();
  }
});
/** @constant */
controller.INPUT_KEYBOARD_CODE_LEFT  = 37;

/** @constant */
controller.INPUT_KEYBOARD_CODE_UP    = 38;

/** @constant */
controller.INPUT_KEYBOARD_CODE_RIGHT = 39;

/** @constant */
controller.INPUT_KEYBOARD_CODE_DOWN  = 40;

/** @constant */
controller.INPUT_KEYBOARD_CODE_BACKSPACE = 8;

/** @constant */
controller.INPUT_KEYBOARD_CODE_ENTER = 13;

/** @constant */
controller.INPUT_KEYBOARD_CODE_M = 77;

/** @constant */
controller.INPUT_KEYBOARD_CODE_N = 78;

controller.engineAction({

  name:"loadInputDevices",
  key:"LOID",
  
  action: function(){

    var detect = new DeviceDetection( navigator.userAgent );

    // **************************************************************
    // KEYBOARD SUPPORT FOR DESKTOP DEVICES
    if( detect.isDesktop() ){
      
      document.onkeyup = function( ev ){
        if( controller.stateMachine.state === "IDLE_R" ){
          
          switch( code ){
            case controller.INPUT_KEYBOARD_CODE_LEFT:
            case controller.INPUT_KEYBOARD_CODE_UP:
            case controller.INPUT_KEYBOARD_CODE_RIGHT:
            case controller.INPUT_KEYBOARD_CODE_DOWN:
            case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
            case controller.INPUT_KEYBOARD_CODE_ENTER:
              controller.cursorActionCancel();
              return false;
          }
        }
      };
      
      //document.onkeydown = function( ev ){
      document.onkeydown = function( ev ){
        if( CLIENT_DEBUG ){
          util.logInfo("got key code",ev.keyCode);
        }

        var state = controller.stateMachine.state;
        var inMenu = ( state === "ACTION_MENU" ||
                       state === "ACTION_SUBMENU" );
        
        var code = ev.keyCode;
        switch( code ){

          case controller.INPUT_KEYBOARD_CODE_LEFT:
            controller.moveCursor( model.MOVE_CODE_LEFT, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_UP:
            if( !inMenu ) controller.moveCursor( model.MOVE_CODE_UP, 1 );
            else controller.decreaseMenuCursor();
            
            break;

          case controller.INPUT_KEYBOARD_CODE_RIGHT:
            controller.moveCursor( model.MOVE_CODE_RIGHT, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_DOWN:
            if( !inMenu ) controller.moveCursor( model.MOVE_CODE_DOWN, 1 );
            else controller.increaseMenuCursor();
            
            break;

          case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
            controller.cursorActionCancel();
            break;

          case controller.INPUT_KEYBOARD_CODE_ENTER:
            controller.cursorActionClick();
            break;

          case controller.INPUT_KEYBOARD_CODE_M:
            if( controller.screenScale < 3 ){
              controller.setScreenScale( controller.screenScale+1 );
            }
            break;

          case controller.INPUT_KEYBOARD_CODE_N:
            if( controller.screenScale > 1 ){
              controller.setScreenScale( controller.screenScale-1 );
            }
            break;
        }

        switch( code ){
          case controller.INPUT_KEYBOARD_CODE_LEFT:
          case controller.INPUT_KEYBOARD_CODE_UP:
          case controller.INPUT_KEYBOARD_CODE_RIGHT:
          case controller.INPUT_KEYBOARD_CODE_DOWN:
          case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
          case controller.INPUT_KEYBOARD_CODE_ENTER:
          case controller.INPUT_KEYBOARD_CODE_M:
          case controller.INPUT_KEYBOARD_CODE_N:
            return false;
        }
      };

    }

    // **************************************************************
    // MOUSE SUPPORT FOR DESKTOP DEVICES
    if( detect.isDesktop() ){
      var canvas = document.getElementById( "cwt_canvas" );

      function MouseWheelHandler(e){
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if( delta > 0 ){
          // ZOOM IN
          if( controller.screenScale < 3 ){
            controller.setScreenScale( controller.screenScale+1 );
          }
        }
        else{
          // ZOOM OUT
          if( controller.screenScale > 1 ){
            controller.setScreenScale( controller.screenScale-1 );
          }
        }
      }

      /*
      if( canvas.addEventListener){
        // IE9, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
      }
      // IE 6/7/8
      else canvas.attachEvent("onmousewheel", MouseWheelHandler);
      */

      canvas.onmousemove = function(ev){
        var x,y;

        if( typeof ev.offsetX === 'number' ){
          x = ev.offsetX;
          y = ev.offsetY;
        }
        else {
          x = ev.layerX;
          y = ev.layerY;
        }

        // to tile position
        var x = parseInt( x/16 , 10);
        var y = parseInt( y/16 , 10);

        /*
        if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
          userInput.appendToCurrentMovePath(x,y);
        }*/

        controller.setCursorPosition(x,y);
      };

      canvas.onmousedown = function(ev){
        switch(ev.which){
          case 1: controller.cursorActionClick(); break;    // LEFT
          case 2: break;                                    // MIDDLE
          case 3: controller.cursorActionCancel(); break;   // RIGHT
        }
      };
      
      canvas.onmouseup = function(ev){
        if( controller.stateMachine.state === "IDLE_R" ){
          switch(ev.which){
            case 3: controller.cursorActionCancel(); break;   // RIGHT
          }
        }
      };
    }

    // **************************************************************
    // TOUCH SUPPORT FOR TOUCH DEVICES
    if( detect.isAndroid() || detect.isTouchDevice() ){
      var appEl = document.getElementById( "cwt_canvas" );
      var hammer = new Hammer( appEl, { prevent_default: true });
      // var dragDisX = 0;
      // var dragDisY = 0;

      hammer.ontap     = function( ev ){
        var cv = appEl;
        var x = ev.position[0].x;
        var y = ev.position[0].y;

        var tileLen = controller.screenScale*TILE_LENGTH;
        var x = parseInt( x/tileLen, 10);
        var y = parseInt( y/tileLen, 10);

        // BUGFIX: HAMMER JS SEEMS TO GET THE SCREEN POSITION, NOT THE
        // POSITION ON THE CANVAS, EVEN IF IT IS BIND TO THE CANVAS
        x = x + controller.screenX;
        y = y + controller.screenY;


        // TODO ENABLE SOUND

        // INVOKE ACTION
        controller.setCursorPosition(x,y);
        controller.cursorActionClick();

        // TODO PREPARE DRAG SELECTION

        /*
        if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
          userInput._input_touch_cDisX = x;
          userInput._input_touch_cDisY = y;
        }*/
      };

      hammer.onhold    = function(){
        controller.cursorActionCancel();
      };

      hammer.onrelease = function(ev){
        if( controller.stateMachine.state === "IDLE_R" ){
          controller.cursorActionCancel();
        }
      };

      hammer.ondrag    = function(ev){
        /*
         var cv = document.getElementById( client.ID_CANVAS );

         var disX = ev.distanceX - cv.offsetLeft;
         var disY = ev.distanceY - cv.offsetTop;
         userInput._input_touch_cDisTouchX = disX;
         userInput._input_touch_cDisTouchY = disY;

         var x = userInput._input_touch_cDisX+ parseInt( disX/ screen.tileSizeX, 10 );
         var y = userInput._input_touch_cDisY+ parseInt( disY/ screen.tileSizeY, 10 );

         userInput.appendToCurrentMovePath(x,y);
         */
      };

      hammer.ondragend = function(ev){
        var tileSize = TILE_LENGTH*controller.screenScale;
        var a = ev.angle;
        var d = 0;

        // GET DIRECTION
             if( a >= -135 && a < -45  ) d = model.MOVE_CODE_UP;
        else if( a >= -45  && a < 45   ) d = model.MOVE_CODE_RIGHT;
        else if( a >= 45   && a < 135  ) d = model.MOVE_CODE_DOWN;
        else if( a >= 135  || a < -135 ) d = model.MOVE_CODE_LEFT;

        // get distance
        var dis = parseInt( ev.distance/tileSize, 10 );
        if( dis === 0 ) dis = 1;

        controller.shiftScreenPosition( d, dis );

        /* ==> MOVE STATE
         var x = cDisX+ parseInt( cDisTouchX / screen.tileSizeX, 10 );
         var y = cDisY+ parseInt( cDisTouchY / screen.tileSizeY, 10 );

         userInput.invokeActionAt( x, y );

         userInput._input_touch_cDisX = -1;
         userInput._input_touch_cDisY = -1;
         userInput._input_touch_cDisTouchX = 0;
         userInput._input_touch_cDisTouchY = 0;
         */
      };

      hammer.ontransformend = function(ev){
        if( ev.scale > 1 ){
          // ZOOM IN
          if( controller.screenScale < 3 ){
            controller.setScreenScale( controller.screenScale+1 );
          }
        }
        else{
          // ZOOM OUT
          if( controller.screenScale > 1 ){
            controller.setScreenScale( controller.screenScale-1 );
          }
        }
        return false;
      };
    }
  }

});
controller.engineAction({

  name:"loadSounds",
  key:"LOSO",
  
  action: function(){
  }
});
controller.engineAction({

  name:"startRendering",
  
  key:"STRE",

  action: function(){
    controller.noRendering = false;

    view.fitScreenToDeviceOrientation();
    view.completeRedraw();
  }
});

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








