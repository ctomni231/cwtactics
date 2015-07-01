package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class ComponentHolder<T> {

  private Class<T> constructor;
  private Map<String, T> components;
  private Array<String> entities;

  public ComponentHolder(Class<T> pConstructor) {
    components = JSCollections.$map();
    entities = JSCollections.$array();
    constructor = pConstructor;
  }

  /**
   * 
   * @param entity
   * @return the component of the entity.
   */
  public T get(String entity) {
    Object component = components.$get(entity);
    if (component != JSGlobal.undefined) {
      return (T) component;
    }
    return JsUtil.throwError("UnknownEntity");
  }

  /**
   * 
   * @param entity
   * @return true when the entity has a component of this holder else false
   */
  public boolean has(String entity) {
    return (components.$get(entity) != JSGlobal.undefined);
  }

  /**
   * Acquires a component for an entity.
   * 
   * @param entity
   * @return
   */
  public T acquire(String entity) {
    if (has(entity)) {
      return JsUtil.throwError("EntityAlreadyRegistered");
    }

    @SuppressWarnings("unused") Object clazz = constructor;
    T instance = JSObjectAdapter.$js("new clazz()");

    components.$put(entity, instance);
    entities.push(entity);

    return instance;
  }

  /**
   * Releases a component of an entity.
   * 
   * @param entity
   * @return
   */
  public boolean release(String entity) {
    // TODO implement cache

    components.$delete(entity);
    entities.splice(entities.indexOf(entity), 1);

    return true;
  }

  /**
   * Searches the first matching entity.
   * 
   * @param filter
   * @return the entity that matches with the filter
   */
  public String find(Function2<String, T, Boolean> filter) {
    for (int i = 0; i < entities.$length(); i++) {
      String key = entities.$get(i);
      if (filter.$invoke(key, components.$get(key))) {
        return key;
      }
    }
    return JsUtil.throwError("NoMatchFound");
  }

  /**
   * Iterates through every entity with a connected component of this holder.
   * 
   * @param callback
   */
  public void each(Callback2<String, T> callback) {
    for (int i = 0; i < entities.$length(); i++) {
      String key = entities.$get(i);
      callback.$invoke(key, components.$get(key));
    }
  }
}
