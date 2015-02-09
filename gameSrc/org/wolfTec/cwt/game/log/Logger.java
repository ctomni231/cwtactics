package org.wolfTec.cwt.game.log;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public abstract class Logger {

  public native void info(Object msg);

  public native void warn(Object msg);

  public native void error(Object msg);
}
