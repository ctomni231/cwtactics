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
    if( x !== controller.mapCursorX || y !== controller.mapCursorY ){
      controller.input_pushKey( controller.DEFAULT_KEY_MAP.MOUSE.HOVER, x,y  );  
    }
  });

  controller.screenElement.onmouseup = function(ev){

    if( controller.input_blocked ) return false;
    
    var keymap = controller.DEFAULT_KEY_MAP.KEYBOARD;
    
    // click on canvas while menu is open -> cancel always
    if( controller.menuVisible ){
      controller.input_pushKey( keymap.CANCEL, INACTIVE_ID, INACTIVE_ID  );   
      return;
    }

    ev = ev || window.event;
    switch(ev.which){
      
      // LEFT
      case 1: 
        
        controller.input_pushKey( keymap.ACTION, INACTIVE_ID, INACTIVE_ID);   
        break; 
      
      // MIDDLE
      case 2: break;
      
      // RIGHT
      case 3: 
        controller.input_pushKey( keymap.CANCEL, INACTIVE_ID, INACTIVE_ID);   
        break; 
    }
  };
};
