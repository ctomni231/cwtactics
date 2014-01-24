util.scoped(function(){

  var MENU_WIDTH = 250;
  
  // -----------------------------------------------------------------------------
  
  // All known 
  //
  var menuRenderer            = {};

  // Registers a renderer for an (sub-)menu.
  //
  controller.registerMenuRenderer = function( key, renderer ){
    assert(!menuRenderer.hasOwnProperty( key ),
            "renderer for",key,"is already registered");
    
    menuRenderer[key] = renderer;
  };
  
  // -----------------------------------------------------------------------------

  // The menu element.
  //
  var menuElement = document.getElementById("cwt_menu");
  
  // The page up button.
  //
  // var menu_button_up = document.getElementById("cwt_menu_up");
  
  // The page down button.
  //
  // var menu_button_down = document.getElementById("cwt_menu_down");

  //
  //
  var menuHeaderElement = document.getElementById("cwt_menu_header");

  //
  //
  var menuEntryListElement = document.getElementById("cwt_menu_entries");

  //
  //
  var menuEntryContentElement = document.getElementById("cwt_menu_content");

  //
  //
  var pageUpBtn = document.getElementById("cwt_menu_pageUp");
    
  //
  // 
  var pageDownBtn = document.getElementById("cwt_menu_pageDown");
  
  //
  //
  var styleButton = "button_active";
  
  // Size of a menu page.
  //
  var menuSize = 10;
  
  // Current page of the menu.
  //
  var menuPage = 0;
    
  // generates the menu elements
  //
  (function(){
    var createButtonEvents = function( element, index ){
      element.onmouseover = function(){
        controller.setMenuIndex( /*(menuPage*menuSize)+*/index,false);
      };
      
      element.onclick = function(){
        controller.screenStateMachine.event("INP_ACTION");
      };
    };
    
    pageUpBtn.onclick = function(){
      controller.menu_prevPage();
    };
    
    pageDownBtn.onclick = function(){ 
      controller.menu_nextPage(); 
    };
    
    var fragment = document.createDocumentFragment();

    for( var i=0,e=menuSize; i<e; i++ ){
      var entry = document.createElement("button");
      var li = document.createElement("li");
      
      createButtonEvents( entry, i );
      
      li.appendChild( entry );
      fragment.appendChild( li );
    }
    
    // append fragment to the menu
    menuEntryListElement.appendChild( fragment );
  })();
  
  // set the menu width
  menuElement.style.width = MENU_WIDTH+"px";
    
  // Selects a given page in the menu
  //
  var selectPage = function( page, first ){
    var menu = controller.stateMachine.data.menu;
    var entries = menuEntryListElement.children;
    var relIndex = menuSize*page;
    
    // select menu renderer
    var renderer = menuRenderer["__mainMenu__"];
    if( controller.stateMachine.state === "ACTION_SUBMENU" ){
      var newRend = menuRenderer[ controller.stateMachine.data.action.selectedEntry ];
      if( newRend ) renderer = newRend;
    }
    
    // render elements
    for( var i=0,e=menuSize; i<e; i++ ){
      if( relIndex+i < menu.size ){
        entries[i].style.display = "";
        
        renderer( menu.data[relIndex+i], 
                  entries[i].children[0], 
                  relIndex+i, 
                  menu.enabled[relIndex+i] );
      } else{
        entries[i].style.display = "none";
      }
    }
    
    if( first ) controller.setMenuIndex(0);
    else controller.setMenuIndex(menuSize-1);
    
    menuPage = page;
  };
  
  // Index of the current selected menu entry.
  // 
  controller.menuCursorIndex = -1;

  controller.menu_getSelectedIndex = function(){
    return (menuPage*menuSize) + controller.menuCursorIndex;
  };
  
  // Sets the menu cursor index.
  //
  controller.setMenuIndex = function( index ){
    var entries = menuEntryListElement.children;

    // unfocus old index
    if( controller.menuCursorIndex !== -1 ){
      entries[ controller.menuCursorIndex ].className = "";
    }
    
    // set index
    controller.menuCursorIndex = index;
    
    // focus new index 
    entries[ index ].className = styleButton;
    entries[ index ].children[0].focus();
    controller.audio_playSound(model.data_sounds.MENUTICK);
  };

  // Resets the menu cursor index to the initial state.
  //
  controller.resetMenuCursor = function(){
    if( controller.menuCursorIndex !== -1 ){
      menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
    }
    
    controller.menuCursorIndex = 0;
  };

  // Increases the menu cursor index.
  //
  controller.increaseMenuCursor = function(){
    if( controller.menuCursorIndex < menuSize-1 &&
        controller.menu_getSelectedIndex() < controller.stateMachine.data.menu.size-1 ){
      controller.setMenuIndex(controller.menuCursorIndex+1);
    } else controller.menu_nextPage();
  };

  // Decreases the menu cursor index.
  //
  controller.decreaseMenuCursor = function(){
    if( controller.menuCursorIndex > 0 ){
      controller.setMenuIndex(controller.menuCursorIndex-1);
    } else controller.menu_prevPage();
  };
  
  // Selects the previous page.
  //
  controller.menu_prevPage = function(){
    if( menuPage > 0 ) selectPage( menuPage-1, false );
  };
  
  // Selects the next page.
  //
  controller.menu_nextPage = function(){
    if( menuPage < (controller.stateMachine.data.menu.size/menuSize)-1 ){
      selectPage( menuPage+1, true );
    }
  };
  
  // -----------------------------------------------------------------------------
  
  // True when the menu is visible, else false.
  //
  controller.menuVisible = false;
    
  // Actual x position of the menu.
  //
  var menuPosX = -1;

  // Actual y position of the menu.
  //
  var menuPosY = -1;

  // Generates the menu and shows them.
  //
  controller.showMenu = function( menu, x, y ){
    var tileSize = TILE_LENGTH*controller.screenScale;

    if( arguments.length === 1 ){
      x = menuPosX;
      y = menuPosY;
    }
    
    // select first page
    selectPage(0,true);

    // pagination ?
    if( menu.size > menuSize ){
      pageDownBtn.style.display = "";
      pageUpBtn.style.display = "";
    } else { 
      pageDownBtn.style.display = "none";
      pageUpBtn.style.display = "none";
    }
    
    // set menu position
    x = x - controller.screenX;
    y = y - controller.screenY; 
    controller.menuPosX = x;
    controller.menuPosY = y;
    
    // check the screen position
    var tPosX = x*tileSize;
    var tPosY = y*tileSize;
    if( tPosX + MENU_WIDTH >= controller.screenWidthPx ){
      tPosX = controller.screenWidthPx - MENU_WIDTH - 10; 
    }
    if( tPosY + menuElement.offsetHeight >= controller.screenHeightPx ){
      tPosY = controller.screenHeightPx - menuElement.offsetHeight - 10; 
    }
    
    // make the menu visible
    menuElement.style.left = tPosX+"px";
    menuElement.style.top  = tPosY+"px";
    menuElement.style.opacity = 1;
    controller.menuVisible = true;
  };

  // Hides the menu.
  //
  controller.hideMenu = function(){
    
    menuElement.style.left = "-1000px";
    menuElement.style.top  = "-1000px";
    menuElement.style.opacity = 0;
    controller.menuVisible = false;
    controller.resetMenuCursor();
  };

  // True when the menu is visible, else false.
  //
  controller.isMenuOpen = function(){
    return controller.menuVisible;
  };

});
