package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;

/**
 * 
 * <strong>This class is dynamic, so if you are going to change things here then
 * be careful!</strong>
 */
public class ConstructedFactory {

  private static Log log;
  private static Map<String, System> instances;

  /**
   * Initializes all classes which extends the {@link System}
   * interface.
   */
  public static void initObjects(Array<String> forceConstructed) {
    log = new Log();
    JSObjectAdapter.$put(log, "loggerName", Log.convertNameToFixedLength("ConstructedFactory"));

    instances = JSCollections.$map();

    Object namespace = JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);

    createSingletons(namespace);
    createForcedSingletons(forceConstructed, namespace);
    injectDependencies(namespace);
    injectConstructedObjects(namespace);
    publishInitEvent();
  }

  private static void createForcedSingletons(Array<String> forceConstructed, Object namespace) {
    if (forceConstructed != null) {
      for (int i = 0; i < forceConstructed.$length(); i++) {
        String className = forceConstructed.$get(i);
        createConstructedInstance(namespace, className);
      }
    }
  }

  private static void createSingletons(Object namespace) {
    Array<String> classNames = JsUtil.objectKeys(namespace);
    JsUtil.forEachArrayValue(classNames, (index, className) -> {
      Object classObject = JSObjectAdapter.$get(namespace, className);

      setClassNameProperty(className, classObject);

      if (isConstructedClass((Class<?>) classObject) && !isDevBlockedAutomaticInstantiationClass((Class<?>) classObject)) {
        createConstructedInstance(namespace, className);
      }
    });
  }

  private static void createConstructedInstance(Object namespace, String className) {
    if (!JSObjectAdapter.hasOwnProperty(instances, className)) {
      log.info("constructing " + className);
      Object classObject = JSObjectAdapter.$get(namespace, className);
      System cmp = JSObjectAdapter.$js("new classObject()");
      instances.$put(className, cmp);
    }
  }

  private static void injectDependencies(Object namespace) {
    JsUtil.forEachMapValue(instances, (instanceName, instanceObject) -> {
      Class<?> instanceClass = (Class<?>) JSObjectAdapter.$get(namespace, instanceName);
      Map<String, Object> instanceDependencies = (Map<String, Object>) JSObjectAdapter.$get(instanceClass, "$typeDescription");

      JsUtil.forEachMapValue(instanceDependencies, (property, dependencyName) -> {
        if (JSGlobal.typeof(dependencyName) == "string") {
          String dependencyClassName = ((String) dependencyName).replace(Constants.NAMESPACE + ".", "");
          System dependency = instances.$get(dependencyClassName);

          // if the dependency is a constructed class, means it's collected in
          // the instances map, then inject it
          if (dependency != JSGlobal.undefined) {
            log.info("injecting " + dependencyClassName + " into " + instanceName + " instance");
            JSObjectAdapter.$put(instanceObject, property, dependency);
          }
        }
      });
    });
  }

  private static void injectConstructedObjects(Object namespace) {
    JsUtil.forEachMapValue(instances, (instanceName, instanceObject) -> {
      Class<?> instanceClass = (Class<?>) JSObjectAdapter.$get(namespace, instanceName);
      Map<String, Object> instanceDependencies = (Map<String, Object>) JSObjectAdapter.$get(instanceClass, "$typeDescription");
      checkClassConstructedProperties(namespace, instanceObject, instanceDependencies);
    });
  }

  private static void checkClassConstructedProperties(Object namespace, System instance, Map<String, Object> instanceDependencies) {
    JsUtil.forEachMapValue(instanceDependencies, (property, dependencyName) -> {
      if (JSGlobal.typeof(dependencyName) == "string") {
        String dependencyClassName = ((String) dependencyName).replace(Constants.NAMESPACE + ".", "");
        Class<?> dependencyClass = (Class<?>) JSObjectAdapter.$get(namespace, dependencyClassName);
        if (dependencyClass != JSGlobal.undefined && JSObjectAdapter.hasOwnProperty(dependencyClass, "$typeDescription")) {
          Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(dependencyClass, "$inherit");
          if (interfaces.indexOf(SystemObject.class) != -1) {
            log.info("creating object " + dependencyClassName + " as property " + property + " in " + ClassUtil.getClassName(instance) + " instance");
            SystemObject constructedObject = JSObjectAdapter.$js("new dependencyClass()");
            constructedObject.onConstruction(instance);
            JSObjectAdapter.$put(instance, property, constructedObject);
          }
        }
      }
    });
  }

  private static void publishInitEvent() {
    JsUtil.forEachMapValue(instances, (componentName, component) -> {
      component.onConstruction();
    });
  }

  private static void setClassNameProperty(String className, Object classObject) {
    if (JSObjectAdapter.hasOwnProperty(classObject, "$typeDescription")) {
      JSObjectAdapter.$put(classObject, "__className", className);
      JSObjectAdapter.$put(JSObjectAdapter.$prototype(classObject), "__className", className);
    }
  }

  private static boolean isDevBlockedAutomaticInstantiationClass(Class<?> classObj) {
    if (JSObjectAdapter.hasOwnProperty(classObj, "$typeDescription")) {
      Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(classObj, "$inherit");
      return interfaces.indexOf(DevBlockConstruction.class) != -1;
    }
    return false;
  }

  /**
   * Searches for the {@link System} interface in a class hierarchy.
   * At the moment the class has to implement an interface which extends the
   * {@link System} interface in it's own hierarchy to be recognized
   * as constructed class.
   * 
   * @param classObj
   *          class that will be checked
   * @return true when the class object is a constructed class, else false
   */
  private static boolean isConstructedClass(Class<?> classObj) {
    if (JSObjectAdapter.hasOwnProperty(classObj, "$typeDescription")) {
      Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(classObj, "$inherit");

      if (interfaces.indexOf(System.class) != -1) {
        return true;
      }

      // if the constructed class isn't directly implemented, then check all
      // implemented interfaces, which may extends the constructed class
      // interface
      for (int i = 0; i < interfaces.$length(); i++) {
        Class<?> interfaceObj = interfaces.$get(i);
        if (isConstructedClass(interfaceObj)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 
   * @param clazz
   * @return the instantiated object of the given class
   * @throws IllegalArgumentException
   *           when the given class is not registered as constructed class or
   *           when it's a member of a non supported namespace
   */
  public static <T> T getObject(Class<T> clazz) {
    T value = (T) instances.$get((String) JSObjectAdapter.$get(clazz, "__className"));
    if (JSGlobal.undefined == value) {
      return null;
    }
    return value;
  }

  public static <T> Array<T> getObjects(Class<T> clazz) {
    Array<T> result = JSCollections.$array();
    Array<String> instanceNames = JsUtil.objectKeys(instances);
    for (int i = 0; i < instanceNames.$length(); i++) {
      String instanceName = instanceNames.$get(i);
      System instance = instances.$get(instanceName);
      Object classObj = JSObjectAdapter.$constructor(instance);
      Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(classObj, "$inherit");

      if (interfaces.indexOf(clazz) != -1) {
        result.push((T) instance);
      }
    }
    return result;
  }
}
