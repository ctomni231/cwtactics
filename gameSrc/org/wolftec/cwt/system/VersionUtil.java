package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSStringAdapter;
import org.wolftec.cwt.core.JsUtil;

public class VersionUtil {
  public static int convertVersionToNumber(String version) {
    Array<String> parts = JSStringAdapter.split(version, ".");

    if (parts.$length() == 2) {
      parts.push("0", "0");

    } else if (parts.$length() == 3) {
      parts.push("0");

    } else if (parts.$length() != 4) {
      return JsUtil.throwError("IllegalVersionString: only x.y, x.y.z or x.y.z.w allowed");
    }

    int patchCode = NumberUtil.stringAsInt(parts.$get(3));
    int buildCode = NumberUtil.stringAsInt(parts.$get(2));
    int minorCode = NumberUtil.stringAsInt(parts.$get(1));
    int majorCode = NumberUtil.stringAsInt(parts.$get(0));

    if (majorCode < 0 || majorCode >= 100 || minorCode < 0 || minorCode >= 100 || buildCode < 0 || buildCode >= 100 || patchCode < 0 || patchCode >= 100) {
      return JsUtil.throwError("IllegalVersionString: one version part has more than three numbers");
    }

    int code = 100000000;

    code += patchCode;
    code += 100 * buildCode;
    code += 10000 * minorCode;
    code += 1000000 * majorCode;

    return code;
  }
}
