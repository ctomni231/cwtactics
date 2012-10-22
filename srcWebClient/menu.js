/**
 *
 */
menu.triggerMenuCancel = function(){
  if( util.DEBUG ) util.logInfo("closing menu via cancel event");
  
  sound.play("MENU_OK");
  $( '#'+client.ID_MENU ).hide();
  userInput.invokeCancel();
};

/**
 *
 */
menu.triggerMenuAction = function( index ){
  if( util.DEBUG ) util.logInfo("doing menu action for index", index);

  sound.play("MENU_OK");
  $( '#'+client.ID_MENU ).hide();
  userInput.invokeActionFromMenu( index );
};

/**
 *
 */
menu._connectListener = function( el, index ){
  el.off('click');
  el.click(function(){
    menu.triggerMenuAction( index );
  });
};

/**
 * @private
 */
menu.showMenu = function( x, y, actions ){

  if( x === -1 || y === -1 ){
    x = menu._oldMenuX;
    y = menu._oldMenuY;
  }
  else{
    // GET SCREEN POSITIONS
    x = x - screen.screenX;
    y = y - screen.screenY;
    if( y > (screen.screenHeight/2) ) y = y - actions.length - 1 ;
    if( x > (screen.screenWidth/2) ) x = x - 6;
  }

  if( util.DEBUG ) util.logInfo("open action menu");

  // GENERATE ENTRIES

  for( var i=0,e=9 ; i<=e; i++ ){ $('#menuEntry_'+i).hide(); }
  for( var i=0,e=actions.length ; i<e; i++ ){
    $('#menuEntry_'+i).show();
    menu._connectListener( $('#menuEntry_'+i), i );
    $('#menuEntry_'+i).html( locale.localizedString( actions[i] ) );
  }

  $('#menuEntry_CANCEL').click( function(){ menu.triggerMenuCancel();});
  $('#menuEntry_CANCEL').html( locale.localizedString( "cancel" ) );

  menu._oldMenuX = x;
  menu._oldMenuY = y;

  $( '#'+client.ID_MENU ).css("top",y*32+16);
  $( '#'+client.ID_MENU ).css("left",x*32+16);
  $( '#'+client.ID_MENU ).css("z-index",2000);
  $( '#'+client.ID_MENU ).show( );
};

/**
 * Holds the last known x coordinate of the menu.
 *
 * @private
 */
menu._oldMenuX = 0;

/**
 * Holds the last known y coordinate of the menu.
 *
 * @private
 */
menu._oldMenuY = 0;