package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.data.DataType;

public interface ISystem extends ConstructedClass {

  default EntityManager entityManager() {
    return ConstructedFactory.getObject(EntityManager.class);
  }

  default <T extends IEntityComponent> T getEntityComponent(String id, Class<T> clazz) {
    return entityManager().getEntityComponent(id, clazz);
  }

  default SystemEvents events() {
    return ConstructedFactory.getObject(SystemEvents.class);
  }

  default <T extends IEntityComponent> T aec(String id, Class<T> componentClass) {
    return entityManager().acquireEntityComponent(id, componentClass);
  }

  /**
   * Shortcut for <code>entityManager().acquireEntityWithId(id)</code>
   * 
   * @param id
   * @return
   */
  default String aewid(String id) {
    return entityManager().acquireEntityWithId(id);
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
