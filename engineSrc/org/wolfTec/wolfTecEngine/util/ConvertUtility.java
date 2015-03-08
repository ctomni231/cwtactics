package org.wolfTec.wolfTecEngine.util;

import org.wolfTec.wolfTecEngine.components.JsExec;


/**
 * Utility class to convert types and units.
 */
public abstract class ConvertUtility {

  /**
   * Converts a string to an integer.
   * 
   * @param number
   * @return
   */
  public static int strToInt(String number) {
    return JsExec.injectJS("parseInt(number, 10)");
  }

  /**
   * Converts a float to an integer.
   * 
   * @param number
   * @return
   */
  public static int floatToInt(double number) {
    return JsExec.injectJS("parseInt(number, 10)");
  }

  public static int absInt(int num) {
    return JsExec.injectJS("Math.abs(num)");
  }

  /**
   * Converts milliseconds to seconds.
   * 
   * @param ms
   * @return
   */
  public static float milliesToSeconds(int ms) {
    return ms / 1000;
  }

  /**
   * Converts seconds to milliseconds.
   * 
   * @param s
   * @return
   */
  public static int secondsToMillies(int s) {
    return s * 1000;
  }
}
