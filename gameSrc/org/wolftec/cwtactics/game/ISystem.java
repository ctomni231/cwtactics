package org.wolftec.cwtactics.game;

import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.game.components.data.DataType;
import org.wolftec.cwtactics.game.system.SystemEvents;

public interface ISystem extends ConstructedClass {

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default EntityManager entityManager() {
    return ConstructedFactory.getObject(EntityManager.class);
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default SystemEvents events() {
    return ConstructedFactory.getObject(SystemEvents.class);
  }

  /**
   * Returns the publisher event emitter object for a given event type. Calling
   * the event function on this object leads into an invocation of all listeners
   * for that event function.
   * 
   * @param eventClass
   * @return
   */
  default <T extends IEvent> T publish(Class<T> eventClass) {
    // TODO
    return null;
  }

  /**
   * Acquires an entity component.
   * 
   * @param id
   *          entity id
   * @param componentClass
   *          component class
   * @return component
   */
  default <T extends IEntityComponent> T aec(String id, Class<T> componentClass) {
    return entityManager().acquireEntityComponent(id, componentClass);
  }

  /**
   * Acquires an entity with a given id.
   * 
   * @param id
   *          entity id
   * @return entity id
   */
  default String aewid(String id) {
    return entityManager().acquireEntityWithId(id);
  }

  /**
   * Gets a component of an entity.
   * 
   * @param id
   *          entity id
   * @param clazz
   *          component class
   * @return component or null if no component of the given type was created
   */
  default <T extends IEntityComponent> T gec(String id, Class<T> clazz) {
    return entityManager().getEntityComponent(id, clazz);
  }

  /**
   * Gets or creates, if not created yet, a component of an entity.
   * 
   * @param id
   *          entity id
   * @param clazz
   *          component class
   * @return component
   */
  default <T extends IEntityComponent> T gogec(String id, Class<T> clazz) {
    T component;

    component = entityManager().getEntityComponent(id, clazz);
    if (component == null) {
      component = entityManager().acquireEntityComponent(id, clazz);
    }
    return component;
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @param id
   * @param clazz
   * @deprecated
   * @return
   */
  @Deprecated
  default <T extends IEntityComponent> T gedtc(String id, Class<T> clazz) {
    EntityManager manager = entityManager();
    return manager.getEntityComponent(manager.getEntityComponent(id, DataType.class).typeEntity, clazz);
  }
}
