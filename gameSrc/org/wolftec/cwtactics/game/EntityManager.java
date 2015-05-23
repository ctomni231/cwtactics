package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.IFlyweightComponent;

public class EntityManager implements ConstructedClass {

  // TODO cache old entity arrays ?

  private Map<String, Map<String, IEntityComponent>> entities;
  private int entityIdCounter;

  public EntityManager() {
    entityIdCounter = 0;
    entities = JSCollections.$map();
  }

  public String acquireEntity() {
    entityIdCounter++;
    return acquireEntityWithId("E" + (entityIdCounter - 1));
  }

  public String acquireEntityWithId(String id) {
    entities.$put(id, JSCollections.$map());
    return id;
  }

  public <T extends IEntityComponent> T acquireEntityComponent(String id, Class<T> componentClass) {
    // TODO cache components
    return attachEntityComponent(id, JSObjectAdapter.$js("new componentClass()"));
  }

  public <T extends IEntityComponent> T attachEntityComponent(String id, T component) {
    Map<String, IEntityComponent> entityMap = entities.$get(id);
    entityMap.$put(ClassUtil.getClassName(component), component);
    return component;
  }

  public <T extends IEntityComponent> void detachEntityComponent(String id, T component) {
    Map<String, IEntityComponent> entityMap = entities.$get(id);
    entityMap.$delete(ClassUtil.getClassName(component));
  }

  public <T extends IEntityComponent> void detachEntityComponent(String id, Class<T> componentClass) {
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
    Array<String> componentKeys = JsUtil.objectKeys(componentMap);
    Array<IEntityComponent> components = JSCollections.$array();

    for (int i = 0; i < componentKeys.$length(); i++) {
      components.push(componentMap.$get(componentKeys.$get(i)));
    }

    return components;
  }

  /**
   * Returns a component of an entity.
   * 
   * @param lId
   *          id of the entity
   * @param lComponentClass
   *          class of the wanted component
   * @return component object or null
   */
  public <T extends IEntityComponent> T getEntityComponent(String lId, Class<T> lComponentClass) {

    Map<String, IEntityComponent> componentMap = entities.$get(lId);
    String componentName = ClassUtil.getClassName(lComponentClass);
    T component = (T) componentMap.$get(componentName);

    return component == JSGlobal.undefined ? null : component;
  }

  public <T extends IEntityComponent> boolean hasEntityComponent(String lId, Class<T> lComponentClass) {
    return getEntityComponent(lId, lComponentClass) != null;
  }

  /**
   * Creates a complete data dump of the entity data.
   * 
   * @param dataCallback
   */
  public void createEntityDataDump(Callback1<String> dataCallback) {
    Map<String, Object> data = JSObjectAdapter.$object(JSCollections.$map());
    data.$put("entityData", entities);
    data.$put("counter", entityIdCounter);

    dataCallback.$invoke(JSGlobal.JSON.stringify(data));
  }
}
