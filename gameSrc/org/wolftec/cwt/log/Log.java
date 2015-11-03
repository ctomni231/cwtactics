package org.wolftec.cwt.log;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.annotation.Native;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.annotations.OptionalParameter;
import org.wolftec.cwt.managed.Constructable;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.util.ClassUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.UrlParameterUtil;

public class Log implements Constructable {

  private String loggerName;
  private boolean disabled;

  @Override
  public void onConstruction(ManagedClass instance) {
    initByName(ClassUtil.getClassName(instance));
  }

  private void initByName(String name) {
    loggerName = Log.convertNameToFixedLength(name);
    disabled = NullUtil.isPresent(JSStringAdapter.match(NullUtil.getOrElse(UrlParameterUtil.getParameter("disabledLoggers"), ""),
                                                        JSGlobal.RegExp(name + "($|[,])")));
  }

  public static int startTime;

  public String now() {
    return JSObjectAdapter.$js("(new Date()).toJSON().substring(11,19)");
  }

  public void info(String msg) {
    if (!disabled) {
      Global.console.log("%c[" + now() + "][" + loggerName + "][ INFO] %c" + msg, Constants.LOGGER_CSS_INFO_HEAD, Constants.LOGGER_CSS_TEXT);
    }
  }

  public void warn(String msg) {
    if (!disabled) {
      Global.console.log("%c[" + now() + "][" + loggerName + "][ WARN] %c" + msg, Constants.LOGGER_CSS_WARN_HEAD, Constants.LOGGER_CSS_TEXT);
    }
  }

  @Native
  public void error(String msg) {
    error(msg, null);
  }

  public void error(String msg, @OptionalParameter Exception e) {
    if (!disabled) {
      Global.console.log("%c[" + now() + "][" + loggerName + "][ERROR] %c" + msg, Constants.LOGGER_CSS_ERROR_HEAD, Constants.LOGGER_CSS_TEXT);
      if (e != null && e != JSGlobal.undefined) {
        // Global.console.error(e);
        Global.console.error(JSObjectAdapter.$get(e, "stack"));
      }
    }
  }

  public static String convertNameToFixedLength(String loggerName) {
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
    return loggerName;
  }
}
