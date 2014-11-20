package net.wolfTec.utility;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public abstract class Workflow {

    /**
     * Calls functions in a sequence. The execution of the functions will be stopped when one of the functions
     * throws an error.
     *
     * @param functionList list of functions that will be called in a sequence
     * @param callback callback that will be called after every function in the list has been called
     * @return {*}
     */
    public static void sequence (final Array<Callback1<Callback0>> functionList, Callback0 callback) {
        if (functionList.$length() == 0) throw new Error("IllegalArgumentException: function list cannot be empty");

        int completed = 0;

        /**
         * Evaluates the current (completed acts as pointer) function in the function list
         */
        Callback1<Callback0> iterate = new Callback1<Callback0>() {
            @Override
            public void $invoke(Callback0 nextCallback) {
                functionList.$get(completed).$invoke(nextCallback);
            }
        };

        Callback0 callbackFunction = new Callback0() {
            @Override
            public void $invoke() {
                completed++;
                if (completed === functionList.length) {
                    if (callback) {
                        callback();
                    }
                } else {
                    iterate(callbackFunction);
                }
            }
        };

        iterate();
    };
}
