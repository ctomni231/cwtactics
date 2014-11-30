package net.wolfTec.input.backends;

import net.wolfTec.Constants;
import net.wolfTec.input.InputBackend;
import net.wolfTec.input.InputHandler;
import net.wolfTec.input.InputType;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.EventTarget;
import org.stjs.javascript.dom.Node;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;

public abstract class Keyboard {

    public static final String LOG = Constants.logHeader("input.keyboard");

    public static final InputBackend createBackend (final InputHandler handler, final Element targetElement) {

        final Function1<DOMEvent, Boolean> keyboardHandler = new Function1<DOMEvent, Boolean> () {
            @Override
            public Boolean $invoke(DOMEvent domEvent) {
                InputType key = null;

                if (handler.genericInput) {
                    if (state.activeState.mode != 0) {
                        return false;
                    }

                    // TODO
                    state.activeState.genericInput(domEvent.keyCode);

                } else {
                    Map<String, Integer> KEYBOARD_MAPPING = handler.KEYBOARD_MAPPING;
                    int keyCode = domEvent.keyCode;

                    if (keyCode == handler.CONSOLE_TOGGLE_KEY) {
                        Debug.logCritical("","Niy");

                    } else if (keyCode == KEYBOARD_MAPPING.$get("LEFT")) {
                        key = InputType.LEFT;

                    } else if (keyCode == KEYBOARD_MAPPING.$get("UP")) {
                        key = InputType.UP;

                    } else if (keyCode == KEYBOARD_MAPPING.$get("RIGHT")) {
                        key = InputType.RIGHT;

                    } else if (keyCode == KEYBOARD_MAPPING.$get("DOWN")) {
                        key = InputType.DOWN;

                    } else if (keyCode == KEYBOARD_MAPPING.$get("CANCEL")) {
                        key = InputType.CANCEL;

                    } else if (keyCode == KEYBOARD_MAPPING.$get("ACTION")) {
                        key = InputType.ACTION;
                    }

                    // push key into input stack
                    if (key != null) {
                        handler.pushAction(key, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
                        return true;
                    }
                }
                return false;
            }
        };

        return new InputBackend() {
            @Override
            public void enable() {
                Debug.logInfo(LOG, "disable keyboard input");
                targetElement.onkeydown = keyboardHandler;
            }

            @Override
            public void disable() {
                Debug.logInfo(LOG, "disable keyboard input");
                targetElement.onkeydown = null;
            }
        };
    }
}
