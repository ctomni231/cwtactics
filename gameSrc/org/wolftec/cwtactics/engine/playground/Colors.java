package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge
public class Colors {

  public static native Color color(String color);

  public static native Color color(Array<Integer> colors);

  public static native Color color(Array<Double> colors, String mode);
}
