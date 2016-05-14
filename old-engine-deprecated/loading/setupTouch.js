cwt.loading_check_forcetouch_mode = function (when_done, error_receiver) {
  controller.storage_general.get("cwt_forceTouch", function (obj) {
    var doIt = (obj && obj.value === true);
    if (!doIt) doIt = getQueryParams(document.location.search).cwt_forceTouch === "1";

    if (doIt) {
      if (DEBUG) util.log("force to use touch controls");

      // enable touch and disable mouse ( cannot work together )
      controller.features_client.mouse = false;
      controller.features_client.touch = true;

      // mark forceTouch in the options
      controller.screenStateMachine.structure.OPTIONS.forceTouch = true;
    }

    when_done();
  });
};

controller.setupTouchControls = function (canvas, menuEl) {
  util.scoped(function () {

    // Called when an one finger tap occur
    //
    function oneFingerTap(event, x, y) {
      x = controller.getMapXByScreenX(x);
      y = controller.getMapXByScreenY(y);

      var focusExists = (
        controller.stateMachine.state === "MOVEPATH_SELECTION" ||
        controller.stateMachine.state === "ACTION_SELECT_TARGET_A" ||
        controller.stateMachine.state === "ACTION_SELECT_TARGET_B" ||
        controller.attackRangeVisible
      );

      if (!controller.menuVisible) {

        if (focusExists) {
          if (controller.stateMachine.data.selection.getValueAt(x, y) > 0) {
            controller.screenStateMachine.event("INP_ACTION", x, y);
          } else controller.screenStateMachine.event("INP_CANCEL", x, y);
        } else controller.screenStateMachine.event("INP_ACTION", x, y);

      } else {



        if (event.target.id === "cwt_menu") {
          controller.screenStateMachine.event("INP_ACTION");
        } else controller.screenStateMachine.event("INP_CANCEL");
      }
    }

    // Called when a two finger tap occur
    //
    function twoFingerTap(event, x, y) {
      controller.screenStateMachine.event("INP_CANCEL");
    }

    // Called when a swipe occur
    //
    // if dx is not 0 then dy is 0
    // if dy is not 0 then dx is 0
    //
    function swipe(event, dx, dy) {
      if (controller.screenStateMachine.state === "GAME_ROUND") {
        if (dx === +1) controller.screenStateMachine.event("SHIFT_RIGHT", 10);
        if (dx === -1) controller.screenStateMachine.event("SHIFT_LEFT", 10);
        if (dy === +1) controller.screenStateMachine.event("SHIFT_DOWN", 10);
        if (dy === -1) controller.screenStateMachine.event("SHIFT_UP", 10);
      } else {
        if (dx === +1) controller.screenStateMachine.event("INP_RIGHT", 1);
        if (dx === -1) controller.screenStateMachine.event("INP_LEFT", 1);
        if (dy === +1) controller.screenStateMachine.event("INP_DOWN", 1);
        if (dy === -1) controller.screenStateMachine.event("INP_UP", 1);
      }
    }

    // Called when a drag occur. A drag happens when a one finger tap occurs
    // and won't be released for a longer time. The drag happens when the
    // finger moves into one direction during the hold.
    //
    // if dx is not 0 then dy is 0
    // if dy is not 0 then dx is 0
    //
    function oneFingerDrag(event, dx, dy) {
      if (dx === 1) controller.screenStateMachine.event("INP_RIGHT", 1);
      if (dx === -1) controller.screenStateMachine.event("INP_LEFT", 1);
      if (dy === 1) controller.screenStateMachine.event("INP_DOWN", 1);
      if (dy === -1) controller.screenStateMachine.event("INP_UP", 1);

      if (!controller.menuVisible) {
        //ON THE

      } else {
        if (event.target.id === "cwt_menu") {
          //INSIDE THE MENU
          //MOVE SELECTION IN DIRECTION OF DRAG
        } else {
          //OUTSIDE THE MENU
          controller.screenStateMachine.event("INP_CANCEL");
        }
      }

    }

    // Called when a one finger tap is invoked and released after
    // a longer time ( >= 500ms )
    // the position of the finger is fixed in a hold ( at least the finger
    // does not really moved )
    //
    function holdOneFingerTap(event, x, y) {
      //OKAY FOR HOLD, this is tricky
      //Again separated for map and menu

      if (!controller.menuVisible) {
        // IF ATTACK RANGE VISIBLE
        //   IN RANGE
        controller.screenStateMachine.event("INP_ACTION", x, y);
        //  OUTSIDE RANGE
        controller.screenStateMachine.event("INP_CANCEL", x, y);
        // IF ATTACK RANGE IS NOT  VISIBLE
        controller.screenStateMachine.event("INP_ACTION", x, y);
      } else {
        if (event.target.id === "cwt_menu") {
          // WHEN HOLD HAPPENS IN THE MENU THEN
          // SLOWLY MOVE DOWN OR UP THROUGH
          // OPTIONS IN DIRECTION OF DRAG...
        } else {
          // WHEN TAP HAPPENS OUTSIDE THE MENU
        }
      }
    }

    // Called when the user pinches
    // delta is not 0 and
    //   delta < 0 means pinch in
    //   delta > 0 means pinch out
    function pinch(event, delta) {
      if (delta < 0) controller.setScreenScale(controller.screenScale - 1);
      else controller.setScreenScale(controller.screenScale + 1);
    }

    // -----------------------------------------------------------------------------

    // positions
    //  - first finger
    var sx, sy;
    var ex, ey;
    //  - second finger
    var s2x, s2y;
    var e2x, e2y;

    // timestamp
    var st;

    // PINCH VARS
    var pinDis, pinDis2;

    // DRAG VARS
    var dragDiff = 0;
    var isDrag = false;

    // TOUCH STARTS
    controller.screenElement.addEventListener('touchstart', function (event) {
      event.preventDefault();

      // SAVE POSITION AND CLEAR OLD DATA
      sx = event.touches[0].clientX;
      sy = event.touches[0].clientY;
      ex = sx;
      ey = sy;
      isDrag = false;

      // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
      if (event.touches.length === 2) {

        // SAVE POSITION AND CLEAR OLD DATA
        s2x = event.touches[1].clientX;
        s2y = event.touches[1].clientY;
        e2x = s2x;
        e2y = s2y;

        // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
        var dx = Math.abs(sx - s2x);
        var dy = Math.abs(sy - s2y);
        pinDis = Math.sqrt(dx * dx + dy * dy)

      } else s2x = -1;

      // REMEMBER TIME STAMP
      st = event.timeStamp;
    }, false);

    // TOUCH MOVES
    controller.screenElement.addEventListener('touchmove', function (event) {
      event.preventDefault();

      var dx, dy;
      ex = event.touches[0].clientX;
      ey = event.touches[0].clientY;

      // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
      if (event.touches.length === 2) {

        // SAVE POSITION
        e2x = event.touches[1].clientX;
        e2y = event.touches[1].clientY;

        // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER
        // TO BE ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT
        // WILL BE TRIGGERED
        dx = Math.abs(ex - e2x);
        dy = Math.abs(ey - e2y);
        pinDis2 = Math.sqrt(dx * dx + dy * dy)
      } else s2x = -1;

      dx = Math.abs(sx - ex);
      dy = Math.abs(sy - ey);
      var d = Math.sqrt(dx * dx + dy * dy);
      var timeDiff = event.timeStamp - st;

      if (d > 16) {

        if (timeDiff > 300) {

          isDrag = true;
          if (dragDiff > 75) {
            if (dx > dy) oneFingerDrag(event, (sx > ex) ? -1 : +1, 0);
            else oneFingerDrag(event, 0, (sy > ey) ? -1 : +1);
            dragDiff = 0;
            sx = ex;
            sy = ey;
          } else {
            dragDiff += timeDiff;
          }
        }
      }
    }, false);

    // TOUCH END
    controller.screenElement.addEventListener('touchend', function (event) {
      event.preventDefault();

      if (controller.inputCoolDown > 0) return;

      // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
      var dx = Math.abs(sx - ex);
      var dy = Math.abs(sy - ey);
      var d = Math.sqrt(dx * dx + dy * dy);
      var timeDiff = event.timeStamp - st;

      // IS IT A TWO PINCH GESTURE?
      if (s2x !== -1) {
        if (Math.abs(pinDis2 - pinDis) <= 32) {
          twoFingerTap(event, ex, ey);
        } else pinch(event, (pinDis2 < pinDis) ? 1 : -1);
        controller.inputCoolDown = 500;
      } else {
        if (d <= 16) {
          if (timeDiff <= 500) oneFingerTap(event, ex, ey);
        } else if (timeDiff <= 300) {
          if (dx > dy) swipe(event, (sx > ex) ? -1 : +1, 0);
          else swipe(event, 0, (sy > ey) ? -1 : +1);
        }
      }

    }, false);

  });
};
