package net.wolfTec.utility;

import net.wolfTec.Constants;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;

public abstract class Debug {

    public static final String LOG_UNKNOWN_HEADER = Constants.logHeader("unknown");
    public static final String LOG_DELIMITER = ":";

    public static final String INFO = "INFO:  ";
    public static final String WARN = "WARN:  ";
    public static final String ERR = "ERROR: ";

    /**
     * Logs a normal message.
     *
     * @param {String} header
     * @param {String} msg
     */
    public static void logInfo(String header, String msg) {
        Global.console.log(INFO + (header != null ? header : "UNKN") + ":" + msg);
    }

    /**
     * Logs a warning message.
     *
     * @param {String} header
     * @param {String} msg
     */
    public static void logWarn(String header, String msg) {
        Global.console.log(WARN + (header != null ? header : "UNKN") + ":" + msg);
    }

    /**
     * Logs a critical message.
     *
     * @param {String} header
     * @param {String} msg
     */
    public static void logCritical(String header, String msg) {
        logCriticalWithError(header, msg, JSGlobal.stjs.exception(msg));
    }

    /**
     * Logs a critical message with an error.
     *
     * @param {String} header
     * @param {String} msg
     */
    public static void logCriticalWithError(String header, String msg, Exception e) {
        Global.console.log(ERR + (header != null ? header : LOG_UNKNOWN_HEADER) + LOG_DELIMITER + msg);
        Global.console.error(e);
    }

}
