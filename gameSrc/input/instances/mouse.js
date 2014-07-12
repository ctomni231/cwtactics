cwt.Input.registerInputHandler("mouse", function () {

  // not supported ?
  if (!cwt.ClientFeatures.mouse) {
    return;
  }

  var canvas = document.getElementById("canvas_layer6");
  var sx = 1.0;
  var sy = 1.0;

  // register move listener
  canvas.onmousemove = function (ev) {
    var id = ev.target.id;

    var x, y;

    // extract real x,y position on the canvas
    ev = ev || window.event;
    if (typeof ev.offsetX === 'number') {
      x = ev.offsetX;
      y = ev.offsetY;
    }
    else {
      x = ev.layerX;
      y = ev.layerY;
    }

    var cw = canvas.width;
    var ch = canvas.height;

    // get the scale based on actual width;
    sx = cw / canvas.offsetWidth;
    sy = ch / canvas.offsetHeight;

    var data = cwt.Gameflow.activeState.data;
    if (data.inputMove) {
      data.inputMove(parseInt(x*sx),parseInt(y*sy));
    }


    // convert to a tile position
    /*
    x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10);
    y = cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);

    if (x !== cwt.Cursor.x || y !== cwt.Cursor.y) {
      cwt.Input.pushAction(cwt.Input.TYPE_HOVER, x, y);
    }
//
  };

  // register click listener
  document.getElementById("canvas_layer6").onmouseup = function (ev) {
    var key = cwt.INACTIVE;

    // click on canvas while menu is open -> cancel always
    ev = ev || window.event;
    switch (ev.which) {

      // LEFT
      case 1:
        key = cwt.Input.TYPE_ACTION;
        break;

      // MIDDLE
      case 2:
        break;

      // RIGHT
      case 3:
        key = cwt.Input.TYPE_CANCEL;
        break;
    }

    // push command into the stack
    if (key !== cwt.INACTIVE) {
      cwt.Input.pushAction(key, cwt.INACTIVE, cwt.INACTIVE);
    }
  };

});
