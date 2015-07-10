package org.wolftec.cwtactics.game.core.syscomponent;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.core.SystemPropertyHandler;
import org.wolftec.cwtactics.game.core.systems.System;

public class SystemComponentsManager implements SystemPropertyHandler {

  private Map<String, Components> instances;

  public SystemComponentsManager() {
    instances = JSCollections.$map();
  }

  @Override
  public <T> T getSystemDepedency(System system, String propertyName, Class<?> propertyType) {
    if (propertyType != Components.class) {
      return null;
    }

    return (T) CheckedValue.of(instances.$get(propertyName)).getOrElseByProvider(() -> registerComponentsForProperty(system, propertyName, propertyType));
  }

  private Components registerComponentsForProperty(System system, String propertyName, Class<?> propertyType) {
    Components components = new Components(ClassUtil.getClassPropertySubType(ClassUtil.getClass(system), propertyName));
    instances.$put(propertyName, components);
    return components;
  }
}
