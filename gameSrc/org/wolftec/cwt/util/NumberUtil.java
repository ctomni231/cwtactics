package org.wolftec.cwt.util;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.annotations.MayRaisesError;

/**
 * Some utility functions for handling numbers.
 */
public abstract class NumberUtil
{

  /**
   * 
   * @param max
   * @return a random integer from 0 to max (excluded)
   */
  public static int getRandomInt(int max)
  {
    return JSGlobal.parseInt(((int) JSObjectAdapter.$js("Math.random()")) * max, 10);
  }

  @MayRaisesError("when value is not convertable to an integer")
  public static int asInt(Object value)
  {
    int result = JSGlobal.parseInt(value, 10);
    AssertUtil.assertThat(!JSGlobal.isNaN(value));
    return result;
  }

  /**
   * Failsafe asInt which uses defValue when value is not convertable to an
   * integer.
   * 
   * @param value
   * @param defValue
   * @return value as integer or defValue
   */
  public static int asIntOrElse(String value, int defValue)
  {
    try
    {
      return asInt(value);
    }
    catch (Exception e)
    {
      return defValue;
    }
  }

  /**
   * Compares two numbers and returns -1 (a is smaller than b), 0 (a is equal b)
   * or +1 (a is greater than b).
   * 
   * @param a
   * @param b
   * @return -1, 0 or +1
   */
  public static int compare(int a, int b)
  {
    if (a < b)
    {
      return -1;
    }
    else if (a > b)
    {
      return +1;
    }
    else
    {
      return 0;
    }
  }
}
