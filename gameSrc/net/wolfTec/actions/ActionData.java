package net.wolfTec.actions;

import net.wolfTec.Constants;

/**
 * Holds all data which is needed to invoke an model changing game action in CW:T.
 */
public class ActionData {

    /**
     * Key of the action object that will be invoked.
     */
    public int key;

    /**
     * 1st. int parameter.
     */
    public int p1;

    /**
     * 2nd. int parameter.
     */
    public int p2;

    /**
     * 3rd. int parameter.
     */
    public int p3;

    /**
     * 4th. int parameter.
     */
    public int p4;

    /**
     * 5th. int parameter.
     */
    public int p5;

    /**
     * 1st. string parameter.
     */
    public String pStr;

    /**
     * Resets the data of the action data.
     */
    public void reset() {
        p1 = Constants.INACTIVE_ID;
        p2 = Constants.INACTIVE_ID;
        p3 = Constants.INACTIVE_ID;
        p4 = Constants.INACTIVE_ID;
        p5 = Constants.INACTIVE_ID;
        pStr = null;
        key = Constants.INACTIVE_ID;
    }
}
