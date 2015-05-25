package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.data.DataType;

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

  default <T extends IEntityComponent> T gec(String id, Class<T> clazz) {
    return entityManager().getEntityComponent(id, clazz);
  }

  default <T extends IEntityComponent> T gedtc(String id, Class<T> clazz) {
    EntityManager manager = entityManager();
    return manager.getEntityComponent(manager.getEntityComponent(id, DataType.class).typeEntity, clazz);
  }

  default void publishEvent(String event) {

  }
}
