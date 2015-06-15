package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.Array;

public class Colors {

  public static native Color color(String color);

  public static native Color color(Array<Integer> colors);

  public static native Color color(Array<Double> colors, String mode);
}
