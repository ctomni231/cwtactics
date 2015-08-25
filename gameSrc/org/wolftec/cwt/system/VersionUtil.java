package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSStringAdapter;
import org.wolftec.cwt.core.JsUtil;

public class VersionUtil {
  public static int convertVersionToNumber(String version) {
    Array<String> parts = JSStringAdapter.split(version, ".");

    if (parts.$length() == 2) {
      parts.push("0");

    } else if (parts.$length() != 3) {
      return JsUtil.throwError("IllegalVersionString: only x.y or x.y.z allowed");
    }

    int buildCode = NumberUtil.stringAsInt(parts.$get(2));
    int minorCode = NumberUtil.stringAsInt(parts.$get(1));
    int majorCode = NumberUtil.stringAsInt(parts.$get(0));

    if (majorCode < 0 || majorCode >= 1000 || minorCode < 0 || minorCode >= 1000 || buildCode < 0 || buildCode >= 1000) {
      return JsUtil.throwError("IllegalVersionString: one version part has more than three numbers");
    }

    return 1000000000 + (1000000 * majorCode) + (1000 * minorCode) + (buildCode);
  }
}
