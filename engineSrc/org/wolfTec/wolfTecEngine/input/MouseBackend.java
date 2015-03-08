package org.wolfTec.wolfTecEngine.input;

import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.functions.Function2;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.JsExec;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.logging.LogManager;
import org.wolfTec.wolfTecEngine.logging.Logger;

@ManagedComponent(whenQualifier="mouse_input=WOLFTEC")
public class MouseBackend implements InputBackend, ManagedComponentInitialization {

  @Injected
  private InputManager p_input;

  private Logger p_log;
  private boolean p_enabled;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_log = manager.getComponentByClass(LogManager.class).createByClass(getClass());

    Function2<DOMEvent, Boolean, Boolean> clickHandler = (event, pressed) -> {
      if (!p_enabled) {
        return false;
      }
      
      if (event == null) {
        event = JsExec.injectJS("window.event");
      }

      String key = null;
      switch (event.which) {

        case 1:
          key = InputTypes.MOUSE_LEFT;
          break;

        case 3:
          key = InputTypes.MOUSE_RIGHT;
          break;
      }

      if (key != null) {
        if (pressed) {
          p_input.keyPressed(key);
        } else {
          p_input.keyReleased(key);
        }
        return true;
        
      } else {
        return false;
      }
    };

    Function1<DOMEvent, Boolean> mouseUpEvent = (event) -> {
      return clickHandler.$invoke(event, false);
    };

    Function1<DOMEvent, Boolean> mouseDownEvent = (event) -> {
      return clickHandler.$invoke(event, true);
    };

    Function1<DOMEvent, Boolean> mouseMoveEvent = (event) -> {
      if (!p_enabled) {
        return false;
      }
      
      if (event == null) {
        event = JsExec.injectJS("window.event");
      }

      int x, y;
      if ((boolean) JsExec.injectJS("event.offsetX === 'number'")) {
        x = JsExec.injectJS("event.offsetX");
        y = JsExec.injectJS("event.offsetY");
      } else {
        x = JsExec.injectJS("event.layerX");
        y = JsExec.injectJS("event.layerY");
      }

      /*
       * TODO int cw = targetElement.width; int ch = targetElement.height;
       * 
       * // get the scale based on actual width; int sx = cw /
       * targetElement.offsetWidth; int sy = ch / targetElement.offsetHeight;
       * 
       * var data = state.activeState; if (data.inputMove)
       * data.inputMove(JSGlobal.parseInt(x * sx, 10), JSGlobal.parseInt(y * sy,
       * 10));
       */
      // convert to a tile position
      /*
       * x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10); y =
       * cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);
       * 
       * if (x !== cwt.Cursor.x || y !== cwt.Cursor.y) {
       * cwt.Input.pushAction(cwt.Input.TYPE_HOVER, x, y); }
       */
      return true;
    };

    JsExec.injectJS("targetElement.onmousemove = mouseMoveEvent");
    JsExec.injectJS("targetElement.onmousedown = mouseDownEvent");
    JsExec.injectJS("targetElement.onmouseup = mouseUpEvent");
  }

  @Override
  public void enable() {
    p_log.info("disable mouse input");
    p_enabled = true;
  }

  @Override
  public void disable() {
    p_log.info("disable mouse input");
    p_enabled = false;
  }
}
