package net.wolfTec.utility;

/**
 * Utility class to male assertions for given statements.
 */
public class Assert {

	public static void notNull(Object obj) {
		if (obj == null) throw new Error("NullPointerException");
	}

	public static void greaterEquals(int actual, int min) {
		if (actual < min) throw new Error("IllegalArgumentValue");
	}

	public static void greaterThen(int actual, int min) {
		if (actual <= min) throw new Error("IllegalArgumentValue");
	}

	public static void lowerEquals(int actual, int min) {
		if (actual > min) throw new Error("IllegalArgumentValue");
	}

	public static void lowerThen(int actual, int min) {
		if (actual >= min) throw new Error("IllegalArgumentValue");
	}

	public static void isNot(Object actual, Object not) {
		if (actual == not) throw new Error("IllegalArgumentValue");
	}

	public static void notEmpty(String actual) {
		if (actual == null || actual.isEmpty()) throw new Error("IllegalArgumentValue");
	}
}
