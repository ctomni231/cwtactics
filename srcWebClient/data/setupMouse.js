controller.setupMouseControls = function( canvas, menuEl ){
  if( constants.DEBUG ) util.log("initializing mouse support");

  // MENU HINTS
  var mouseInMenu = false;
  menuEl.onmouseout = function(){ mouseInMenu=false; };
  menuEl.onmouseover = function(){ mouseInMenu=true; };

  var len = TILE_LENGTH;
  var msx = 0;
  var msy = 0;
  var menusy = 0;
  document.addEventListener("mousemove", function(ev){
    var id = ev.target.id;
    if( id !== "cwt_canvas" && !controller.menuVisible ) return;

    var x,y;
    ev = ev || window.event;
    //if( inClick ) return;

    if( controller.menuVisible ){
      x = ev.pageX;
      y = ev.pageY;

      if( menusy !== -1 ){
        if( y <= menusy-16 ){
          controller.screenStateMachine.event("INP_UP");
          menusy = y;
        }
        else if( y >= menusy+16 ){
          controller.screenStateMachine.event("INP_DOWN");
          menusy = y;
        }
      }
      else menusy = y;
    }
    else{

      if( typeof ev.offsetX === 'number' ){
        x = ev.offsetX;
        y = ev.offsetY;
      }
      else {
        x = ev.layerX;
        y = ev.layerY;
      }

      // TO TILE POSITION
      x = parseInt( x/len , 10);
      y = parseInt( y/len , 10);

      controller.screenStateMachine.event("INP_HOVER",x,y);
    }
  });

  //var inClick = false;
  document.onmousedown = function(ev){
    ev = ev || window.event;
    //inClick = true;

    if( typeof ev.offsetX === 'number' ){
      msx = ev.offsetX;
      msy = ev.offsetY;
    }
    else {
      msx = ev.layerX;
      msy = ev.layerY;
    }
  };

  document.onmouseup = function(ev){

    ev = ev || window.event;
    //inClick = false;

    var msex;
    var msey;
    if( typeof ev.offsetX === 'number' ){
      msex = ev.offsetX;
      msey = ev.offsetY;
    }
    else {
      msex = ev.layerX;
      msey = ev.layerY;
    }

    var dex = Math.abs( msx-msex );
    var dey = Math.abs( msy-msey );
    menusy = -1;

    switch(ev.which){

      case 1: controller.screenStateMachine.event("INP_ACTION"); break; // LEFT
      case 2: break;                                                    // MIDDLE
      case 3: controller.screenStateMachine.event("INP_CANCEL"); break; // RIGHT
    }
  };
};
