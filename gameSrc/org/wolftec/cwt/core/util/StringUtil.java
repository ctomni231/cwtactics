package org.wolftec.cwt.core.util;

import org.stjs.javascript.JSStringAdapter;

public abstract class StringUtil {

  /**
   * 
   * @param value
   * @return a integer based hash value of the given string
   */
  public static int stringToHash(String value) {
    int hash = 0;

    if (value.length() == 0) {
      return hash;
    }

    for (int i = 0; i < value.length(); i++) {
      int c = JSStringAdapter.charCodeAt(value, i);
      hash = ((hash << 5) - hash) + c;
      hash = hash & hash;
    }

    return hash;
  }
}
