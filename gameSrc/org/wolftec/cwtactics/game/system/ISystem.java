package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.IEntityComponent;

public interface ISystem {

  default void onInit() {

  }

  default EntityManager entityManager() {
    return null; // TODO
  }

  default <T extends IEntityComponent> T getEntityComponent(String id, Class<T> clazz) {
    return entityManager().getEntityComponent(id, clazz);
  }

  default SystemEvents events() {
    return ConstructedFactory.getObject(SystemEvents.class);
  }

  default void publishEvent(String event) {

  }
}
