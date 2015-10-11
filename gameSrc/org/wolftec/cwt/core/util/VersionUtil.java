package org.wolftec.cwt.core.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSStringAdapter;

/**
 * Version utility to manage version strings.
 */
public abstract class VersionUtil {

  private static int parseVersionNumber(String number) {
    int code;

    code = NumberUtil.convertStringToInt(number);
    if (code < 0 || code >= 100) {
      JsUtil.throwError("IllegalVersionString: one version part has more than three numbers");
    }

    return code;
  }

  /**
   * 
   * @param version
   * @return unique numeric version of the version string
   */
  public static int convertVersionToNumber(String version) {
    final int VERSION_CALC_PATCH = 1;
    final int VERSION_CALC_BUILD = 100;
    final int VERSION_CALC_MINOR = 10000;
    final int VERSION_CALC_MAJOR = 1000000;
    final int VERSION_CALC_BASE = 100000000;

    Array<String> parts = parseVersionString(version);
    int code = VERSION_CALC_BASE;

    code += VERSION_CALC_PATCH * parseVersionNumber(parts.$get(3));
    code += VERSION_CALC_BUILD * parseVersionNumber(parts.$get(2));
    code += VERSION_CALC_MINOR * parseVersionNumber(parts.$get(1));
    code += VERSION_CALC_MAJOR * parseVersionNumber(parts.$get(0));

    return code;
  }

  /**
   * 
   * @param version
   * @return version numbers as list
   */
  public static Array<String> parseVersionString(String version) {
    Array<String> parts = JSStringAdapter.split(version, ".");

    switch (parts.$length()) {

      case 2:
        parts.push("0", "0");
        break;

      case 3:
        parts.push("0");
        break;

      case 4:
        // perfect version string
        break;

      default:
        JsUtil.throwError("IllegalVersionString: only x.y, x.y.z or x.y.z.w allowed");
        break;
    }

    return parts;
  }
}
