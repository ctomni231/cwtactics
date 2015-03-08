package org.wolfTec.wolfTecEngine.input;

import static org.stjs.javascript.JSObjectAdapter.$js;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;

@ManagedComponent
public class TwoFingerTouchBackend implements InputBackend, ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  private Callback1<Object> touchStartHandler;
  private Callback1<Object> touchMoveHandler;
  private Callback1<Object> touchEndHandler;

  private int finger1_startX = 0;
  private int finger1_startY = 0;
  private int finger1_endX = 0;
  private int finger1_endY = 0;
  private int finger2_startX = 0;
  private int finger2_startY = 0;
  private int finger2_endX = 0;
  private int finger2_endY = 0;
  private int drag_inDrag = 0;
  private int drag_timeDifference = 0;
  private int pinchDistance_start = 0;
  private int pinchDistance_end = 0;
  private int timestamp = 0;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    touchStartHandler = (event) -> {
      $js("event.preventDefault()");

      // SAVE POSITION AND CLEAR OLD DATA
      finger1_startX = $js("event.touches[0].clientX");
      finger1_startY = $js("event.touches[0].clientY");
      finger1_endX = finger1_startX;
      finger1_endY = finger1_startY;
      drag_inDrag = 0;

      // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
      if ((boolean) $js("event.touches.length === 2")) {

        // SAVE POSITION AND CLEAR OLD DATA
        finger2_startX = $js("event.touches[1].clientX");
        finger2_startY = $js("event.touches[1].clientY");
        finger2_endX = finger2_startX;
        finger2_endY = finger2_startY;

        // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
        int dx = (int) Math.abs((double) (finger1_startX - finger2_startX));
        int dy = (int) Math.abs((double) (finger1_startY - finger2_startY));
        pinchDistance_start = (int) Math.sqrt(((double) dx * dx + dy * dy));

      } else {
        finger2_startX = -1;
      }

      // REMEMBER TIME STAMP
      timestamp = $js("event.timeStamp");
    };

    touchMoveHandler = (event) -> {
      $js("event.preventDefault()");

      finger1_endX = $js("event.touches[0].clientX");
      finger1_endY = $js("event.touches[0].clientY");

      // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
      if ((boolean) $js("event.touches.length == 2")) {

        // SAVE POSITION
        finger2_endX = $js("event.touches[1].clientX");
        finger2_endY = $js("event.touches[1].clientY");

        // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER TO BE
        // ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT WILL BE TRIGGERED
        int dx = (int) Math.abs(finger1_startX - finger2_startX);
        int dy = (int) Math.abs(finger1_startY - finger2_startY);
        pinchDistance_end = (int) Math.sqrt(dx * dx + dy * dy);

      } else {
        finger2_startX = -1;
      }

      int dx = (int) Math.abs(finger1_startX - finger1_endX);
      int dy = (int) Math.abs(finger1_startY - finger1_endY);
      int distance = (int) Math.sqrt(dx * dx + dy * dy);
      int timeDiff = (int) $js("event.timeStamp") - timestamp;

      if (distance > 16) {
        if (timeDiff > 300) {

          drag_inDrag = 1;
          if (drag_timeDifference > 75) {
            if (dx > dy) {
              //oneFingerDrag(finger1_startX > finger1_endX ? -1 : +1, 0);
            } else {
             // oneFingerDrag(0, finger1_startY > finger1_endY ? -1 : +1);
            }
            drag_timeDifference = 0;
            finger1_startX = finger1_endX;
            finger1_startY = finger1_endY;

          } else {
            drag_timeDifference = drag_timeDifference + timeDiff;
          }
        }
      }
    };

    touchEndHandler = (event) -> {
      $js("event.preventDefault()");

      // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
      int dx = (int) Math.abs(finger1_startX - finger1_endX);
      int dy = (int) Math.abs(finger1_startY - finger1_endY);
      int distance = (int) Math.sqrt(dx * dx + dy * dy);
      int timeDiff = (int) $js("event.timeStamp") - timestamp;

      // IS IT A TWO PINCH GESTURE?
      if (finger2_startX != -1) {
        if (Math.abs(pinchDistance_end - pinchDistance_start) <= 32) {
          //twoFingerTap(finger1_endX, finger1_endY);
        } else {
          //pinch((pinchDistance_end < pinchDistance_start) ? 1 : -1);
        }
      } else {
        if (distance <= 16) {
          if (timeDiff <= 500) {
            // oneFingerTap(finger1_endX, finger1_endY);
          }
        } else if (timeDiff <= 300) {
          if (dx > dy) {
            //swipe((finger1_startX > finger1_endX) ? -1 : +1, 0);
          } else {
           // swipe(0, (finger1_startY > finger1_endY) ? -1 : +1);
          }
        }
      }
    };
  }

  @Override
  public void enable() {
    log.info("disable touch input");
    $js("document.addEventListener(\"touchstart\", this.touchStartHandler, false)");
    $js("document.addEventListener(\"touchmove\", this.touchMoveHandler, false)");
    $js("document.addEventListener(\"touchend\", this.touchEndHandler, false)");
  }

  @Override
  public void disable() {
    log.info("enable touch input");
    $js("document.removeEventListener(\"touchstart\", this.touchStartHandler, false)");
    $js("document.removeEventListener(\"touchmove\", this.touchMoveHandler, false)");
    $js("document.removeEventListener(\"touchend\", this.touchEndHandler, false)");
  }

//  private static boolean inSelection() {
//    String cState = Game.gameWorkflow.getActiveStateId();
//    return (cState == "INGAME_MOVEPATH" || cState == "INGAME_SELECT_TILE_TYPE_A" || cState == "INGAME_SELECT_TILE_TYPE_B");
//    // || controller.attackRangeVisible );
//  }
//
//  private static boolean inMenu() {
//    String cState = Game.gameWorkflow.getActiveStateId();
//    return (cState == "INGAME_MENU" || cState == "INGAME_SUBMENU");
//  }
//
//  /**
//   * Called when an one finger tap occur
//   *
//   * @param x
//   * @param y
//   */
//  private static void oneFingerTap(int x, int y) {
//    x = renderer.screenOffsetX + JSGlobal.parseInt(x / EngineGlobals.TILE_BASE, 10);
//    y = renderer.screenOffsetY + JSGlobal.parseInt(y / EngineGlobals.TILE_BASE, 10);
//
//    if (!inMenu()) {
//      Game.inputHandler.pushAction(InputType.ACTION, x, y);
//      /*
//       * if (inSelection()) { if (stateData.selection.getValue(x, y) > 0) {
//       * input.pushAction(input.TYPE_ACTION, x, y); } else {
//       * input.pushAction(input.TYPE_CANCEL, x, y); } } else {
//       * input.pushAction(input.TYPE_ACTION, x, y); }
//       */
//
//    } else {
//
//      Game.inputHandler.pushAction(InputType.ACTION, EngineGlobals.INACTIVE_ID,
//          EngineGlobals.INACTIVE_ID);
//
//      // if (event.target.id === "cwt_menu") {
//      // input.pushAction(input.TYPE_ACTION, constants.INACTIVE,
//      // constants.INACTIVE);
//      // } else {
//      // input.pushAction(input.TYPE_CANCEL, constants.INACTIVE,
//      // constants.INACTIVE);
//      // }
//    }
//  }
//
//  /**
//   * Called when a two finger tap occur
//   *
//   * @param x
//   * @param y
//   */
//  private static void twoFingerTap(int x, int y) {
//    Game.inputHandler.pushAction(InputType.CANCEL, EngineGlobals.INACTIVE_ID,
//        EngineGlobals.INACTIVE_ID);
//  }
//
//  /**
//   * Called when a swipe occur.
//   * <p/>
//   * if dx is not 0 then dy is 0 if dy is not 0 then dx is 0
//   *
//   * @param dx
//   * @param dy
//   */
//  private static void swipe(int dx, int dy) {
//    InputType key = null;
//
//    if (dx == 1)
//      key = InputType.RIGHT;
//    else if (dy == 1)
//      key = InputType.DOWN;
//    else if (dx == -1)
//      key = InputType.LEFT;
//    else if (dy == -1) key = InputType.UP;
//
//    Game.inputHandler.pushAction(key, (stateData.inGameRound ? 10 : 1), EngineGlobals.INACTIVE_ID);
//  }
//
//  /**
//   * Called when the user pinches
//   * <p/>
//   * delta is not 0 and delta < 0 means pinch in delta > 0 means pinch out
//   *
//   * @return
//   */
//  public static void pinch(int delta) {
//    // if (delta < 0) controller.setScreenScale(controller.screenScale - 1);
//    // else controller.setScreenScale(controller.screenScale + 1);
//  }
//
//  /**
//   * Called when a drag occur. A drag happens when a one finger tap occurs and
//   * won't be released for a longer time. The drag happens when the finger moves
//   * into one direction during the hold.
//   * <p/>
//   * if dx is not 0 then dy is 0 if dy is not 0 then dx is 0
//   *
//   * @param dx
//   * @param dy
//   */
//  private static void oneFingerDrag(int dx, int dy) {
//    InputType key = null;
//
//    if (dx == 1)
//      key = InputType.RIGHT;
//    else if (dy == 1)
//      key = InputType.DOWN;
//    else if (dx == -1)
//      key = InputType.LEFT;
//    else if (dy == -1) key = InputType.UP;
//
//    Game.inputHandler.pushAction(key, 1, EngineGlobals.INACTIVE_ID);
//
//    if (!inMenu()) {
//      // ON THE
//
//    } else {
//      // if (event.target.id === "cwt_menu") {
//      // INSIDE THE MENU
//      // MOVE SELECTION IN DIRECTION OF DRAG
//
//      // } else {
//      // OUTSIDE THE MENU
//      // input.pushAction(input.TYPE_CANCEL, constants.INACTIVE,
//      // constants.INACTIVE);
//      // }
//    }
//
//  }
//
//  /**
//   * Called when a one finger tap is invoked and released after a longer time (
//   * >= 500ms ) the position of the finger is fixed in a hold ( at least the
//   * finger does not really moved )
//   *
//   * @param x
//   * @param y
//   */
//  private static void holdOneFingerTap(int x, int y) {
//    // OKAY FOR HOLD, this is tricky
//    // Again separated for map and menu
//
//    if (!inMenu()) {
//
//      // IF ATTACK RANGE VISIBLE IN RANGE
//      Game.inputHandler.pushAction(InputType.ACTION, x, y);
//
//      // OUTSIDE RANGE
//      Game.inputHandler.pushAction(InputType.CANCEL, x, y);
//
//      // IF ATTACK RANGE IS NOT VISIBLE
//      Game.inputHandler.pushAction(InputType.ACTION, x, y);
//
//    } else {
//      // if (event.target.id === "cwt_menu") {
//      // WHEN HOLD HAPPENS IN THE MENU THEN
//      // SLOWLY MOVE DOWN OR UP THROUGH
//      // OPTIONS IN DIRECTION OF DRAG...
//      // } else {
//      // WHEN TAP HAPPENS OUTSIDE THE MENU
//      // }
//    }
//  }
}
