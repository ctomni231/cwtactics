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