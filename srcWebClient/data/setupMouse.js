controller.setupMouseControls = function( canvas, menuEl ){
  if( DEBUG ) util.log("initializing mouse support");

  controller.screenElement.addEventListener("mousemove", function(ev){
    var id = ev.target.id;

    var x,y;
    ev = ev || window.event;

    if( typeof ev.offsetX === 'number' ){
      x = ev.offsetX;
      y = ev.offsetY;
    }
    else {
      x = ev.layerX;
      y = ev.layerY;
    }

    // TO TILE POSITION
    x = parseInt( x/TILE_LENGTH , 10);
    y = parseInt( y/TILE_LENGTH , 10);

    controller.screenStateMachine.event("INP_HOVER",x,y);
  });

  controller.screenElement.onmouseup = function(ev){

    if( controller.input_blocked ) return false;
    
    // click on canvas while menu is open -> cancel always
    if( controller.menuVisible ){
      controller.screenStateMachine.event("INP_CANCEL");
      return;
    }

    ev = ev || window.event;
    switch(ev.which){

      case 1: controller.screenStateMachine.event("INP_ACTION"); break; // LEFT
      case 2: break;                                                    // MIDDLE
      case 3: controller.screenStateMachine.event("INP_CANCEL"); break; // RIGHT
    }
  };
};
