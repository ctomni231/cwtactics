package net.wolfTec.system.canvasQuery;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Image;

@GlobalScope public class CanvasQueryLib {

  public native Layer cq(Image img);

  public native Layer cq(Canvas canvas);

  public native Layer cq(Layer layer);

  public CqColor color(int r, int g, int b, float alpha) {
    return JSObjectAdapter.$js("cq.color(r,g,b,alpha)");
  }

  public CqColor color(String color) {
    return JSObjectAdapter.$js("cq.color(color)");
  }

  public CqColor cqColor(Array<Float> color, String mode) {
    return JSObjectAdapter.$js("cq.color(color,mode)");
  }
}
