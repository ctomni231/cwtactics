package net.wolfTec.wtEngine.utility;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.Namespace;

/**
 * Utility class to male assertions for given statements.
 */
@Namespace("cwt") public abstract class AssertUtil {

	public static void notNull(Object obj) {
		if (obj == null) throw new Error("NullPointerException");
	}

	public static void greaterEquals(int actual, int min) {
		if (actual < min) throw new Error("AssertmentFailed");
	}

	public static void greaterThen(int actual, int min) {
		if (actual <= min) throw new Error("AssertmentFailed");
	}

	public static void lowerEquals(int actual, int min) {
		if (actual > min) throw new Error("AssertmentFailed");
	}

	public static void lowerThen(int actual, int min) {
		if (actual >= min) throw new Error("AssertmentFailed");
	}

	public static void isNot(Object actual, Object not) {
		if (actual == not) throw new Error("AssertmentFailed");
	}

	public static void notEmpty(String actual) {
		if (actual == null || actual.isEmpty()) throw new Error("AssertmentFailed");
	}
	
	public static void hasNoProperty(Object obj, String key) {
		if (JSObjectAdapter.hasOwnProperty(obj, key)) throw new Error("AssertmentFailed");
	}

	public static void hasProperty(Object obj, String key) {
		if (!JSObjectAdapter.hasOwnProperty(obj, key)) throw new Error("AssertmentFailed");
	}
}
