package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Global;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.ClassUtil;

public class Log implements ConstructedObject {

  private String loggerName;

  @Override
  public void onConstruction(ConstructedClass instance) {
    loggerName = ClassUtil.getClassName(instance);

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
  }

  public void info(String msg) {
    Global.console.log("%c[" + loggerName + "][ INFO] %c" + msg, Constants.LOGGER_CSS_INFO_HEAD, Constants.LOGGER_CSS_TEXT);
  }

  public void warn(String msg) {
    Global.console.log("%c[" + loggerName + "][ WARN] %c" + msg, Constants.LOGGER_CSS_WARN_HEAD, Constants.LOGGER_CSS_TEXT);
  }

  public void error(String msg) {
    Global.console.log("%c[" + loggerName + "][ERROR] %c" + msg, Constants.LOGGER_CSS_ERROR_HEAD, Constants.LOGGER_CSS_TEXT);
  }
}
