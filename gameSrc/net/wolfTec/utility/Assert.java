package net.wolfTec.utility;

public class Assert {

    public static void notNull(Object obj) {
        if (obj == null) Debug.logCritical("NullPointerException");
    }

    public static void greaterEquals (int actual, int min) {
        if (actual < min) Debug.logCritical("IllegalArgumentValue");
    }

    public static void greaterThen (int actual, int min) {
        if (actual <= min) Debug.logCritical("IllegalArgumentValue");
    }

    public static void lowerEquals (int actual, int min) {
        if (actual > min) Debug.logCritical("IllegalArgumentValue");
    }

    public static void lowerThen (int actual, int min) {
        if (actual >= min) Debug.logCritical("IllegalArgumentValue");
    }

    public static void isNot (int actual, int not) {
        if (actual == not) Debug.logCritical("IllegalArgumentValue");
    }

    public static void notEmpty (String actual) {
        if (actual == null || actual.isEmpty()) {
            Debug.logCritical("IllegalArgumentValue");
        }
    }
}
