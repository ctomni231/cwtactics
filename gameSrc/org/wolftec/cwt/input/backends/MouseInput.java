package org.wolftec.cwt.input.backends;

import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.core.Deactivatable;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class MouseInput implements Injectable, Deactivatable {

  // @STJSBridge TODO readd when stjs 3.2.0 is fixed
  @SyntheticType
  static class MouseEvent {
    int offsetX;
    int offsetY;
    int layerX;
    int layerY;
  }

  private Log            log;
  private GraphicManager gfx;
  private InputManager   input;

  public boolean handleDownEvent(DOMEvent ev) {
    input.pressButton(getKeyFromCode(ev.which));
    return true;
  }

  public boolean handleUpEvent(DOMEvent ev) {
    input.releaseButton(getKeyFromCode(ev.which));
    return true;
  }

  public boolean handleMoveEvent(DOMEvent origEv) {
    MouseEvent ev = (MouseEvent) ((Object) origEv);

    int x;
    int y;
    if (Nullable.isPresent(ev.offsetX)) {
      x = ev.offsetX;
      y = ev.offsetY;
    } else {
      x = ev.layerX;
      y = ev.layerY;
    }

    input.lastX = gfx.convertPointToTile(x);
    input.lastY = gfx.convertPointToTile(y);
    return true;
  }

  private String getKeyFromCode(int code) {
    switch (code) {
      case 1:
        return "MOUSE_LEFT";
      case 2:
        return "MOUSE_MIDDLE";
      case 3:
        return "MOUSE_RIGHT";
      default:
        return "MOUSE_UNKNOWN";
    }
  }

  @Override
  public void enable() {
    log.info("activating mouse input");
    gfx.mainCanvas.onmousemove = (Function1<DOMEvent, Boolean>) this::handleMoveEvent;
    gfx.mainCanvas.onmousedown = (Function1<DOMEvent, Boolean>) this::handleDownEvent;
    gfx.mainCanvas.onmouseup = (Function1<DOMEvent, Boolean>) this::handleUpEvent;
  }

  @Override
  public void disable() {
    log.info("deactivating mouse input");
    gfx.mainCanvas.onmousemove = null;
    gfx.mainCanvas.onmousedown = null;
    gfx.mainCanvas.onmouseup = null;
  }

}
