package org.wolfTec.wolfTecEngine.logging;

import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedContructionFactory;
import org.wolftec.core.ManagerOptions;
import org.wolftec.core.ReflectionUtil;

@ManagedComponent
public class ConsoleLogManager implements ManagedContructionFactory {

  @Override
  public <T> Object create(T component, Class<T> clazz, String property, ManagerOptions options) {
    return new ConsoleLogger(ReflectionUtil.getSimpleName(clazz));
  }
  
}
