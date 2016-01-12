package org.wolftec.cwt.util;

import org.stjs.javascript.JSStringAdapter;

/**
 * Converter which is able to convert id codes. A string based id must be a 4
 * letter ASCII one like <strong>TEST</strong> or <strong>OBJA</strong>.
 */
public abstract class SheetIdNumberUtil
{

  private static final int LETTER_CODE_BASE = 100;
  private static final int RESULT_CODE_BASE = 100000000;

  public static int convertIdToNumber(String id)
  {
    AssertUtil.assertThat(id.length() == 4, "illegal ID code");

    int resultCode = RESULT_CODE_BASE;
    for (int i = 0; i < id.length(); i++)
    {
      int charCode = JSStringAdapter.charCodeAt(id, i);
      resultCode += (charCode * Math.pow(LETTER_CODE_BASE, i));
    }
    return resultCode;
  }

  public static String convertNumberToId(int idNumber)
  {
    AssertUtil.assertThat(idNumber > RESULT_CODE_BASE, "illegal ID code number");
    String id = idNumber + "";
    String result = "";
    for (int i = id.length(); i > 1; i -= 2)
    {
      int code = NumberUtil.asInt(id.substring(i - 2, i));
      String letter = JSStringAdapter.fromCharCode(String.class, code);
      result += letter;
    }
    return result;
  }
}
