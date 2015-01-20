package net.wolfTec.system.canvasQuery;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public abstract class CqColor {

  /**
   * 
   * @return e.g. [128, 64, 32, 0.5]
   */
  public native Array<Float> toArray();

  /**
   * @return e.g. rgb(128, 64, 32)
   */
  public native String toRgb();

  /**
   * 
   * @return e.g. rgba(128, 64, 32, 0.5)
   */
  public native String toRgba();

  /**
   * 
   * @return e.g. #804020
   */
  public native String toHex();

  /**
   * 
   * @return e.g. [0.05, 0.6, 0.31]
   */
  public native Array<Float> toHsl();

  /**
   * 
   * @return e.g. [0.05, 0.6, 0.31]
   */
  public native Array<Float> toHsv();

  /**
   * 
   * @param h
   * @param s
   * @param l
   */
  public native void shiftHsl(float h, float s, float l);

  /**
   * 
   * @param h
   * @param s
   * @param l
   */
  public native void setHsl(float h, float s, float l);

  /**
   * Shorthand of alpha(value)
   * 
   * @param alpha
   */
  public native void a(float alpha);

  /**
   * Sets the alpha.
   * 
   * @param alpha
   */
  public native void alpha(float alpha);
}