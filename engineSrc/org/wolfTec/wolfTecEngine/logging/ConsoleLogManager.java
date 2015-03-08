package org.wolfTec.wolfTecEngine.logging;

import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedContructionFactory;
import org.wolfTec.wolfTecEngine.components.ManagerOptions;
import org.wolfTec.wolfTecEngine.components.ReflectionUtil;

@ManagedComponent
public class ConsoleLogManager implements ManagedContructionFactory {

  @Override
  public <T> Object create(T component, Class<T> clazz, String property, ManagerOptions options) {
    return new ConsoleLogger(ReflectionUtil.getSimpleName(clazz));
  }
  
}
