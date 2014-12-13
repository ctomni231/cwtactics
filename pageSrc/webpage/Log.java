package webpage;

import org.stjs.javascript.Global;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class Log {

	public static void fine(String msg) {
		Global.console.log("INFO: " + msg);
	}

	public static void warn(String msg) {
		Global.console.log("WARN: " + msg);
	}

	public static void error(String msg) {
		Global.console.log("ERROR: " + msg);
	}
}
