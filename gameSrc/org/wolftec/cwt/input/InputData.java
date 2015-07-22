package org.wolftec.cwt.input;

import org.wolftec.cwt.Constants;

/**
 * Represents a given data set of an input call.
 */
public class InputData {

  public int key;
  public int d1;
  public int d2;

  public InputData() {
    reset();
  }

  /**
   * Resets the object data to a fresh state (no saved information).
   */
  public void reset() {
    this.key = Constants.INACTIVE;
    this.d1 = Constants.INACTIVE;
    this.d2 = Constants.INACTIVE;
  }
}