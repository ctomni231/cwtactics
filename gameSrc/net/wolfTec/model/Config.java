package net.wolfTec.model;

import net.wolfTec.cwt.Constants;

import org.stjs.javascript.annotation.Template;

/**
 *
 */
public class Config {

	private int	min;
	private int	max;
	private int	def;
	private int	step;
	private int	value;

	/**
	 * Configuration object which contains a configurable value.
	 */
	public Config(int min, int max, int defaultValue, int step) {
		this.min = min;
		this.max = max;
		this.def = defaultValue;
		this.step = step != Constants.INACTIVE_ID ? step : 1;
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
		else if (value > this.max)
			value = this.max;

		// check steps
		if ((value - this.min) % this.step != 0)
			throw new IllegalArgumentException("StepCriteriaBrokenException");
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

	@Template("toProperty") public int getValue() {
		return value;
	}
}
