package org.wolftec.cwt.input.backends;

import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.core.Deactivatable;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.system.Nullable;

public class MouseInput implements Injectable, Deactivatable {

  @STJSBridge
  static class MouseEvent extends DOMEvent {
    int offsetX;
    int offsetY;
    int layerX;
    int layerY;
  }

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
    MouseEvent ev = (MouseEvent) origEv;

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
    gfx.mainCanvas.onmousemove = (Function1<DOMEvent, Boolean>) this::handleMoveEvent;
    gfx.mainCanvas.onmousedown = (Function1<DOMEvent, Boolean>) this::handleDownEvent;
    gfx.mainCanvas.onmouseup = (Function1<DOMEvent, Boolean>) this::handleUpEvent;
  }

  @Override
  public void disable() {
    gfx.mainCanvas.onmousemove = null;
    gfx.mainCanvas.onmousedown = null;
    gfx.mainCanvas.onmouseup = null;
  }

}
