cwtwc.plugins.register({

  id:"touchControls",

  availableInEnvironment: function(){
    // TODO
  },

  enable: function(){
    var appEl = document.getElementById( cwtwc.APP_CONTAINER );
    var hammer = new Hammer( appEl, { prevent_default: true });
    this.hammer = hammer;

    /* DRAG EVENT */
    hammer.ondragend = function(ev){

      // get direction
      var a = ev.angle;
      var d = 0;

      if( a >= -135 && a < -45  ) d = 0;
      else if( a >= -45  && a < 45   ) d = 1;
      else if( a >= 45   && a < 135  ) d = 2;
      else if( a >= 135  || a < -135 ) d = 3;

      // get distance
      var dis = parseInt( ev.distance/32, 10 );
      if( dis === 0 ) dis = 1;

      cwtwc.betterMapShift( d, dis );
    };

    /* TAP EVENT */
    hammer.ontap = function(ev) {
      var x = parseInt( ev.position[0].x/cwtwc.tx, 10 );
      var y = parseInt( ev.position[0].y/cwtwc.ty, 10 );

      if( cwtwc.cursorX !== x || cwtwc.cursorY !== y ){
        cwtwc._rerenderCursorTiles();
        cwtwc.cursorX = x;
        cwtwc.cursorY = y;
      }

      // convert screen to real position
      x = x+ cwtwc.sx;
      y = y+ cwtwc.sy;

      cwtwc.click( x, y );
    };

    /* HOLD TOUCH EVENT */
    hammer.onhold = function( ev ){
      var x = parseInt( ev.position[0].x/cwtwc.tx, 10 );
      var y = parseInt( ev.position[0].y/cwtwc.ty, 10 );

      cwtwc.back( x, y );
    };

    /* RELEASE TOUCH EVENT */
    hammer.onrelease = function(){
      // if( cwt.DEBUG ) cwt.log.error("feature is not implemented yet!");
    };
  },

  disable: function(){
    this.hammer.destroy();
    this.hammer = null;
  }

});