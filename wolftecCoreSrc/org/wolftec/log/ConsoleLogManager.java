package org.wolftec.log;

import org.wolftec.core.ManagedContructionFactory;
import org.wolftec.core.ManagerOptions;
import org.wolftec.core.ReflectionUtil;

public class ConsoleLogManager implements ManagedContructionFactory<Logger> {

  @Override
  public Class<Logger> factoryForClass() {
    return Logger.class;
  }

  @Override
  public Object create(Logger component, Class<Logger> clazz, String property,
      ManagerOptions options) {

    return new ConsoleLogger(ReflectionUtil.getSimpleName(clazz));
  }

}
