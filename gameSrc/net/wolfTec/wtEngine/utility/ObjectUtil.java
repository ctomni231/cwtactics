package net.wolfTec.wtEngine.utility;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.Math;
import org.stjs.javascript.functions.Function;
import org.stjs.javascript.functions.Function0;

public abstract class ObjectUtil {
    public static boolean notEmpty(String str) {
        return str != null && str.length() > 0;
    }

    /**
     * Calls a function lazy. This means the factory function fn will be called when the curried function (return value)
     * will be called the first time. The factory function needs to return the value that should be returned by the
     * curried function in future.
     *
     * @param lazyCreator
     * @returns {Function}
     */
    public static <T> Function<T> lazy(final Function0<T> lazyCreator) {
        final Map<String, T> holder = JSCollections.$map();
        return new Function0<T>() {
            @Override
            public T $invoke() {
                if (!JSObjectAdapter.hasOwnProperty(holder, "value")) {
                    holder.$put("value", lazyCreator.$invoke());
                }
                return holder.$get("value");
            }
        };
    }


    /**
     * Selects a random element from a given list and returns it. It's possible to give a forbiddenElement
     * that won't be selected from the list.
     *
     * @param list
     * @param forbiddenElement
     * @returns {*}
     */
    public static <T> T selectRandomListElement(Array<T> list, T forbiddenElement) {
        int e = list.$length();
        if (e == 0 || (e == 1 && list.$get(0) == forbiddenElement)) {
            throw new Error("IllegalArguments");
        }

        int r = JSGlobal.parseInt(Math.random() * e, 10);
        T selected = list.$get(r);
        if (selected == forbiddenElement) {
            selected = list.$get(r < e - 1 ? r + 1 : r - 1);
        }

        return selected;
    }

    public static Function0<Object> EMPTY_FUNCTION = new Function0<Object>() {
        @Override
        public Object $invoke() {
            return null;
        }
    };
    
    public static Array<String> getProperties(Object obj) {
    	return JSObjectAdapter.$js("Object.keys(obj)");
    }

}
