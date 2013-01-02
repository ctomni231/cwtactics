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
controller.menuEntryListElement = document.getElementById("cwt_menu_entries");

/** @private */
controller._connectMenuListener = function( el, index ){

  // TODO FAIL TOO
  el.onclick = function(){
    if( CLIENT_DEBUG ){
      util.logInfo("menu element",index,"will be triggered");
    }

    controller.menuCursorIndex = index;
    controller.cursorActionClick();
  };

  // TODO FAIL!!!
  el.onmouseover = function(){
    //document.getElementById( "cwtwc_menu_desc" ).innerHTML =
    //  locale.localizedString( controller.actionList[index]+".desc" );
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

  if( arguments.length === 1 ){
    x = controller.menuPosX;
    y = controller.menuPosY;
  }

  if( CLIENT_DEBUG && !model.isValidPosition(x,y) ){
    throw Error("invalid menu position");
  }

  var entries = controller.menuEntryListElement.children;

  // HIDE THEM
  for( var i=0,e=entries.length ; i<e; i++ ){
    entries[i].style.display = "none";
  }

  // SHOW THEM
  for( var i=0,e=size ; i<e; i++ ){
    var entry;

    if( entries.length > i ) entry = entries[i].children[0];
    else{

      // PERFORMANCE HIT ?
      entry = document.createElement("button");
      controller._connectMenuListener( entry, i );
      var li = document.createElement("li");
      li.appendChild( entry );
      controller.menuEntryListElement.appendChild( li );
    }

    entry.innerHTML = util.i18n_localized( menu[i] );
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

  // SET MENU STYLE
  var menuStyle = controller.menuElement.style;
  menuStyle.top = (y*tileSize)+"px";
  menuStyle.left = (x*tileSize)+"px";
  menuStyle.zIndex = 2000;
  menuStyle.display = "block";
};

/**
 *
 */
controller.hideMenu = function(){
  if( CLIENT_DEBUG ){ util.logInfo("closing GUI menu"); }

  controller.menuElement.style.display = "none";
  controller.menuCursorIndex = -1;
};