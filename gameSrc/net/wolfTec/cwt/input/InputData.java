package net.wolfTec.cwt.input;

import net.wolfTec.cwt.Constants;

public class InputData {
  
  /**
   * The type of the input command
   */
  public InputTypeKey key;

  /**
   * First parameter of the input command.
   */
  public int          d1;

  /**
   * Second parameter of the input command.
   */
  public int          d2;

  /**
   * Resets the object data to a fresh state (no saved information).
   */
  public void reset() {
    key = null;
    d1 = Constants.INACTIVE_ID;
    d2 = Constants.INACTIVE_ID;
  }
}
