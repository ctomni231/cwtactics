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
    Map<String, IEntityComponent> entityMap = entities.$get(id);
    T component = JSObjectAdapter.$js("new componentClass()");
    entityMap.$put(ClassUtil.getClassName(component), component);
    return component;
  }

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
