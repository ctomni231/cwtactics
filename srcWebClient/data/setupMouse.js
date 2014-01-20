controller.setupMouseControls = function( canvas, menuEl ){
  if( DEBUG ) util.log("initializing mouse support");

  /*
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
  */

  controller.screenElement.onmouseup = function(ev){

    if( controller.input_blocked ) return false;
    
    var keymap = controller.keyMaps.KEYBOARD;
    
    // click on canvas while menu is open -> cancel always
    if( controller.menuVisible ){
      controller.input_pushKey( keymap.CANCEL, INACTIVE_ID, INACTIVE_ID  );   
      return;
    }


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
    
    switch(ev.which){
      
      // LEFT
      case 1: 
        
        controller.input_pushKey( keymap.ACTION, x, y  );   
        break; 
      
      // MIDDLE
      case 2: break;
      
      // RIGHT
      case 3: 
        controller.input_pushKey( keymap.CANCEL, x, y  );   
        break; 
    }
  };
};
