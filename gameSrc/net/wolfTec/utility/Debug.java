package net.wolfTec.utility;

import net.wolfTec.Constants;
import org.stjs.javascript.*;

public abstract class Debug {

    public static final String LOG_UNKNOWN_HEADER = Constants.logHeader("unknown");
    public static final String LOG_DELIMITER = ":";

    public static final String INFO = "INFO:  ";
    public static final String WARN = "WARN:  ";
    public static final String ERR = "ERROR: ";

    public static final int MAX_PERF_CHECKS = 5;

    private static final Array<Integer> performanceTimes;

    static {
        performanceTimes = JSCollections.$array();
        for (int i = 0; i < MAX_PERF_CHECKS; i++) {
            performanceTimes.push(null);
        }
    }

    public static int startPerformanceCheck() {
        for (int i = 0; i < MAX_PERF_CHECKS; i++) {
            if (performanceTimes.$get(i) == null) {
                performanceTimes.$set(i, (int) (new Date()).getTime());
                logInfo("DEBUG", "Start Performance check " + i);
                return i;
            }
        }
        logCritical("DEBUG", "PerformanceStackIsFull");
        return -1;
    }

    public static void stopPerformanceCheck(int id) {
        if (id < 0 || id >= MAX_PERF_CHECKS) {
            logCritical("DEBUG", "UnknownPerformanceCheckId");
        }

        int ctime = (int) (new Date()).getTime();
        int time = performanceTimes.$get(id);
        performanceTimes.$set(id, null);

        logInfo("DEBUG", "Performance check " + id + " is completed -> " + (ctime - time) + "ms");
    }

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
