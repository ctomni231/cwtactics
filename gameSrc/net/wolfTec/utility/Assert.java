package net.wolfTec.utility;

import net.wolfTec.Constants;

/**
 * Utility class to male assertions for given statements.
 */
public class Assert {

    public static final String LOG_HEADER = Constants.LOG_ASSERTION;

    public static void notNull(Object obj) {
        if (obj == null) Debug.logCritical(LOG_HEADER, "NullPointerException");
    }

    public static void greaterEquals (int actual, int min) {
        if (actual < min) Debug.logCritical(LOG_HEADER, "IllegalArgumentValue");
    }

    public static void greaterThen (int actual, int min) {
        if (actual <= min) Debug.logCritical(LOG_HEADER, "IllegalArgumentValue");
    }

    public static void lowerEquals (int actual, int min) {
        if (actual > min) Debug.logCritical(LOG_HEADER, "IllegalArgumentValue");
    }

    public static void lowerThen (int actual, int min) {
        if (actual >= min) Debug.logCritical(LOG_HEADER, "IllegalArgumentValue");
    }

    public static void isNot (int actual, int not) {
        if (actual == not) Debug.logCritical(LOG_HEADER, "IllegalArgumentValue");
    }

    public static void notEmpty (String actual) {
        if (actual == null || actual.isEmpty()) {
            Debug.logCritical(LOG_HEADER, "IllegalArgumentValue");
        }
    }
}
