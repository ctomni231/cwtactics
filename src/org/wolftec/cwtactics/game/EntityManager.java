package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.util.ComponentSerializationUtil;

public class EntityManager implements ConstructedClass {

  private Log log;

  // TODO cache old entity arrays ?

  private Map<String, String> entityPrototypes;
  private Map<String, Map<String, IEntityComponent>> entities;
  private int entityIdCounter;

  private Function1<String, Boolean> allSelector;

  public EntityManager() {
    entityIdCounter = 0;
    entities = JSCollections.$map();
    entityPrototypes = JSCollections.$map();
    allSelector = (key) -> {
      return true;
    };
  }

  public String acquireEntity() {
    entityIdCounter++;
    return acquireEntityWithId("E" + (entityIdCounter - 1));
  }

  public String acquireEntityWithId(String id) {
    if (id == null || id == JSGlobal.undefined || entities.$get(id) != JSGlobal.undefined) {
      return null;
    }
    entities.$put(id, JSCollections.$map());
    entityPrototypes.$put(id, null);
    return id;
  }

  public boolean isEntity(String id) {
    return JSObjectAdapter.hasOwnProperty(entities, id);
  }

  public <T extends IEntityComponent> T acquireEntityComponent(String id, Class<T> componentClass) {
    // TODO cache components
    return attachEntityComponent(id, JSObjectAdapter.$js("new componentClass()"));
  }

  public <T extends IEntityComponent> T tryAcquireComponentFromData(String id, Object data, Class<T> componentClass) {
    // TODO cache components
    acquireEntityWithId(id);
    T component = ComponentSerializationUtil.parseFromData(data, componentClass);
    if (component != null) attachEntityComponent(id, component);
    return component;
  }

  public <T extends IEntityComponent> T tryAcquireComponentFromDataSuccessCb(String id, Object data, Class<T> componentClass, Callback1<T> successCb) {
    T component = tryAcquireComponentFromData(id, data, componentClass);
    if (component != null) {
      successCb.$invoke(component);
    }
    return component;
  }

  public <T extends IEntityComponent> T attachEntityComponent(String id, T component) {
    Map<String, IEntityComponent> entityMap = entities.$get(id);
    if (JSObjectAdapter.hasOwnProperty(entityMap, id)) {
      log.error("entity contains already a component " + ClassUtil.getClassName(component));
      return null;

    } else {
      entityMap.$put(ClassUtil.getClassName(component), component);
      return component;
    }
  }

  public <T extends IEntityComponent> void detachEntityComponent(String id, T component) {
    Map<String, IEntityComponent> entityMap = entities.$get(id);
    entityMap.$delete(ClassUtil.getClassName(component));
  }

  public <T extends IEntityComponent> void detachEntityComponentByClass(String id, Class<T> componentClass) {
    Map<String, IEntityComponent> entityMap = entities.$get(id);
    entityMap.$delete(ClassUtil.getClassName(componentClass));
  }

  /**
   * Releases an entity. All connected {@link IEntityComponent} objects will be
   * detached, cached in a pool and reused with the next acquire call.
   * 
   * <strong>Be aware (!) </strong> that this manager will not pooling
   * {@link IEntityComponent} objects which extends the
   * {@link IFlyweightComponent} interface. It's suggested to leave at least one
   * entity connected to your object over the whole life time of the game. If
   * you release all connections to your {@link IFlyweightComponent} object then
   * it will be available for remove by the garbage collector.
   * 
   * @param id
   */
  public void releaseEntity(String id) {

    // TODO cache components
  }

  /**
   * CAUTION: expensive
   * 
   * @param lId
   * @return
   */
  public Array<IEntityComponent> getEntityComponents(String lId) {

    Map<String, IEntityComponent> componentMap = entities.$get(lId);
    if (componentMap == JSGlobal.undefined) {
      return null;
    }

    Array<String> componentKeys = JsUtil.objectKeys(componentMap);
    Array<IEntityComponent> components = JSCollections.$array();

    for (int i = 0; i < componentKeys.$length(); i++) {
      components.push(componentMap.$get(componentKeys.$get(i)));
    }

    return components;
  }

  public <T extends IEntityComponent> Array<String> getEntitiesWithComponentType(Class<T> clazz) {
    Array<String> resultEntities = JSCollections.$array();
    Array<String> entityNames = JsUtil.objectKeys(entities);
    for (int i = 0; i < entityNames.$length(); i++) {
      String entityName = entityNames.$get(i);
      if (getComponent(entityName, clazz) != null) {
        resultEntities.push(entityName);
      }
    }
    return resultEntities;
  }

  /**
   * Returns a component of an entity.
   * 
   * @param id
   *          id of the entity
   * @param lComponentClass
   *          class of the wanted component
   * @return component object or null
   */
  public <T extends IEntityComponent> T getComponent(String id, Class<T> lComponentClass) {

    Map<String, IEntityComponent> componentMap = entities.$get(id);
    if (componentMap == JSGlobal.undefined) {
      return null;
    }

    String componentName = ClassUtil.getClassName(lComponentClass);
    T component = (T) componentMap.$get(componentName);

    if (component == JSGlobal.undefined) {

      // we search also in the prototype if possible
      String proto = entityPrototypes.$get(id);
      return proto != JSGlobal.undefined ? getComponent(proto, lComponentClass) : null;

    } else {
      return component;
    }
  }

  public <T extends IEntityComponent> T getNonNullComponent(String lId, Class<T> lComponentClass) {
    T component;

    component = getComponent(lId, lComponentClass);
    if (component == null) {
      component = acquireEntityComponent(lId, lComponentClass);
    }
    return component;
  }

  public <T extends IEntityComponent> boolean hasEntityComponent(String lId, Class<T> lComponentClass) {
    return getComponent(lId, lComponentClass) != null;
  }

  /**
   * Creates a complete data dump of the internal entity data.
   * 
   * @param dataCallback
   */
  public void createEntityDataDump(Callback1<String> dataCallback) {
    createEntityDataDumpWithSelector(allSelector, dataCallback);
  }

  /**
   * Creates a data dump of the internal entity data. The result entities will
   * be selected by the given selector function.
   * 
   * @param selector
   *          (string) -> boolean => returns true when a given entityId should
   *          be added to the data dump else false
   * @param dataCallback
   */
  public void createEntityDataDumpWithSelector(Function1<String, Boolean> selector, Callback1<String> dataCallback) {

    Map<String, Object> data = JSObjectAdapter.$object(JSCollections.$map());

    Array<String> entityIds = JsUtil.objectKeys(entities);
    for (int i = 0; i < entityIds.$length(); i++) {
      String entityId = entityIds.$get(i);

      if (selector.$invoke(entityId)) {
        data.$put(entityId, entities.$get(entityId));
      }
    }

    dataCallback.$invoke(JSObjectAdapter.$js("JSON.stringify(data, null, 2)"));
  }

  public void setEntityPrototype(String entity, String prototype) {
    entityPrototypes.$put(entity, prototype);
  }
}
