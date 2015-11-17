package org.wolftec.cwt.core.log;

import org.wolftec.cwt.core.javascript.ClassUtil;

public abstract class LogFactory {

  public static Log byName(String name) {
    return new ConsoleLog(name);
  }

  public static Log byClass(Class<?> clazz) {
    return byName(ClassUtil.getClassName(clazz));
  }
}
