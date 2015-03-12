package org.wolftec.core;

import org.stjs.javascript.Date;

/**
 * 
 * This is only available on Google Chrome at the moment. Every other browser
 * will likely return -1 for every method invocation in this bean.
 */
public abstract class PerformanceUtil {

  private static boolean memoryProfilingEnabled;

  static {
    memoryProfilingEnabled = JsExec.injectJS("(performance && performance.memory)");
  }

  /**
   * 
   * @return heap size limit or -1 if performance API is not available
   */
  public static int getHeapSizeLimit() {
    return memoryProfilingEnabled ? JsExec.injectJS("performance.memory.jsHeapSizeLimit") : -1;
  }

  /**
   * 
   * @return total heap size or -1 if performance API is not available
   */
  public static int getTotalHeapSize() {
    return memoryProfilingEnabled ? JsExec.injectJS("performance.memory.totalJSHeapSize") : -1;
  }

  /**
   * 
   * @return used heap size or -1 if performance API is not available
   */
  public static int getUsedHeapSize() {
    return memoryProfilingEnabled ? JsExec.injectJS("performance.memory.usedJSHeapSize") : -1;
  }
  
  /**
   * 
   * @return
   */
  public static int getCurrentTime() {
    return (int) (new Date()).getTime();
  }
}