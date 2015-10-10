package org.wolftec.cwt.system;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.JsUtil;

/**
 * Some utility functions for handling numbers.
 */
public abstract class NumberUtil {

  /**
   * 
   * @param max
   * @return a random integer from 0 to max (excluded)
   */
  public static int getRandomInt(int max) {
    return JSGlobal.parseInt(((int) JSObjectAdapter.$js("Math.random()")) * max, 10);
  }

  /**
   * 
   * @param value
   * @return value as integer
   */
  public static int asInt(Number value) {
    return JSGlobal.parseInt(value, 10);
  }

  /**
   * 
   * @param value
   * @param defValue
   * @return value as integer or raises an error if not
   */
  public static int convertStringToInt(String value) {
    Number number = JSGlobal.NaN;
    try {
      number = JSGlobal.parseInt(value, 10);
    } catch (Exception e) {
    }
    if (number == JSGlobal.NaN) {
      JsUtil.throwError("NotANumber");
    }
    return (int) number;
  }

  /**
   * 
   * @param value
   * @param defValue
   * @return value as integer or defValue if value is not a number
   */
  public static int convertStringToIntOrDefault(String value, int defValue) {
    Number number = defValue;
    try {
      number = JSGlobal.parseInt(value, 10);
    } catch (Exception e) {
    }
    return number != JSGlobal.NaN ? (int) number : defValue;
  }

  /**
   * Compares two numbers and returns -1 (a is smaller than b), 0 (a is equal b)
   * or +1 (a is greater than b).
   * 
   * @param a
   * @param b
   * @return
   */
  public static int compare(int a, int b) {
    if (a < b) {
      return -1;

    } else if (a > b) {
      return +1;

    } else {
      return 0;
    }
  }
}
