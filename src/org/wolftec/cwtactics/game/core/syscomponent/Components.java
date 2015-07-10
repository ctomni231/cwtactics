package org.wolftec.cwtactics.game.core.syscomponent;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class Components<T> {

  private Class<T>       componentClass;
  private Map<String, T> components;
  private Array<String>  entities;

  public Components(Class<T> clazz) {
    components = JSCollections.$map();
    entities = JSCollections.$array();
    componentClass = clazz;
  }

  /**
   * 
   * @param key
   * @return the component of the key.
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
   * @param forbidden
   * @return
   */
  public String getRandomEntity(Array<String> forbidden) {
    int randomIndex = NumberUtil.getRandomInt(entities.$length());
    int firstIndex = randomIndex;
    while (true) {
      String entity = entities.$get(randomIndex);

      // check next index entry when entity is in the forbidden entities array
      if (forbidden.indexOf(entity) != -1) {
        randomIndex++;
        if (randomIndex == entities.$length()) {
          randomIndex = 0;
        }

        // maybe it's no suitable element in the list -> throw error
        if (randomIndex == firstIndex) {
          return JsUtil.throwError("NoRandomEventPossible");
        }

        continue;
      }

      return entity;
    }
  }

  /**
   * 
   * @param key
   * @return true when the key has a component of this holder else false
   */
  public boolean has(String entity) {
    return (components.$get(entity) != JSGlobal.undefined);
  }

  /**
   * Acquires an object for a key.
   * 
   * @param entity
   * @return
   */
  public T acquire(String entity) {
    if (has(entity)) {
      return JsUtil.throwError("EntityAlreadyRegistered");
    }

    @SuppressWarnings("unused")
    Object clazz = componentClass;
    T instance = JSObjectAdapter.$js("new clazz()");

    components.$put(entity, instance);
    entities.push(entity);

    return instance;
  }

  /**
   * Acquires an object for a key and data.
   * 
   * @param entity
   * @return
   */
  public T acquireWithData(String entity, Object data) {
    return parseFromData(data, acquire(entity));
  }

  public boolean isComponentInRootData(Object data) {
    String componentClassName = ClassUtil.getClassName(componentClass);
    return CheckedValue.of((T) JSObjectAdapter.$get(data, componentClassName)).isPresent();
  }

  /**
   * Acquires an object for a key and data.
   * 
   * @param entity
   * @return
   */
  public T acquireWithRootData(String entity, Object data) {
    if (!isComponentInRootData(data)) {
      return JsUtil.throwError("ComponentIsntInData");
    }
    String componentClassName = ClassUtil.getClassName(componentClass);
    T component = CheckedValue.of((T) JSObjectAdapter.$get(data, componentClassName)).getOrElseByProvider(() -> JSObjectAdapter.$js("{}"));
    return acquireWithData(entity, component);
  }

  public T parseFromData(Object data, T component) {
    if (CheckedValue.of(component).isPresent()) {
      Object componentPrototype = JSObjectAdapter.$prototype(componentClass);
      Array<String> componentPrototypeProperties = JsUtil.objectKeys(componentPrototype);

      JsUtil.forEachArrayValue(componentPrototypeProperties, (index, property) -> {
        if (JSGlobal.typeof(JSObjectAdapter.$get(componentPrototype, property)) == "function") return;
        if (property.startsWith("__")) return;

        if (JSObjectAdapter.hasOwnProperty(data, property)) {
          JSObjectAdapter.$put(component, property, JSObjectAdapter.$get(data, property));
        }
      });
    }
    return component;
  }

  /**
   * Releases an object T of an key.
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
   * Searches the first matching key.
   * 
   * @param filter
   * @return the key that matches with the filter
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
   * Iterates through every key with a connected component of this holder.
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
