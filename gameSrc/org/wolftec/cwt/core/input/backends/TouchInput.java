package org.wolftec.cwt.core.input.backends;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.dom.DOMEvent;
import org.wolftec.cwt.core.input.Deactivatable;
import org.wolftec.cwt.core.input.InputManager;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.util.NumberUtil;

public class TouchInput implements Injectable, Deactivatable {

  public static final String TOUCH_PINCH_OUT = "TOUCH_PINCH_OUT";

  public static final String TOUCH_DOUBLETAP = "TOUCH_DOUBLETAP";

  public static final String TOUCH_PINCH_IN = "TOUCH_PINCH_IN";

  public static final String TOUCH_TAP = "TOUCH_TAP";

  public static final String TOUCH_SWIPE_UP = "TOUCH_SWIPE_UP";

  public static final String TOUCH_SWIPE_DOWN = "TOUCH_SWIPE_DOWN";

  public static final String TOUCH_SWIPE_RIGHT = "TOUCH_SWIPE_RIGHT";

  public static final String TOUCH_SWIPE_LEFT = "TOUCH_SWIPE_LEFT";

  public static final String TOUCH_DRAG_UP = "TOUCH_DRAG_UP";

  public static final String TOUCH_DRAG_DOWN = "TOUCH_DRAG_DOWN";

  public static final String TOUCH_DRAG_RIGHT = "TOUCH_DRAG_RIGHT";

  public static final String TOUCH_DRAG_LEFT = "TOUCH_DRAG_LEFT";

  // @STJSBridge TODO readd when stjs 3.2.0 is fixed
  @SyntheticType
  static class TouchEvent {
    native void preventDefault();

    Array<TouchPosition> touches;
    long                 timeStamp;
  }

  // @STJSBridge TODO readd when stjs 3.2.0 is fixed
  @SyntheticType
  static class TouchPosition {
    int clientX;
    int clientY;
  }

  private Log log;

  private InputManager input;

  private int sx;
  private int sy;
  private int ex;
  private int ey;

  private int s2x;
  private int s2y;
  private int e2x;
  private int e2y;

  // timestamp
  private long st;

  // pinch data
  private int pinDis;
  private int pinDis2;

  // drag data
  private int dragDiff;

  private void handleTouchStart(DOMEvent origEvent) {
    TouchEvent event = (TouchEvent) ((Object) origEvent);

    event.preventDefault();

    input.releaseButton(TOUCH_DRAG_LEFT);
    input.releaseButton(TOUCH_DRAG_RIGHT);
    input.releaseButton(TOUCH_DRAG_DOWN);
    input.releaseButton(TOUCH_DRAG_UP);
    input.releaseButton(TOUCH_SWIPE_LEFT);
    input.releaseButton(TOUCH_SWIPE_RIGHT);
    input.releaseButton(TOUCH_SWIPE_DOWN);
    input.releaseButton(TOUCH_SWIPE_UP);
    input.releaseButton(TOUCH_TAP);
    input.releaseButton(TOUCH_DOUBLETAP);
    input.releaseButton(TOUCH_PINCH_IN);
    input.releaseButton(TOUCH_PINCH_OUT);

    // SAVE POSITION AND CLEAR OLD DATA
    sx = event.touches.$get(0).clientX;
    sy = event.touches.$get(0).clientY;
    ex = sx;
    ey = sy;

    // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
    if (event.touches.$length() == 2) {

      // SAVE POSITION AND CLEAR OLD DATA
      s2x = event.touches.$get(1).clientX;
      s2y = event.touches.$get(1).clientY;
      e2x = s2x;
      e2y = s2y;

      // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
      int dx = Math.abs(sx - s2x);
      int dy = Math.abs(sy - s2y);
      pinDis = NumberUtil.asInt(Math.sqrt(dx * dx + dy * dy));

    } else
      s2x = -1;

    // REMEMBER TIME STAMP
    st = event.timeStamp;
  }

  private void handleTouchMove(DOMEvent origEvent) {
    TouchEvent event = (TouchEvent) ((Object) origEvent);
    event.preventDefault();

    int dx;
    int dy;
    ex = event.touches.$get(0).clientX;
    ey = event.touches.$get(0).clientY;

    // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
    if (event.touches.$length() == 2) {

      // SAVE POSITION
      e2x = event.touches.$get(1).clientX;
      e2y = event.touches.$get(1).clientY;

      // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER
      // TO BE ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT
      // WILL BE TRIGGERED
      dx = Math.abs(ex - e2x);
      dy = Math.abs(ey - e2y);
      pinDis2 = NumberUtil.asInt(Math.sqrt(dx * dx + dy * dy));

    } else {
      s2x = -1;
    }

    dx = Math.abs(sx - ex);
    dy = Math.abs(sy - ey);
    int d = NumberUtil.asInt(Math.sqrt(dx * dx + dy * dy));
    long timeDiff = event.timeStamp - st;

    if (d > 16) {

      if (timeDiff > 300) {

        if (dragDiff > 75) {

          String button;
          if (dx > dy) {
            button = (sx > ex) ? TOUCH_DRAG_LEFT : TOUCH_DRAG_RIGHT;
          } else {
            button = (sy > ey) ? TOUCH_DRAG_UP : TOUCH_DRAG_DOWN;
          }

          input.pressButton(button);

          dragDiff = 0;
          sx = ex;
          sy = ey;

        } else {
          dragDiff += timeDiff;
        }
      }
    }
  }

  private void handleTouchEnd(DOMEvent origEvent) {
    TouchEvent event = (TouchEvent) ((Object) origEvent);
    event.preventDefault();

    // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
    int dx = NumberUtil.asInt(Math.abs(sx - ex));
    int dy = NumberUtil.asInt(Math.abs(sy - ey));
    int d = NumberUtil.asInt(Math.sqrt(dx * dx + dy * dy));
    long timeDiff = event.timeStamp - st;

    // TODO input.setLastX(ex);
    // TODO input.setLastY(ey);

    // IS IT A TWO PINCH GESTURE?
    if (s2x != -1) {
      if (Math.abs(pinDis2 - pinDis) <= 32) {
        input.pressButton(TOUCH_DOUBLETAP);
      } else {
        input.pressButton(pinDis2 < pinDis ? TOUCH_PINCH_OUT : TOUCH_PINCH_IN);
      }
    } else {
      if (d <= 16) {
        if (timeDiff <= 500) {
          input.pressButton(TOUCH_TAP);
        }

      } else if (timeDiff <= 300) {
        String button;
        if (dx > dy) {
          button = (sx > ex) ? TOUCH_SWIPE_LEFT : TOUCH_SWIPE_RIGHT;
        } else {
          button = (sy > ey) ? TOUCH_SWIPE_UP : TOUCH_SWIPE_DOWN;
        }

        input.pressButton(button);
      }
    }
  }

  @Override
  public void enable() {
    log.info("activating touch input");
    Global.window.document.addEventListener("touchstart", this::handleTouchStart, false);
    Global.window.document.addEventListener("touchmove", this::handleTouchMove, false);
    Global.window.document.addEventListener("touchend", this::handleTouchEnd, false);
  }

  @Override
  public void disable() {
    log.info("deactivating touch input");
    Global.window.document.removeEventListener("touchstart", this::handleTouchStart, false);
    Global.window.document.removeEventListener("touchmove", this::handleTouchMove, false);
    Global.window.document.removeEventListener("touchend", this::handleTouchEnd, false);
  }

}
