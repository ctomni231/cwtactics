package net.wolfTec.wtEngine.input.impl;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.input.InputBackend;
import net.wolfTec.wtEngine.input.InputBean;
import net.wolfTec.wtEngine.input.InputTypeKey;
import net.wolfTec.wtEngine.log.Logger;

import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

import static org.stjs.javascript.JSObjectAdapter.*;

@Bean public class MouseInputBean implements InputBackend {

  private Logger log;
  @Injected private InputBean input;

  private final Function1<DOMEvent, Boolean> mouseUpEvent = (event) -> {
    if (event == null) {
      event = $js("window.event");
    }
    
    InputTypeKey key = null;
    switch (event.which) {

      case 1:
        key = InputTypeKey.A;
        break;

      case 3:
        key = InputTypeKey.B;
        break;
    }

    if (key != null) {
      input.pushAction(key, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
      return true;
    } else
      return false;
  };

  private final Function1<DOMEvent, Boolean> mouseMoveEvent = (event) -> {
    if (event == null) {
      event = $js("window.event");
    }
    
    int x, y;
    if ((boolean) $js("event.offsetX === 'number'")) {
      x = $js("event.offsetX");
      y = $js("event.offsetY");
    } else {
      x = $js("event.layerX");
      y = $js("event.layerY");
    }

    /* TODO
    int cw = targetElement.width;
    int ch = targetElement.height;

    // get the scale based on actual width;
    int sx = cw / targetElement.offsetWidth;
    int sy = ch / targetElement.offsetHeight;

    var data = state.activeState;
    if (data.inputMove) data.inputMove(JSGlobal.parseInt(x * sx, 10), JSGlobal.parseInt(y * sy, 10));
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

  @Override public void enable() {
    log.info("disable mouse input");
    $js("targetElement.onmousemove = this.mouseMoveEvent");
    $js("targetElement.onmouseup = this.mouseUpEvent");
  }

  @Override public void disable() {
    log.info("disable mouse input");
    $js("targetElement.onmousemove = null");
    $js("targetElement.onmouseup = null");
  }
}
