package net.wolfTec.input.backends;

import net.wolfTec.Constants;
import net.wolfTec.input.InputBackend;
import net.wolfTec.input.InputHandler;
import net.wolfTec.input.InputType;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.Node;
import org.stjs.javascript.functions.Function1;

public abstract class Mouse {

    public static final String LOG = Constants.logHeader("input.keyboard");

    public static final InputBackend createBackend (final InputHandler handler, final Element targetElement) {

        final Function1<DOMEvent, Boolean> mouseUpEvent = new Function1<DOMEvent, Boolean> () {
            @Override
            public Boolean $invoke(DOMEvent domEvent) {

                InputType key = null;

                // click on canvas while menu is open -> cancel always
                if (domEvent != null) domEvent = (DOMEvent) Global.window.event;
                switch (domEvent.which) {

                    // LEFT
                    case 1:
                        key = InputType.ACTION;
                        break;

                    // MIDDLE
                    case 2:
                        break;

                    // RIGHT
                    case 3:
                        key = InputType.CANCEL;
                        break;
                }

                // push command into the stack
                if (key != null) {
                    handler.pushAction(key, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
                    return true;
                } else return false;
            }
        };


        final Function1<DOMEvent, Boolean> mouseMoveEvent = new Function1<DOMEvent, Boolean> () {
            @Override
            public Boolean $invoke(DOMEvent domEvent) {
                String id = domEvent.target.id;
                int x, y;

                // extract real x,y position on the canvas
                if (domEvent != null) domEvent = (DOMEvent) Global.window.event;
                if (JSGlobal.typeof(domEvent.offsetX) == 'number') {
                    x = domEvent.offsetX;
                    y = domEvent.offsetY;
                }
                else {
                    x = domEvent.layerX;
                    y = domEvent.layerY;
                }

                int cw = targetElement.width;
                int ch = targetElement.height;

                // get the scale based on actual width;
                int sx = cw / targetElement.offsetWidth;
                int sy = ch / targetElement.offsetHeight;

                var data = state.activeState;
                if (data.inputMove) data.inputMove(JSGlobal.parseInt(x * sx, 10), JSGlobal.parseInt(y * sy, 10));

                // convert to a tile position
    /*
     x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10);
     y = cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);

     if (x !== cwt.Cursor.x || y !== cwt.Cursor.y) {
     cwt.Input.pushAction(cwt.Input.TYPE_HOVER, x, y);
     }
     */
                return true;
            }
        };

        return new InputBackend() {
            @Override
            public void enable() {
                Debug.logInfo(LOG, "disable mouse input");
                targetElement.onmousemove = mouseMoveEvent;
                targetElement.onmouseup = mouseUpEvent;
            }

            @Override
            public void disable() {
                Debug.logInfo(LOG, "disable mouse input");
                targetElement.onmousemove = null;
                targetElement.onmouseup = null;
            }
        };
    }
}
