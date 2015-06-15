package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.ConstructedClass;

public class ComponentManager implements ConstructedClass {

  public <T extends IEntityComponent> Array<T> getComponents(Class<T> componentClass) {
    return null;
  }

  public <T extends IEntityComponent> T getComponent(String entity, Class<T> componentClass) {
    return null;
  }
}
