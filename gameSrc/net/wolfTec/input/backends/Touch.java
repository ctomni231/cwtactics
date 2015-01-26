package net.wolfTec.input.backends;

import net.wolfTec.bridges.TouchEvent;
import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.Game;
import net.wolfTec.input.InputHandlerBean;
import net.wolfTec.input.InputType;
import net.wolfTec.utility.Debug;
import net.wolfTec.wtEngine.input.InputBackend;

import org.stjs.javascript.*;
import org.stjs.javascript.Math;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback1;

public class Touch {

    public static final String LOG = Constants.logHeader("input.keyboard");

    public static final String EVENT_TOUCH_START = "touchstart";
    public static final String EVENT_TOUCH_MOVE = "touchmove";
    public static final String EVENT_TOUCH_END = "touchend";

    public static InputBackend createBackend(final InputHandlerBean handler, final Element targetElement) {

        // define data object to share data between the three events
        final Map<String, Integer> data = JSCollections.$map();
        data.$put("finger1_startX", 0);
        data.$put("finger1_startY", 0);
        data.$put("finger1_endX", 0);
        data.$put("finger1_endY", 0);
        data.$put("finger2_startX", 0);
        data.$put("finger2_startY", 0);
        data.$put("finger2_endX", 0);
        data.$put("finger2_endY", 0);
        data.$put("timestamp", 0);
        data.$put("pinchDistance_start", 0);
        data.$put("pinchDistance_end", 0);
        data.$put("drag_timeDifference", 0);
        data.$put("drag_inDrag", 0);

        final Callback1<DOMEvent> touchStartHandler = new Callback1<DOMEvent>() {
            @Override
            public void $invoke(DOMEvent genericEvent) {

                // here we will get a special touch event
                TouchEvent event = (TouchEvent) genericEvent;

                event.preventDefault();

                // SAVE POSITION AND CLEAR OLD DATA
                data.$put("finger1_startX", event.touches[0].clientX);
                data.$put("finger1_startY", event.touches[0].clientY);
                data.$put("finger1_endX", data.$get("finger1_startX"));
                data.$put("finger1_endY", data.$get("finger1_startY"));
                data.$put("drag_inDrag", 0);

                // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
                if (event.touches.length == 2) {

                    // SAVE POSITION AND CLEAR OLD DATA
                    data.$put("finger2_startX", event.touches[1].clientX);
                    data.$put("finger2_startY", event.touches[1].clientY);
                    data.$put("finger2_endX", data.$get("finger2_startX"));
                    data.$put("finger2_endY", data.$get("finger2_startY"));

                    // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
                    int dx = (int) Math.abs((double) (data.$get("finger1_startX") - data.$get("finger2_startX")));
                    int dy = (int) Math.abs((double) (data.$get("finger1_startY") - data.$get("finger2_startY")));
                    data.$put("pinchDistance_start", (int) Math.sqrt(((double) dx * dx + dy * dy)));

                } else {
                    data.$put("finger2_startX", -1);
                }

                // REMEMBER TIME STAMP
                data.$put("timestamp", event.timeStamp);
            }
        };

        final Callback1<DOMEvent> touchMoveHandler = new Callback1<DOMEvent>() {
            @Override
            public void $invoke(DOMEvent genericEvent) {

                // here we will get a special touch event
                TouchEvent event = (TouchEvent) genericEvent;

                event.preventDefault();

                data.$put("finger1_endX", event.touches[0].clientX);
                data.$put("finger1_endY", event.touches[0].clientY);

                // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
                if (event.touches.length == 2) {

                    // SAVE POSITION
                    data.$put("finger2_endX", event.touches[1].clientX);
                    data.$put("finger2_endY", event.touches[1].clientY);

                    // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER TO BE
                    // ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT WILL BE TRIGGERED
                    int dx = (int) Math.abs(data.$get("finger1_startX") - data.$get("finger2_startX"));
                    int dy = (int) Math.abs(data.$get("finger1_startY") - data.$get("finger2_startY"));
                    data.$put("pinchDistance_end", (int) Math.sqrt(dx * dx + dy * dy));

                } else {
                    data.$put("finger2_startX", -1);
                }

                int dx = (int) Math.abs(data.$get("finger1_startX") - data.$get("finger1_endX"));
                int dy = (int) Math.abs(data.$get("finger1_startY") - data.$get("finger1_endY"));
                int distance = (int) Math.sqrt(dx * dx + dy * dy);
                int timeDiff = event.timeStamp - data.$get("timestamp");

                if (distance > 16) {
                    if (timeDiff > 300) {

                        data.$put("drag_inDrag", 1);
                        if (data.$get("drag_timeDifference") > 75) {
                            if (dx > dy) {
                                oneFingerDrag((data.$get("finger1_startX") > data.$get("finger1_endX")) ? -1 : +1, 0);
                            } else {
                                oneFingerDrag(0, (data.$get("finger1_startY") > data.$get("finger1_endY")) ? -1 : +1);
                            }
                            data.$put("drag_timeDifference", 0);
                            data.$put("finger1_startX", data.$get("finger1_endX"));
                            data.$put("finger1_startY", data.$get("finger1_endY"));

                        } else {
                            data.$put("drag_timeDifference", data.$get("drag_timeDifference") + timeDiff);
                        }
                    }
                }
            }
        };

        final Callback1<DOMEvent> touchEndHandler = new Callback1<DOMEvent>() {
            @Override
            public void $invoke(DOMEvent genericEvent) {

                // here we will get a special touch event
                TouchEvent event = (TouchEvent) genericEvent;

                event.preventDefault();

                // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
                int dx = (int) Math.abs(data.$get("finger1_startX") - data.$get("finger1_endX"));
                int dy = (int) Math.abs(data.$get("finger1_startY") - data.$get("finger1_endY"));
                int distance = (int) Math.sqrt(dx * dx + dy * dy);
                int timeDiff = event.timeStamp - data.$get("timestamp");

                // IS IT A TWO PINCH GESTURE?
                if (data.$get("finger2_startX") != -1) {
                    if (Math.abs(data.$get("pinchDistance_end") - data.$get("pinchDistance_start")) <= 32) {
                        twoFingerTap(data.$get("finger1_endX"), data.$get("finger1_endY"));
                    } else {
                        pinch((data.$get("pinchDistance_end") < data.$get("pinchDistance_start")) ? 1 : -1);
                    }
                } else {
                    if (distance <= 16) {
                        if (timeDiff <= 500) {
                            oneFingerTap(data.$get("finger1_endX"), data.$get("finger1_endY"));
                        }
                    } else if (timeDiff <= 300) {
                        if (dx > dy) {
                            swipe((data.$get("finger1_startX") > data.$get("finger1_endX")) ? -1 : +1, 0);
                        } else {
                            swipe(0, (data.$get("finger1_startY") > data.$get("finger1_endY")) ? -1 : +1);
                        }
                    }
                }
            }
        };

        return new InputBackend() {
            @Override
            public void enable() {
                Debug.logInfo(LOG, "disable mouse input");
                Global.window.document.addEventListener(EVENT_TOUCH_START, touchStartHandler, false);
                Global.window.document.addEventListener(EVENT_TOUCH_MOVE, touchMoveHandler, false);
                Global.window.document.addEventListener(EVENT_TOUCH_END, touchEndHandler, false);
            }

            @Override
            public void disable() {
                Debug.logInfo(LOG, "disable mouse input");
                Global.window.document.removeEventListener(EVENT_TOUCH_START, touchStartHandler, false);
                Global.window.document.removeEventListener(EVENT_TOUCH_MOVE, touchMoveHandler, false);
                Global.window.document.removeEventListener(EVENT_TOUCH_END, touchEndHandler, false);
            }
        };
    }

    private static boolean inSelection() {
        String cState = Game.gameWorkflow.getActiveStateId();
        return (cState == "INGAME_MOVEPATH"
                || cState == "INGAME_SELECT_TILE_TYPE_A"
                || cState == "INGAME_SELECT_TILE_TYPE_B");
        // || controller.attackRangeVisible );
    }

    private static boolean inMenu() {
        String cState = Game.gameWorkflow.getActiveStateId();
        return (cState == "INGAME_MENU" || cState == "INGAME_SUBMENU");
    }

    /**
     * Called when an one finger tap occur
     *
     * @param x
     * @param y
     */
    private static void oneFingerTap(int x, int y) {
        x = renderer.screenOffsetX + JSGlobal.parseInt(x / Constants.TILE_BASE, 10);
        y = renderer.screenOffsetY + JSGlobal.parseInt(y / Constants.TILE_BASE, 10);

        if (!inMenu()) {
            Game.inputHandler.pushAction(InputType.ACTION, x, y);
        /*
         if (inSelection()) {
         if (stateData.selection.getValue(x, y) > 0) {
         input.pushAction(input.TYPE_ACTION, x, y);
         } else {
         input.pushAction(input.TYPE_CANCEL, x, y);
         }
         } else {
         input.pushAction(input.TYPE_ACTION, x, y);
         }  */

        } else {

            Game.inputHandler.pushAction(InputType.ACTION, Constants.INACTIVE_ID, Constants.INACTIVE_ID);

            //if (event.target.id === "cwt_menu") {
            //  input.pushAction(input.TYPE_ACTION, constants.INACTIVE, constants.INACTIVE);
            //} else {
            //  input.pushAction(input.TYPE_CANCEL, constants.INACTIVE, constants.INACTIVE);
            //}
        }
    }

    /**
     * Called when a two finger tap occur
     *
     * @param x
     * @param y
     */
    private static void twoFingerTap(int x, int y) {
        Game.inputHandler.pushAction(InputType.CANCEL, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
    }

    /**
     * Called when a swipe occur.
     * <p/>
     * if dx is not 0 then dy is 0
     * if dy is not 0 then dx is 0
     *
     * @param dx
     * @param dy
     */
    private static void swipe(int dx, int dy) {
        InputType key = null;

        if (dx == 1) key = InputType.RIGHT;
        else if (dy == 1) key = InputType.DOWN;
        else if (dx == -1) key = InputType.LEFT;
        else if (dy == -1) key = InputType.UP;

        Game.inputHandler.pushAction(key, (stateData.inGameRound ? 10 : 1), Constants.INACTIVE_ID);
    }

    /**
     * Called when the user pinches
     * <p/>
     * delta is not 0 and
     * delta < 0 means pinch in
     * delta > 0 means pinch out
     *
     * @return
     */
    public static void pinch(int delta) {
        //if (delta < 0) controller.setScreenScale(controller.screenScale - 1);
        //else           controller.setScreenScale(controller.screenScale + 1);
    }

    /**
     * Called when a drag occur. A drag happens when a one finger tap occurs and won't be released for a longer time.
     * The drag happens when the finger moves into one direction during the hold.
     * <p/>
     * if dx is not 0 then dy is 0
     * if dy is not 0 then dx is 0
     *
     * @param dx
     * @param dy
     */
    private static void oneFingerDrag(int dx, int dy) {
        InputType key = null;

        if (dx == 1) key = InputType.RIGHT;
        else if (dy == 1) key = InputType.DOWN;
        else if (dx == -1) key = InputType.LEFT;
        else if (dy == -1) key = InputType.UP;

        Game.inputHandler.pushAction(key, 1, Constants.INACTIVE_ID);

        if (!inMenu()) {
            //ON THE

        } else {
            // if (event.target.id === "cwt_menu") {
            //INSIDE THE MENU
            //MOVE SELECTION IN DIRECTION OF DRAG

            // } else {
            //OUTSIDE THE MENU
            //input.pushAction(input.TYPE_CANCEL, constants.INACTIVE, constants.INACTIVE);
            // }
        }

    }

    /**
     * Called when a one finger tap is invoked and released after a longer time ( >= 500ms ) the position of the
     * finger is fixed in a hold ( at least the finger does not really moved )
     *
     * @param x
     * @param y
     */
    private static void holdOneFingerTap(int x, int y) {
        //OKAY FOR HOLD, this is tricky
        //Again separated for map and menu

        if (!inMenu()) {

            // IF ATTACK RANGE VISIBLE IN RANGE
            Game.inputHandler.pushAction(InputType.ACTION, x, y);

            //  OUTSIDE RANGE
            Game.inputHandler.pushAction(InputType.CANCEL, x, y);

            // IF ATTACK RANGE IS NOT  VISIBLE
            Game.inputHandler.pushAction(InputType.ACTION, x, y);

        } else {
            // if (event.target.id === "cwt_menu") {
            // WHEN HOLD HAPPENS IN THE MENU THEN
            // SLOWLY MOVE DOWN OR UP THROUGH
            // OPTIONS IN DIRECTION OF DRAG...
            //  } else {
            // WHEN TAP HAPPENS OUTSIDE THE MENU
            //  }
        }
    }
}
