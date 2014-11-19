package net.wolfTec.actions;

import net.wolfTec.Constants;
import net.wolfTec.bridges.Window;
import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.stjs.STJS;

/**
 * Holds all data which is needed to invoke an model changing game action in CW:T.
 */
public class ActionData {

    /**
     * Key of the action object that will be invoked.
     */
    public int key;

    public int p1;
    public int p2;
    public int p3;
    public int p4;
    public int p5;
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
