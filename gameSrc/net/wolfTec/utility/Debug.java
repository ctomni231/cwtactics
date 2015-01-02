package net.wolfTec.utility;

import net.wolfTec.Constants;
import org.stjs.javascript.*;

public abstract class Debug {

    public static final String LOG_UNKNOWN_HEADER = Constants.LOG_DEBUG;
    public static final String LOG_DELIMITER = ":";

    public static final String INFO = "INFO:  ";
    public static final String WARN = "WARN:  ";
    public static final String ERR = "ERROR: ";

    public static final int MAX_PERF_CHECKS = 5;

    private static final Array<Integer> performanceTimes;

    static {
        performanceTimes = JSCollections.$array();
        for (int i = 0; i < MAX_PERF_CHECKS; i++) {
            performanceTimes.push(Constants.INACTIVE_ID);
        }
    }

    public static int startPerformanceCheck() {
        for (int i = 0; i < MAX_PERF_CHECKS; i++) {
            if (performanceTimes.$get(i) == Constants.INACTIVE_ID) {
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
        performanceTimes.$set(id, Constants.INACTIVE_ID);

        logInfo("DEBUG", "Performance check " + id + " is completed -> " + (ctime - time) + "ms");
    }

}
