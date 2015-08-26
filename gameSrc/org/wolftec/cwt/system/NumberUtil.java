package org.wolftec.cwt.system;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;

public class NumberUtil {

  public static int getRandomInt(int max) {
    return JSGlobal.parseInt(((int) JSObjectAdapter.$js("Math.random()")) * max, 10);
  }

  public static int asInt(Number value) {
    return JSGlobal.parseInt(value, 10);
  }

  public static int stringAsInt(String value) {
    return JSGlobal.parseInt(value, 10);
  }
}
