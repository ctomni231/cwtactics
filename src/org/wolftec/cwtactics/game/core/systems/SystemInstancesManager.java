package org.wolftec.cwtactics.game.core.systems;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.core.SystemPropertyHandler;

public class SystemInstancesManager implements SystemPropertyHandler {

  private Map<String, System> instances;

  public SystemInstancesManager() {
    instances = JSCollections.$map();
  }

  public void manageNamespace(Object namespace) {
    ClassUtil.forEachClassOfNamespace(namespace, (className, classObject) -> {
      boolean isSystem = ClassUtil.classImplementsInterface(classObject, System.class);

      if (isSystem) {
        if (CheckedValue.of(instances.$get(className)).isPresent()) {
          JsUtil.throwError("SystemAlreadyConstructed: " + className);
        }

        System cmp = JSObjectAdapter.$js("new classObject()");
        instances.$put(className, cmp);
      }
    });
  }

  @Override
  public <T> T getSystemDepedency(System system, String propertyName, Class<?> propertyType) {
    if (ClassUtil.classImplementsInterface(propertyType, System.class)) {
      return (T) instances.$get(ClassUtil.getClassName(propertyType));
    }
    return null;
  }

  /**
   * @param systemName
   * @return the system with a given name
   * @throws UnknownSystem
   *           when the system does not exists
   */
  public <T extends System> T get(String systemName) {
    T system = (T) instances.$get(systemName);
    if (!CheckedValue.of(system).isPresent()) {
      return JsUtil.throwError("UnknownSystem: " + systemName);
    }
    return system;
  }

  /**
   * Calls the callback with every registered system.
   * 
   * @param callback
   */
  public void forEach(Callback2<String, System> callback) {
    JsUtil.forEachMapValue(instances, (name, instance) -> {
      callback.$invoke(name, instance);
    });
  }
}
