package org.wolftec.cwt.system;

import org.stjs.javascript.Global;
import org.wolftec.cwtactics.game.core.sysobject.SystemObject;
import org.wolftec.cwtactics.game.core.systems.System;

public class Log implements SystemObject {

  /**
   * Controls the exact length of the logger name field in a log message. The
   * class name will be extended (with spaces) or trimmed to has the exact
   * wanted length.
   */
  public static final int    LOGGER_CLASS_NAME_LENGTH = 20;

  public static final String LOGGER_CSS_INFO_HEAD     = "color: #197519; font-weight: bold";

  public static final String LOGGER_CSS_WARN_HEAD     = "color: #FF7519; font-weight: bold";

  public static final String LOGGER_CSS_ERROR_HEAD    = "color: #B20000; font-weight: bold";

  public static final String LOGGER_CSS_TEXT          = "color: #1A1A1A";

  private String             loggerName;

  @Override
  public void onConstruction(System instance) {
    initByObject(instance);
  }

  public void initByObject(Object obj) {
    loggerName = Log.convertNameToFixedLength(ClassUtil.getClassName(obj));
  }

  public void info(String msg) {
    Global.console.log("%c[" + loggerName + "][ INFO] %c" + msg, LOGGER_CSS_INFO_HEAD, LOGGER_CSS_TEXT);
  }

  public void warn(String msg) {
    Global.console.log("%c[" + loggerName + "][ WARN] %c" + msg, LOGGER_CSS_WARN_HEAD, LOGGER_CSS_TEXT);
  }

  public void error(String msg) {
    Global.console.log("%c[" + loggerName + "][ERROR] %c" + msg, LOGGER_CSS_ERROR_HEAD, LOGGER_CSS_TEXT);
  }

  public static String convertNameToFixedLength(String loggerName) {
    if (loggerName.length() < LOGGER_CLASS_NAME_LENGTH) {
      int missingSpaces = LOGGER_CLASS_NAME_LENGTH - loggerName.length();
      String newName = "";
      for (int i = 0; i < missingSpaces; i++) {
        newName += " ";
      }
      loggerName = newName + loggerName;

    } else if (loggerName.length() > LOGGER_CLASS_NAME_LENGTH) {
      loggerName = loggerName.substring(0, LOGGER_CLASS_NAME_LENGTH);
    }
    return loggerName;
  }
}
