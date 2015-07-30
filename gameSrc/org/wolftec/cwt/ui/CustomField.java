package org.wolftec.cwt.ui;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback1;

public class CustomField extends Field {

  private Callback1<CanvasRenderingContext2D> renderFn;

  public CustomField(int x, int y, int w, int h, String key, Callback1<CanvasRenderingContext2D> drawFn) {
    super(x, y, w, h, key, 0, STYLE_NORMAL, null);
    renderFn = drawFn;
  }

}
