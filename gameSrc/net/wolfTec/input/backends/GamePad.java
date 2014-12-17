package net.wolfTec.input.backends;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.bridges.Globals;
import net.wolfTec.input.InputBackend;
import net.wolfTec.input.InputHandler;
import net.wolfTec.input.InputType;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.*;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Function0;
import org.stjs.javascript.functions.Function1;

public abstract class GamePad {

    public static final String LOG = Constants.logHeader("input.keyboard");

    public static final InputBackend createBackend (final InputHandler handler) {
        final Array<Integer> prevTimestamps = JSCollections.$array();
        final Map<String, Boolean> data = JSCollections.$map();

        final boolean vendorAPI = !JSObjectAdapter.hasOwnProperty(Globals.navigator, "getGamepads");

        return new InputBackend() {
            @Override
            public void enable() {
                Debug.logInfo(LOG, "disable gamepad input");
                data.$put("enabled", true);
            }

            @Override
            public void disable() {
                Debug.logInfo(LOG, "disable gamepad input");
                data.$put("enabled", false);
            }

            @Override
            public void update(int delta) {
                if (data.$get("enabled")) return;

                Map gamePads = vendorAPI ? Globals.navigator.webkitGetGamepads() : Globals.navigator.getGamepads();

                int i, e;
                for (i = 0, e = 4; i < e; i++) {
                    Map gamePad = (Map) gamePads.$get(((Integer) i).toString());
                    if (gamePad != null) {

                        // check timestamp
                        if (JSGlobal.Boolean(prevTimestamps.$get(i)) &&
                                (((Integer) gamePad.$get("timestamp")) == prevTimestamps.$get(i))){
                            continue;
                        }
                        prevTimestamps.$set(i, (Integer) gamePad.$get("timestamp"));

                        // in key mapping
                        if (handler.genericInput) {
                            if (net.wolfTec.activeState.mode != 1) {
                                return;
                            }

                            int code = -1;

                            // grab key code of the pressed button
                            if (gamePad.elements[0] == 1) {
                                code = 0;
                            } else if (gamePad.elements[1] == 1) {
                                code = 1;
                            } else if (gamePad.elements[2] == 1) {
                                code = 2;
                            } else if (gamePad.elements[3] == 1) {
                                code = 3;
                            } else if (gamePad.elements[4] == 1) {
                                code = 4;
                            } else if (gamePad.elements[5] == 1) {
                                code = 5;
                            } else if (gamePad.elements[6] == 1) {
                                code = 6;
                            } else if (gamePad.elements[7] == 1) {
                                code = 7;
                            } else if (gamePad.elements[8] == 1) {
                                code = 8;
                            } else if (gamePad.elements[9] == 1) {
                                code = 9;
                            } else if (gamePad.elements[10] == 1) {
                                code = 10;
                            } else if (gamePad.elements[11] == 1) {
                                code = 11;
                            } else if (gamePad.elements[12] == 1) {
                                code = 12;
                            } else if (gamePad.elements[13] == 1) {
                                code = 13;
                            }

                            if (code > -1) {
                                state.activeState.genericInput(code);
                            }
                        } else {
                            InputType key = null;

                            // try to extract key
                            if (gamePad.buttons[GAMEPAD_MAPPING.ACTION] == 1) {
                                key = InputType.ACTION;

                            } else if (gamePad.buttons[GAMEPAD_MAPPING.CANCEL] === 1) {
                                key = InputType.CANCEL;

                            } else if (gamePad.axes[1] < -0.5) {
                                key = InputType.UP;

                            } else if (gamePad.axes[1] > +0.5) {
                                key = InputType.DOWN;

                            } else if (gamePad.axes[0] < -0.5) {
                                key = InputType.LEFT;

                            } else if (gamePad.axes[0] > +0.5) {
                                key = InputType.RIGHT;
                            }

                            // invoke input event when a known key was pressed
                            if (key != null) handler.pushAction(key, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
                        }
                    }
                }
            }
        };
    }
}