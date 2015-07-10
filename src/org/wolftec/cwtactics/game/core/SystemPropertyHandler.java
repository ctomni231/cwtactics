package org.wolftec.cwtactics.game.core;

import org.wolftec.cwtactics.game.core.systems.System;

public interface SystemPropertyHandler {

  <T> T getSystemDepedency(System system, String propertyName, Class<?> propertyType);
}
