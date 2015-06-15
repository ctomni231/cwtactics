package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Image;

@GlobalScope
@STJSBridge
public class PlaygroundGlobal {

  public native static Playground playground(Playground object);

  public static Colors cq;

  public static native CanvasQuery cq();

  public static native CanvasQuery cq(Canvas cv);

  public static native CanvasQuery cq(Image image);

  public static native CanvasQuery cq(CanvasQuery cvq);

  public static native CanvasQuery cq(int width, int height);
}
