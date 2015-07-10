package org.wolftec.cwtactics.game.core.sysobject;

import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.core.SystemPropertyHandler;
import org.wolftec.cwtactics.game.core.systems.System;

public class SystemObjectsManager implements SystemPropertyHandler {

  @Override
  public <T> T getSystemDepedency(System system, String propertyName, Class<?> propertyType) {
    SystemObject sysObject = null;

    if (ClassUtil.classImplementsInterface(propertyType, SystemObject.class)) {
      sysObject = ClassUtil.newInstance((Class<SystemObject>) propertyType);
      sysObject.onConstruction(system);
    }

    return (T) sysObject;
  }
}
