package net.wolfTec.utility;

import net.wolfTec.Constants;
import net.wolfTec.bridges.Window;

public abstract class Debug {

    public static final String INFO = "INFO:  ";
    public static final String WARN = "WARN:  ";
    public static final String ERR = "ERROR: ";

    /**
     * Logs a normal message.
     *
     * @param {String} msg
     */
    public static void logInfo(String msg) {
        if (Constants.DEBUG) Window.console.log(INFO + msg);
    }

    /**
     * Logs a warning message.
     *
     * @param {String} msg
     */
    public static void logWarn(String msg) {
        if (Constants.DEBUG) Window.console.log(WARN + msg);
    }

    /**
     * Logs a critical message.
     *
     * @param {String} msg
     */
    public static void logCritical(String msg) {
        if (Constants.DEBUG) Window.console.log(ERR + msg);
        throw new Error(msg);
    }

}
