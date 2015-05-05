package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge
public class Colors {

  @STJSBridge
  public static class Color {

    public native Array<Double> toArray();

    public native String toRgb();

    public native String toRgba();

    public native String toHex();

    public native Array<Double> toHsl();

    public native Array<Double> toHsv();

    public native Color shiftHsl(double h, double s, double l);

    public native Color setHsl(double h, double s, double l);

    public native Color a(double a);

    public native Color alpha(double a);
  }

  public native Color color(String color);

  public native Color color(Array<Integer> colors);

  public native Color color(Array<Double> colors, String mode);
}
