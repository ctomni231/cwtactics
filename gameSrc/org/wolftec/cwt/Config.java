package org.wolftec.cwt;

import org.stjs.javascript.annotation.Native;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;

/**
 * Configuration object which contains a configurable value.
 */
public class Config {

  public int min;
  public int max;
  public int def;
  public int step;
  public int value;

  @Native
  public Config(int min, int max, int defaultValue) {
  }

  public Config(int min, int max, int defaultValue, int step) {
    this.min = min;
    this.max = max;
    this.def = defaultValue;
    this.step = CheckedValue.of(step).getOrElse(1);
    this.resetValue();
  }

  /**
   * Sets the value.
   *
   * @param value
   */
  public void setValue(int value) {

    // check value bounds
    if (value < this.min) value = this.min;
    if (value > this.max) value = this.max;

    // check steps
    if ((value - this.min) % this.step != 0) {
      JsUtil.throwError("StepCriteriaBrokenException");
    }

    this.value = value;
  }

  /**
   * Decreases the value by one step.
   */
  public void decreaseValue() {
    this.setValue(this.value - this.step);
  }

  /**
   * Increases the value by one step.
   */
  public void increaseValue() {
    this.setValue(this.value + this.step);
  }

  /**
   * Resets the value of the parameter back to the default value.
   */
  public void resetValue() {
    this.value = this.def;
  }
}