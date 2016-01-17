package org.wolftec.cwt.tags;

import org.stjs.javascript.annotation.Native;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;

/**
 * Configuration object which contains a configurable value.
 */
public class Configuration
{

  public final String key;
  public int min;
  public int max;
  public int def;
  public int step;
  public int value;

  @Native
  public Configuration(String key, int min, int max, int defaultValue)
  {
    this(key, min, max, defaultValue, 1);
  }

  public Configuration(String key, int min, int max, int defaultValue, int step)
  {
    this.key = key;
    this.min = min;
    this.max = max;
    this.def = defaultValue;
    this.step = NullUtil.getOrElse(step, 1);
    resetValue();
  }

  /**
   * Sets the value.
   *
   * @param value
   */
  public void setValue(int value)
  {

    // check value bounds
    if (value < min)
      value = min;
    if (value > max)
      value = max;

    // check steps
    if ((value - min) % step != 0)
    {
      JsUtil.throwError("StepCriteriaBrokenException");
    }

    this.value = value;
  }

  /**
   * Decreases the value by one step.
   */
  public void decreaseValue()
  {
    setValue(value - step);
  }

  /**
   * Increases the value by one step.
   */
  public void increaseValue()
  {
    setValue(value + step);
  }

  /**
   * Resets the value of the parameter back to the default value.
   */
  public void resetValue()
  {
    value = def;
  }
}