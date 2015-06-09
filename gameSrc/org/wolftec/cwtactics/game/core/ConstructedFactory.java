package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.JsUtil;

/**
 * 
 * <strong>This class is dynamic, so if you are going to change things here then
 * be careful!</strong>
 */
public class ConstructedFactory {

  private static Map<String, ConstructedClass> instances;

  /**
   * Initializes all classes which extends the {@link ConstructedClass}
   * interface.
   */
  public static void initObjects() {
    instances = JSCollections.$map();

    Object namespace = JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);
    Array<String> classNames = JsUtil.objectKeys(namespace);

    JsUtil.forEachArrayValue(classNames, (index, className) -> {
      Object classObject = JSObjectAdapter.$get(namespace, className);

      setClassNameProperty(className, classObject);

      if (isConstructedClass((Class<?>) classObject)) {
        Global.console.log("CONSTRUCTING => " + className);
        ConstructedClass cmp = JSObjectAdapter.$js("new classObject()");
        instances.$put(className, cmp);
      }
    });

    injectDependencies(namespace);
    publischInitEvent();
  }

  private static void injectDependencies(Object namespace) {
    JsUtil.forEachMapValue(instances, (instanceName, instanceObject) -> {
      Class<?> instanceClass = (Class<?>) JSObjectAdapter.$get(namespace, instanceName);
      Map<String, Object> instanceDependencies = (Map<String, Object>) JSObjectAdapter.$get(instanceClass, "$typeDescription");

      JsUtil.forEachMapValue(instanceDependencies, (property, dependencyName) -> {
        if (JSGlobal.typeof(dependencyName) == "string") {
          String dependencyClassName = ((String) dependencyName).replace(Constants.NAMESPACE + ".", "");
          ConstructedClass dependency = instances.$get(dependencyClassName);

          // if the dependency is a constructed class, means it's collected in
          // the instances map, then inject it
          if (dependency != JSGlobal.undefined) {
            Global.console.log("INJECTING => " + dependencyClassName + " INTO " + instanceName);
            JSObjectAdapter.$put(instanceObject, property, dependency);
          }
        }
      });
    });
  }

  private static void publischInitEvent() {
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

  /**
   * Searches for the {@link ConstructedClass} interface in a class hierarchy.
   * At the moment the class has to implement an interface which extends the
   * {@link ConstructedClass} interface in it's own hierarchy to be recognized
   * as constructed class.
   * 
   * @param classObj
   *          class that will be checked
   * @return true when the class object is a constructed class, else false
   */
  private static boolean isConstructedClass(Class<?> classObj) {
    if (JSObjectAdapter.hasOwnProperty(classObj, "$typeDescription")) {
      Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(classObj, "$inherit");

      if (interfaces.indexOf(ConstructedClass.class) != -1) {
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
}
