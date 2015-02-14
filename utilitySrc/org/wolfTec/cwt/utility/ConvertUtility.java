package org.wolfTec.cwt.utility;

import org.stjs.javascript.JSObjectAdapter;

public abstract class ConvertUtility {

  public static int strToInt(String number) {
    return JSObjectAdapter.$js("parseInt(number, 10)");
  }

  public static int floatToInt(double number) {
    return JSObjectAdapter.$js("parseInt(number, 10)");
  }
}
