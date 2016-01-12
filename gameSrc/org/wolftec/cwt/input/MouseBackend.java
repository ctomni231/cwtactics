package org.wolftec.cwt.input;

import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.util.NullUtil;

class MouseBackend implements ManagedClass, InputBackend
{

  @STJSBridge
  static class MouseEvent
  {
    int offsetX;
    int offsetY;
    int layerX;
    int layerY;
  }

  private Log            log;
  private GraphicManager gfx;
  private InputService   input;

  public boolean handleDownEvent(DOMEvent ev)
  {
    input.pressButton(getKeyFromCode(ev.which));
    return true;
  }

  public boolean handleUpEvent(DOMEvent ev)
  {
    input.releaseButton(getKeyFromCode(ev.which));
    return true;
  }

  public boolean handleMoveEvent(DOMEvent origEv)
  {
    MouseEvent ev = (MouseEvent) ((Object) origEv);

    int x;
    int y;
    if (NullUtil.isPresent(ev.offsetX))
    {
      x = ev.offsetX;
      y = ev.offsetY;
    }
    else
    {
      x = ev.layerX;
      y = ev.layerY;
    }

    // TODO input.setLastX(gfx.convertPointToTile(x));
    // TODO input.setLastY(gfx.convertPointToTile(y));
    return true;
  }

  private String getKeyFromCode(int code)
  {
    switch (code)
    {
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
  public void enable()
  {
    log.info("activating mouse input");
    gfx.mainCanvas.onmousemove = (Function1<DOMEvent, Boolean>) this::handleMoveEvent;
    gfx.mainCanvas.onmousedown = (Function1<DOMEvent, Boolean>) this::handleDownEvent;
    gfx.mainCanvas.onmouseup = (Function1<DOMEvent, Boolean>) this::handleUpEvent;
  }

  @Override
  public void disable()
  {
    log.info("deactivating mouse input");
    gfx.mainCanvas.onmousemove = null;
    gfx.mainCanvas.onmousedown = null;
    gfx.mainCanvas.onmouseup = null;
  }

}
