package net.wolfTec.input;

import net.wolfTec.Constants;

public class InputData {

    public InputType key;
    public int d1;
    public int d2;

    /**
     * Resets the object data to a fresh state (no saved information).
     */
    public void reset () {
        key = null;
        d1 = Constants.INACTIVE_ID;
        d2 = Constants.INACTIVE_ID;
    }
}
