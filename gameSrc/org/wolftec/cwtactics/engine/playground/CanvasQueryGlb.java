package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Image;

@GlobalScope
public class CanvasQueryGlb {

  public native CanvasQuery cq();

  public native CanvasQuery cq(Canvas cv);

  public native CanvasQuery cq(Image image);

  public native CanvasQuery cq(CanvasQuery cvq);

  public native CanvasQuery cq(int width, int height);
}
