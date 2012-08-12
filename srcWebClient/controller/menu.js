/**
 * Menu controller that holds and controls the menu system and content.
 */
cwt.client.menuController = StateMachine.create({

  initial: 'off',

  error: function(eventName, from, to, args, errorCode, errorMessage) {
    if( cwt.DEBUG ){
      cwt.log.info("illegal transition in menu at state '"+from+"' via event '"+eventName+"'");
    }

    return "";
  },

  events: [
    { name: 'init',        from: 'off',        to: 'hidden' },
    { name: 'show',        from: 'hidden',     to: 'visible' },
    { name: 'cancel',      from: 'visible',    to: 'hidden'  },
    { name: 'doAction',    from: 'visible',    to: 'hidden'  },
    { name: 'intoSubMenu', from: 'visible',    to: 'visible' },
    { name: 'goBack',      from: 'visible',    to: 'visible' }
  ],

  callbacks: {

    oninit: function(){
      if( cwt.DEBUG ) cwt.log.info("initializing web client menu controller");

      var menuEl = document.getElementById( cwt.client.MENU_CONTAINER );

      cwt.client.menuController._menuEl = menuEl;
      cwt.client.menuController._menu = [];
      cwt.client.menuController._active = null;
    },

    oncancel: function(){
      cwt.client.menuController._menu.splice(0);
      cwt.client.menuController._active = null;

      if( cwt.DEBUG ) cwt.log.info("menu: cancel triggered");

      cwt.client.inputController.click();
      cwt.client.menuController._popup.close();
    },

    onenterhidden: function(){
      if( cwt.DEBUG ) cwt.log.info("menu: closed");
    },

    onbeforeintoSubMenu: function(){
      if( cwt.client.menuController._active === null ) return false;
    },

    onintoSubMenu: function(){

    },

    ondoAction: function( event, from, to, index ){
      if( cwt.DEBUG ) cwt.log.info("menu: click on {1} (index: {0})", index, this._menu[index].k );

      try{
        cwt.action.doAction( cwt.client.menuController._menu[index] );
      }
      catch(e){
        cwt.log.error("could not doing action due {0}", e.message );
      }

      cwt.client.inputController.click();
      cwt.client.menuController._popup.close();
    },

    onshow: function( event, from, to, actionMap, x, y ){
      if( cwt.DEBUG ) cwt.log.info("menu: open");

      // TODO: get rid of jquery!

      var menu = $('#menu');
      cwt.client.menuController._menu = actionMap;

      // get screen positions
      x = x - cwt.client.sx;
      y = y - cwt.client.sy;
      if( y > (cwt.client.sh/2) ) y = y - actionMap.length - 1 ;
      if( x > (cwt.client.sw/2) ) x = x - 6;

      // generate entries

      for( var i=0,e=9 ; i<=e; i++ ){ $('#menuEntry_'+i).hide(); }
      for( var i=0,e=actionMap.length ; i<e; i++ ){
        $('#menuEntry_'+i).show();
        $('#menuEntry_'+i).html(actionMap[i].k);
      }

      // make it visible
      cwt.client.menuController._popup = menu.bPopup({
        modalClose: false,
        position: [ x*32+16, y*32+15 ],
        opacity: 0.3,
        fadeSpeed: 500,
        positionStyle: 'fixed'
      });
    }
  }

});