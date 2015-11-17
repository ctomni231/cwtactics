package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSStringAdapter;
import org.wolftec.cwt.core.javascript.JsUtil;

/**
 * Version utility to manage version strings.
 */
public abstract class VersionUtil {

  private static int parseVersionNumber(String number) {
    int code;

    code = NumberUtil.asInt(number);
    AssertUtil.assertThat(code >= 0 || code < 100, "a version part must be in the range from 0 to 99");

    return code;
  }

  private static Array<String> parseVersionString(String version) {
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

  /**
   * Converts a version string (format: major.minor[.patch[.build]]) to an
   * integer. The result integer is unique and supports comparison with other
   * version numbers. This means the version number of 1.2 is greater as the
   * generated version number of 1.0.0.1.
   * 
   * @param version
   * @return unique numeric version of the version string
   */
  public static int convertVersionToNumber(String version) {
    final int VERSION_CALC_BUILD = 1;
    final int VERSION_CALC_PATCH = 100;
    final int VERSION_CALC_MINOR = 10000;
    final int VERSION_CALC_MAJOR = 1000000;
    final int VERSION_CALC_BASE = 100000000;

    Array<String> parts = parseVersionString(version);
    int code = VERSION_CALC_BASE;

    code += VERSION_CALC_BUILD * parseVersionNumber(parts.$get(3));
    code += VERSION_CALC_PATCH * parseVersionNumber(parts.$get(2));
    code += VERSION_CALC_MINOR * parseVersionNumber(parts.$get(1));
    code += VERSION_CALC_MAJOR * parseVersionNumber(parts.$get(0));

    return code;
  }
}
