util.scoped(function(){
  
  /** @private */
  var menuRenderer = {};
  
  var menuElement = document.getElementById("cwt_menu");
  
  var menuHeaderElement = document.getElementById("cwt_menu_header");
  
  var menuEntryContentElement = document.getElementById("cwt_menu_content");
  
  var menuEntryListElement = document.getElementById("cwt_menu_entries");
  
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
    if( constants.DEBUG ) util.log("opening GUI menu");
    
    var tileSize = TILE_LENGTH*controller.screenScale;
    
    var renderer = menuRenderer["__mainMenu__"];
    if( controller.stateMachine.state === "ACTION_SUBMENU" ){
      var newRend = menuRenderer[ controller.stateMachine.data.action.selectedEntry ];
      if( newRend ) renderer = newRend;
    }
    
    if( arguments.length === 1 ){
      x = controller.menuPosX;
      y = controller.menuPosY;
    }
    
    if( !model.isValidPosition(x,y) ) throw Error("invalid menu position");
    
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
    
    // SHOW IT
    menuElement.className = "uiPopup show";
    controller.menuVisible = true;
    controller.setMenuIndex( 0 );
  };
  
  /**
   *
   */
  controller.hideMenu = function(){
    if( constants.DEBUG ) util.log("closing GUI menu");
    
    menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
    
    menuElement.className = "uiPopup hide";
    controller.menuCursorIndex = -1;
    controller.menuVisible = false;
  };
  
  controller.menuVisible = false;
  
  controller.isMenuOpen = function(){
    return controller.menuVisible;
  };
  
  controller.registerMenuRenderer = function( key, renderer ){
    if( menuRenderer.hasOwnProperty( key ) ){
      util.raiseError("renderer for",key,"is already registered");
    }
    
    menuRenderer[ key ] = renderer;
  };
  
});