package org.wolftec.cwt.system;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;

public class NumberUtil {

  public static int compareInt(int a, int b) {
    if (a < b) {
      return -1;
    } else if (a == b) {
      return 0;
    } else {
      return +1;
    }
  }

  public static int getRandomInt(int max) {
    return JSGlobal.parseInt(((int) JSObjectAdapter.$js("Math.random()")) * max, 10);
  }

  public static int asInt(Number value) {
    return JSGlobal.parseInt(value, 10);
  }

  public static int stringAsInt(String value) {
    return JSGlobal.parseInt(value, 10);
  }

  public static int safeStringAsInt(String value, int defValue) {
    try {
      return JSGlobal.parseInt(value, 10);
    } catch (Exception e) {
      return defValue;
    }
  }
}
