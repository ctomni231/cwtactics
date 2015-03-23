package org.wolftec.cwtactics.game.domain.config;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Template;
import org.wolftec.cwtactics.EngineGlobals;

/**
 *
 */
public class Config {

  private int min;
  private int max;
  private int def;
  private int step;
  private int value;

  /**
   * Configuration object which contains a configurable value.
   */
  public Config(int min, int max, int defaultValue, int step) {
    this.min = min;
    this.max = max;
    this.def = defaultValue;
    this.step = step != EngineGlobals.INACTIVE_ID ? step : 1;
    this.resetValue();
  }

  /**
   * Sets the value.
   *
   * @param {Number} value
   */
  public void setValue(int value) {

    // check value bounds
    if (value < this.min)
      value = this.min;
    else if (value > this.max) value = this.max;

    // check steps
    if ((value - this.min) % this.step != 0)
      JSGlobal.stjs.exception("StepCriteriaBrokenException");
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

  @Template("toProperty")
  public int getValue() {
    return value;
  }
}
