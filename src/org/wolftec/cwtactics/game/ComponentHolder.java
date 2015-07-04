package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class ComponentHolder<T> implements KeyMap<T>, InstancePool<T> {

  private Class<T> constructor;
  private Map<String, T> components;
  private Array<String> entities;

  public ComponentHolder(Class<T> pConstructor) {
    components = JSCollections.$map();
    entities = JSCollections.$array();
    constructor = pConstructor;
  }

  @Override
  public T get(String entity) {
    Object component = components.$get(entity);
    if (component != JSGlobal.undefined) {
      return (T) component;
    }
    return JsUtil.throwError("UnknownEntity");
  }

  @Override
  public boolean has(String entity) {
    return (components.$get(entity) != JSGlobal.undefined);
  }

  /* (non-Javadoc)
   * @see org.wolftec.cwtactics.game.InstancePool#acquire(java.lang.String)
   */
  @Override
  public T acquire(String entity) {
    if (has(entity)) {
      return JsUtil.throwError("EntityAlreadyRegistered");
    }

    @SuppressWarnings("unused")
    Object clazz = constructor;
    T instance = JSObjectAdapter.$js("new clazz()");

    components.$put(entity, instance);
    entities.push(entity);

    return instance;
  }

  /* (non-Javadoc)
   * @see org.wolftec.cwtactics.game.InstancePool#release(java.lang.String)
   */
  @Override
  public boolean release(String entity) {
    // TODO implement cache

    components.$delete(entity);
    entities.splice(entities.indexOf(entity), 1);

    return true;
  }

  @Override
  public String find(Function2<String, T, Boolean> filter) {
    for (int i = 0; i < entities.$length(); i++) {
      String key = entities.$get(i);
      if (filter.$invoke(key, components.$get(key))) {
        return key;
      }
    }
    return JsUtil.throwError("NoMatchFound");
  }

  @Override
  public void each(Callback2<String, T> callback) {
    for (int i = 0; i < entities.$length(); i++) {
      String key = entities.$get(i);
      callback.$invoke(key, components.$get(key));
    }
  }
}
