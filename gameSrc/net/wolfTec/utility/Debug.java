package net.wolfTec.utility;

import net.wolfTec.Constants;
import net.wolfTec.bridges.Window;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;

public abstract class Debug {

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
        if (Constants.DEBUG) Global.console.log(INFO + (header != null ? header : "UNKN") + ":" + msg);
    }

    /**
     * Logs a warning message.
     *
     * @param {String} header
     * @param {String} msg
     */
    public static void logWarn(String header, String msg) {
        if (Constants.DEBUG) Global.console.log(WARN + (header != null ? header : "UNKN") + ":" + msg);
    }

    /**
     * Logs a critical message.
     *
     * @param {String} header
     * @param {String} msg
     */
    public static void logCritical(String header, String msg, Exception e) {
        if (Constants.DEBUG) Global.console.log(ERR + (header != null ? header : "UNKN") + ":" + msg);
        JSGlobal.stjs.exception(e != null ? e : msg);
    }

}
