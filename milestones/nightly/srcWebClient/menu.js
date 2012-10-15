cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    client.ID_MENU = "CWTWC_MENU";

    client.menuPopupElement = null;

    client.triggerMenuCancel = function(){
      if( util.DEBUG ){
        util.logInfo("closing menu via cancel event");
      }

      client.invokeCancel();
      $( '#'+client.ID_MENU ).hide( );
    };

    client.triggerMenuAction = function( index ){
      if( util.DEBUG ){
        util.logInfo("doing menu action for index", index);
      }

      client.invokeActionFromMenu( index );
      $( '#'+client.ID_MENU ).hide( );
    };

    function connectListener( el, index ){
      el.off('click');
      el.click(function(){ client.triggerMenuAction( index ); })
    }

    client.showMenu = function( x, y, actions ){
      if( util.DEBUG ){
        util.logInfo("open action menu");
      }

      // GET SCREEN POSITIONS
      x = x - client.screenX;
      y = y - client.screenY;
      if( y > (client.screenHeight/2) ) y = y - actions.length - 1 ;
      if( x > (client.screenWidth/2) ) x = x - 6;

      // GENERATE ENTRIES

      for( var i=0,e=9 ; i<=e; i++ ){ $('#menuEntry_'+i).hide(); }
      for( var i=0,e=actions.length ; i<e; i++ ){
        $('#menuEntry_'+i).show();
        connectListener( $('#menuEntry_'+i), i );
        $('#menuEntry_'+i).html( client.localizedString( actions[i] ) );
      }

      $('#menuEntry_CANCEL').click( function(){client.triggerMenuCancel();});
      $('#menuEntry_CANCEL').html( client.localizedString( "cancel" ) );

      $( '#'+client.ID_MENU ).css("top",y*32+16);
      $( '#'+client.ID_MENU ).css("left",x*32+16);
      $( '#'+client.ID_MENU ).show( );
    };
  });