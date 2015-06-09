package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.ClassUtil;

public interface ConstructedClass {

  public static final String NAME_UNKNOWN_LOGGER = "UnknownLogger";
  public static final String PROPERTY_LOGGER_NAME = "__loggerName";

  default String getLoggerName() {
    String name = ClassUtil.getClassName(this);
    return name == null ? NAME_UNKNOWN_LOGGER : name;
  }

  default String getCachedLoggerName() {
    String loggerName = (String) JSObjectAdapter.$get(JSObjectAdapter.$constructor(this), PROPERTY_LOGGER_NAME);
    if (loggerName == JSGlobal.undefined) {
      loggerName = getLoggerName();

      if (loggerName.length() < Constants.LOGGER_CLASS_NAME_LENGTH) {
        int missingSpaces = Constants.LOGGER_CLASS_NAME_LENGTH - loggerName.length();
        String newName = "";
        for (int i = 0; i < missingSpaces; i++) {
          newName += " ";
        }
        loggerName = newName + loggerName;

      } else if (loggerName.length() > Constants.LOGGER_CLASS_NAME_LENGTH) {
        loggerName = loggerName.substring(0, Constants.LOGGER_CLASS_NAME_LENGTH);
      }

      JSObjectAdapter.$put(JSObjectAdapter.$constructor(this), PROPERTY_LOGGER_NAME, loggerName);
    }
    return loggerName;
  }

  default void info(String msg) {
    Global.console.log("%c[" + getCachedLoggerName() + "][ INFO] %c" + msg, Constants.LOGGER_CSS_INFO_HEAD, Constants.LOGGER_CSS_TEXT);
  }

  default void warn(String msg) {
    Global.console.log("%c[" + getCachedLoggerName() + "][ WARN] %c" + msg, Constants.LOGGER_CSS_WARN_HEAD, Constants.LOGGER_CSS_TEXT);
  }

  default void error(String msg) {
    Global.console.log("%c[" + getCachedLoggerName() + "][ERROR] %c" + msg, Constants.LOGGER_CSS_ERROR_HEAD, Constants.LOGGER_CSS_TEXT);
  }

  default void throwError(String msg) {
    error(msg);
    JSObjectAdapter.$js("throw new Error(msg)");
  }

  default void onConstruction() {

  }
}
