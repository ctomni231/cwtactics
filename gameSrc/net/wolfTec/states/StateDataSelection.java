package net.wolfTec.states;

import net.wolfTec.Constants;
import net.wolfTec.utility.Debug;
import net.wolfTec.utility.DoItHolder;
import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Template;
import org.stjs.javascript.functions.Callback3;
import org.stjs.javascript.functions.Callback4;

public class StateDataSelection {

    public static final int SIDE_LENGTH = Constants.MAX_MOVE_LENGTH*4;

    private Array<Array<Integer>> data;
    private int centerX;
    private int centerY;

    @Template("toProperty")
    public Object getData () {
        return this.data;
    }

    @Template("toProperty")
    public int getCenterX () {
        return this.centerX;
    }

    @Template("toProperty")
    public int getCenterY () {
        return this.centerY;
    }

    public StateDataSelection () {
        data =  JSCollections.$array();
        for (int rx = 0; rx < SIDE_LENGTH; rx++) {
            Array<Integer> subData = JSCollections.$array();
            data.$set(rx, subData);
            for (int ry = 0; ry < SIDE_LENGTH; ry++) {
                this.data.$get(rx).$set(ry, Constants.INACTIVE_ID);
            }
        }
    }

    public void setCenter (int x, int y, int defValue) {
        this.centerX = Math.max(0, x - (SIDE_LENGTH - 1));
        this.centerY = Math.max(0, y - (SIDE_LENGTH - 1));

        // clean data
        for (int rx = 0; rx < SIDE_LENGTH; rx++) {
            for (int ry = 0; ry < SIDE_LENGTH; ry++) {
                this.data.$get(rx).$set(ry, defValue);
            }
        }
    }

    public void clear () {
        this.setCenter(0, 0, Constants.INACTIVE_ID);
    }

    public int getValue (int x, int y) {
        x = x - this.centerX;
        y = y - this.centerY;

        if (x < 0 || y < 0 || x >= SIDE_LENGTH || y >= SIDE_LENGTH) {
            return Constants.INACTIVE_ID;

        } else {
            return this.data.$get(x).$get(y);
        }
    }

    public void setValue (int x, int y, int value) {
        x = x - this.centerX;
        y = y - this.centerY;

        if (x < 0 || y < 0 || x >= SIDE_LENGTH || y >= SIDE_LENGTH) {
            Debug.logCritical(Statemachine.LOG_HEADER, "IndexOutOfBounds");

        } else {
            this.data.$get(x).$set(y, value);
        }
    }

    public boolean hasActiveNeighbour (int x, int y) {
        x = x - this.centerX;
        y = y - this.centerY;

        if (x < 0 || y < 0 || x >= SIDE_LENGTH || y >= SIDE_LENGTH) {
            Debug.logCritical(Statemachine.LOG_HEADER, "IndexOutOfBounds");
        }

        return (
                (x > 0 && this.data.$get(x - 1).$get(y) > 0) ||
                        (y > 0 && this.data.$get(x).$get(y - 1) > 0) ||
                        (x < SIDE_LENGTH - 1 && this.data.$get(x + 1).$get(y) > 0) ||
                        (y < SIDE_LENGTH - 1 && this.data.$get(x).$get(y + 1) > 0)
        );
    }

    public void nextValidPosition (int x, int y, int minValue, boolean walkLeft, Callback3<Integer, Integer, Object> cb, Object arg) {
        x = x - this.centerX;
        y = y - this.centerY;

        if (x < 0 || y < 0 || x >= SIDE_LENGTH || y >= SIDE_LENGTH) {
            if (walkLeft) {
                // start bottom right
                x = SIDE_LENGTH - 1;
                y = SIDE_LENGTH - 1;

            } else {
                // start top left
                x = 0;
                y = 0;

            }
        }

        // walk to the next position
        int mod = (walkLeft) ? -1 : +1;
        y += mod;
        for (; (walkLeft) ? x >= 0 : x < SIDE_LENGTH; x += mod) {
            for (; (walkLeft) ? y >= 0 : y < SIDE_LENGTH; y += mod) {
                if (this.data.$get(x).$get(y) >= minValue) {
                    // valid position
                    cb.$invoke(x, y, arg);
                    return;

                }
            }

            y = (walkLeft) ? SIDE_LENGTH - 1 : 0;
        }
    }

    public boolean nextRandomPosition (Callback3<Integer, Integer, Object> cb, Object arg, int minValue) {
        int n = JSGlobal.parseInt(Math.random() * SIDE_LENGTH, 10);
        for (int x = 0; x < SIDE_LENGTH; x++) {
            for (int y = 0; y < SIDE_LENGTH; y++) {
                if (this.data.$get(x).$get(y) >= minValue) {
                    n--;

                    if (n < 0) {
                        cb.$invoke(x, y, arg);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Sets all values to the value of newValue. If fixedValue is given, then all positions with the same
     * value as fixedValue won't change its value.
     *
     * @param newValue
     * @param fixedValue
     */
    public void setAllValuesTo (int newValue, int fixedValue) {
        for (int x = 0; x < SIDE_LENGTH; x++) {
            for (int y = 0; y < SIDE_LENGTH; y++) {
                if (this.data.$get(x).$get(y) != fixedValue) {
                    this.data.$get(x).$set(y, newValue);
                }
            }
        }
    }

    /**
     * Calls the doIt function on the given doItHolder object on all positions with va value greater equals
     * minValue and lower equals maxValue.
     *
     * @param minValue
     * @param maxValue
     */
    public void onAllValidPositions (int minValue, int maxValue, Callback4<Integer, Integer, Integer, Map<String, Object>> cb, Map<String, Object> args ) {
        for (int x = 0; x < SIDE_LENGTH; x++) {
            for (int y = 0; y < SIDE_LENGTH; y++) {
                int value = this.data.$get(x).$get(y);
                if (value >= minValue && value <= maxValue) {
                    cb.$invoke(x, y, value, args);
                }
            }
        }
    }
}
