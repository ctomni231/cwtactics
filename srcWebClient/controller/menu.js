/**
 * Menu controller that holds and controls the menu system and content.
 */
cwtwc.menuController = StateMachine.create({

  initial: 'off',

  error: function(eventName, from, to, args, errorCode, errorMessage) {
    if( cwt.DEBUG ){
      cwt.info("illegal transition in menu at state '"+from+"' via event '"+eventName+"'");
    }

    return "";
  },

  events: [
    { name: 'init', from: 'off',        to: 'hidden' },
    { name: 'show', from: 'hidden',     to: 'visible' },
    { name: 'hide', from: 'visible',    to: 'hidden'  }
  ],

  callbacks: {

    oninit: function(){
      if( cwt.DEBUG ) cwt.info("initializing web client menu controller");

      var menuEl = document.getElementById( cwtwc.MENU_CONTAINER );

      cwtwc.menuController._menuEl = menuEl;
      cwtwc.menuController._menu = [];
    },

    onhide: function(){
      cwtwc.menuController._menu.splice(0);
      cwtwc.menuController._popup.close();
    },

    onenterhidden: function(){
      if( cwt.DEBUG ) cwt.info("menu: closed");
    },

    onshow: function( event, from, to, actionMap, x, y ){
      if( cwt.DEBUG ) cwt.info("menu: open");

      var menu = $('#menu');
      cwtwc.menuController._menu = actionMap;

      // get screen positions
      x = x - cwtwc.sx;
      y = y - cwtwc.sy;
      if( y > (cwtwc.sh/2) ) y = y - actionMap.length - 1 ;
      if( x > (cwtwc.sw/2) ) x = x - 6;

      // generate entries

      for( var i=0,e=9 ; i<=e; i++ ){ $('#menuEntry_'+i).hide(); }
      for( var i=0,e=actionMap.length ; i<e; i++ ){
        $('#menuEntry_'+i).show();
        $('#menuEntry_'+i).html(actionMap[i].k);
      }

      // make it visible
      cwtwc.menuController._popup = menu.bPopup({
        modalClose: false,
        position: [ x*32+16, y*32+15 ],
        opacity: 0.3,
        fadeSpeed: 500,
        positionStyle: 'fixed'
      });
    }
  }
});