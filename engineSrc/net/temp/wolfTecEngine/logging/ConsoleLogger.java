package net.temp.wolfTecEngine.logging;

import org.wolftec.core.JsExec;
import org.wolftec.core.JsUtil;

/**
 * Simple <code>window.console</code> logger.
 */
public class ConsoleLogger implements Logger {

  // shares the same API :)
  private Logger p_console; 
  private String p_loggerName;
  
  public ConsoleLogger(String name) {
    p_loggerName = name;
    p_console = JsExec.injectJS("window.console");
  }

  public void info(Object msg) {
    p_console.info("[INFO ][" + this.p_loggerName + "] " + msg);
  }

  public void warn(Object msg) {
    p_console.warn("[WARN ][" + this.p_loggerName + "] " + msg);
  }

  public void error(Object msg) {
    p_console.error("[ERROR][" + this.p_loggerName + "] " + msg);
    JsUtil.raiseError(msg + "");
  }
}
