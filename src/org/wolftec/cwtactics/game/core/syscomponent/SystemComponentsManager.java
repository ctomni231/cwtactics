package org.wolftec.cwtactics.game.core.syscomponent;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.system.ClassUtil;
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

    return (T) getComponentsFor(system, propertyName, propertyType);
  }

  private Components getComponentsFor(System system, String propertyName, Class<?> propertyType) {
    Class<?> propSubType = ClassUtil.getClassPropertySubType(ClassUtil.getClass(system), propertyName);
    Components instance = instances.$get(ClassUtil.getClassName(propSubType));
    return CheckedValue.of(instance).getOrElseByProvider(() -> registerComponentsForProperty(system, propertyName, propertyType));
  }

  private Components registerComponentsForProperty(System system, String propertyName, Class<?> propertyType) {
    Class<?> systemClazz = ClassUtil.getClass(system);
    Components components = new Components(ClassUtil.getClassPropertySubType(systemClazz, propertyName));
    Class<?> propertySubType = ClassUtil.getClassPropertySubType(systemClazz, propertyName);
    instances.$put(ClassUtil.getClassName(propertySubType), components);
    return components;
  }
}
