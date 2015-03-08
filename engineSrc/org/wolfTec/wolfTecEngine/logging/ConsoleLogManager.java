package org.wolfTec.wolfTecEngine.logging;

import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ReflectionUtil;

@ManagedComponent(whenQualifier="log=CONSOLE")
public class ConsoleLogManager implements LogManager {

  @Override
  public Logger createByClass(Class<?> clazz) {
    return new ConsoleLogger(ReflectionUtil.getSimpleName(clazz));
  }

  @Override
  public Logger createByName(String name) {
    return new ConsoleLogger(name);
  }
  
}
