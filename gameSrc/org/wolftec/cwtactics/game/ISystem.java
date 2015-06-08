package org.wolftec.cwtactics.game;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.game.components.old.DataType;
import org.wolftec.cwtactics.game.system.old.SystemEvents;

public interface ISystem extends ConstructedClass {

  default EntityManager em() {
    EntityManager em = (EntityManager) JSObjectAdapter.$get(this, "__em__");

    // cache the entity manager reference to avoid expensive lookup
    // TODO maybe there is a way without property (--> prototype ?)
    if (em == JSGlobal.undefined) {
      em = ConstructedFactory.getObject(EntityManager.class);
      JSObjectAdapter.$put(this, "__em__", em);
    }

    return em;
  }

  default int getCfgValue(String config) {
    // TODO
    return 0;
  }

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
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default <T extends IEntityComponent> T aec(String id, Class<T> componentClass) {
    return entityManager().acquireEntityComponent(id, componentClass);
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default String aewid(String id) {
    return entityManager().acquireEntityWithId(id);
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default <T extends IEntityComponent> T gec(String id, Class<T> clazz) {
    return entityManager().getComponent(id, clazz);
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default <T extends IEntityComponent> T gogec(String id, Class<T> clazz) {
    T component;

    component = entityManager().getComponent(id, clazz);
    if (component == null) {
      component = entityManager().acquireEntityComponent(id, clazz);
    }
    return component;
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default <T extends IEntityComponent> void atec(String id, T component) {
    entityManager().attachEntityComponent(id, component);
  }

  /**
   * WILL BE REMOVED SOON.
   * 
   * @deprecated
   * @return
   */
  @Deprecated
  default <T extends IEntityComponent> void datec(String id, Class<T> clazz) {
    entityManager().detachEntityComponentByClass(id, clazz);
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
    return manager.getComponent(manager.getComponent(id, DataType.class).typeEntity, clazz);
  }
}
