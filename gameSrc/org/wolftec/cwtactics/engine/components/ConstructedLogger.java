package org.wolftec.cwtactics.engine.components;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;

public interface ConstructedLogger {

  default String getLoggerName() {
    return (String) JSObjectAdapter.$get(JSObjectAdapter.$constructor(this), "__className");
  }

  default void info(String msg) {
    Global.console.info("[" + getLoggerName() + "][INFO] " + msg);
  }

  default void warn(String msg) {
    Global.console.warn("[" + getLoggerName() + "][WARN] " + msg);
  }

  default void error(String msg) {
    Global.console.error("[" + getLoggerName() + "][ERROR] " + msg);
  }
}
