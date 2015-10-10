package org.wolftec.cwt.system;

import org.stjs.javascript.JSStringAdapter;

/**
 * Converter which is able to convert id codes.
 */
public abstract class SheetIdNumberConverter {

  private static final int BASE = 100;

  /**
   * 
   * @param id
   * @return numeric sheet code
   */
  public static int toNumber(String id) {
    int resultCode = 100000000;
    for (int i = 0; i < id.length(); i++) {
      int charCode = JSStringAdapter.charCodeAt(id, i);
      resultCode += (charCode * Math.pow(BASE, i));
    }
    return resultCode;
  }

  /**
   * 
   * @param idNumber
   * @return sheet id for the given id number
   */
  public static String toId(int idNumber) {
    String id = idNumber + "";
    String result = "";
    for (int i = 0; i < id.length(); i += 2) {
      int code = NumberUtil.convertStringToInt(id.substring(i, 2));
      String letter = JSStringAdapter.fromCharCode(String.class, code);
      result += letter;
    }
    return result;
  }
}
