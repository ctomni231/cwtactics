package org.wolftec.cwtactics.game.util;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;

public class NumberUtil {

  public static int getRandomInt(int max) {
    return JSGlobal.parseInt(((int) JSObjectAdapter.$js("Math.random()")) * max, 10);
  }
}
