package org.wolftec.cwtactics.util;

import java.lang.annotation.Annotation;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;

/**
 * Reflection utility to do useful stuff with classes and native JavaScript
 * objects.
 * 
 * <p>
 * <i>At all this should be the only class that interacts with js code directly.
 * If your code needs to be dynamic somewhere then use this class instead of
 * writing js code by using the {@link JSEU} class.</i>
 * </p>
 */
public abstract class RU {

  public static Map<String, Object> getGlobalOject(String lName) {
    return JSEU.injectJS("window[lName]");
  }

  /**
   * Creates an instance from a class object.
   * 
   * @param pClass
   * @return
   */
  public static <T> T createInstance(Class<T> pClass) {
    return JSEU.injectJS("new pClass()");
  }

  /**
   * 
   * @param pObject
   * @return the class object of the given object
   */
  public static Class<?> getClass(Object pObject) {
    return JSEU.injectJS("pObject.constructor");
  }

  /**
   * 
   * @param lName
   * @return
   */
  public static Class<?> getClassByName(String lName) {
    // TODO
    return null;
  }

  /**
   * 
   * @param pClass
   * @return true if the given object is a stjs class else false
   */
  public static boolean isClass(Object pClass) {
    return JSU.notUndef(getProperty(pClass, "$typeDescription"));
  }

  /**
   * 
   * @param pNamespace
   * @return a list of classes in the given namespace
   */
  public static Array<Class<?>> getClassesOfNamespace(String pNamespace) {
    Array<String> keys = objectKeys(JSEU.injectJS("pNamespace"));
    Array<Class<?>> classes = JSEU.injectJS("[]");

    for (int i = 0; i < keys.$length(); i++) {
      Class<?> clazz = JSEU.injectJS("window[pNamespace][pClass]");
      if (isClass(clazz)) {
        classes.push(clazz);
      }
    }

    return classes;
  }

  /**
   * <i>This method only works with classes from the registered namespaces of
   * the application.</i>
   * 
   * @param pObject
   *          object or class prototype
   * @return the simple name (without the namespace) of the given class
   */
  public static String getSimpleName(Object pObject) {
    return JSEU.injectJS("pObject.$className || pObject.constructor.$className");
  }

  /**
   * 
   * @param pObject
   * @param pProperty
   * @return Type of the property as name
   */
  public static String getPropertyTypeAsName(Object pObject, String pProperty) {
    Object type = JSEU.injectJS("pObject.constructor.$typeDescription[pProperty]");
    if (JSGlobal.typeof(type) != "string") {
      type = JSEU.injectJS("type.name");
    }

    return (String) type;
  }

  /**
   * 
   * @param pObject
   * @param pProperty
   * @return Type of the property as name
   */
  public static String getPropertyContainerTypeAsName(Object pObject, String pProperty) {
    Object type = JSEU.injectJS("pObject.constructor.$typeDescription[pProperty]");
    if (JSGlobal.typeof(type) == "string") {
      JSU.raiseError("PropertyIsNotAContainer");
    }

    return (getProperty(type, "name") == "Array" ? JSEU.injectJS("type.arguments[0]") : JSEU.injectJS("type.arguments[1]"));
  }

  /**
   * 
   * @param pClass
   * @param pProperty
   * @param pAnnotation
   * @return true if the property of the given class has the given annotation
   */
  public static boolean hasPropertyAnnotations(Class<?> pClass, String pProperty, Class<? extends Annotation> pAnnotation) {
    return JSGlobal.stjs.getMemberAnnotation(pClass, pProperty, getSimpleName(pAnnotation)) != null;
  }

  /**
   * 
   * @param pObject
   * @param pClass
   * @return true when the given object is an instance of the given class
   */
  public static boolean isInstanceOf(Object pObject, Class<?> pClass) {
    return JSEU.injectJS("pObject instanceof pClass");
  }

  /**
   * 
   * @param pObject
   * @return a list of property names that an object has
   */
  public static Array<String> objectKeys(Object pObject) {
    return JSEU.injectJS("Object.keys(pObject)");
  }

  /**
   * 
   * @param pObject
   * @param pProperty
   * @return true when object has the property as key in its property map
   */
  public static boolean hasProperty(Object pObject, String pProperty) {
    return JSEU.injectJS("pObject.hasOwnProperty(pProperty)");
  }

  /**
   * Sets the value as property in a given object.
   * 
   * @param pObject
   * @param pProperty
   * @param pValue
   */
  public static void setProperty(Object pObject, String pProperty, Object pValue) {
    JSEU.injectJS("pObject[pProperty] = pValue");
  }

  /**
   * 
   * @param pObject
   * @param pProperty
   * @return value of the property from object
   */
  public static <T> T getProperty(Object pObject, String pProperty) {
    return JSEU.injectJS("pObject[pProperty]");
  }

  /**
   * @param lNamespace
   * @param lAnnotation
   * @return all classes with the given annotations from the namespace
   */
  public static Array<Class<?>> getAnnotatedClasses(String lNamespace, Class<? extends Annotation> lAnnotation) {
    Array<Class<?>> lClasses = getClassesOfNamespace(lNamespace);
    Array<Class<?>> lFilteredClasses = JSEU.injectJS("[]");

    for (int i = 0; i < lClasses.$length(); i++) {
      if (JSGlobal.stjs.getTypeAnnotation(lClasses.$get(i), getSimpleName(lAnnotation)) != null) {
        lFilteredClasses.push(lClasses.$get(i));
      }
    }

    return lFilteredClasses;
  }

  /**
   * Returns an annotation from the class.
   * 
   * @param lClass
   * @param lAnnotation
   * @return null or the annotation object. All values of the annotation can be
   *         undefined due the restrictions of the stjs compiler.
   */
  public static <T extends Annotation> T getClassAnnotation(Class<?> lClass, Class<T> lAnnotation) {
    Map<String, Object> values = JSGlobal.stjs.getTypeAnnotation(lClass, getSimpleName(lAnnotation));
    // TODO not instanceOf safe yet
    return (T) values;
  }

  public static Array<Class<?>> getPropertyAnnotations(Class<?> clazz, String propertyName) {
    Map<String, Map<String, Map<String, Object>>> clazzAnnotations = JSGlobal.stjs.getAnnotations(clazz);
    // Map<String, Map<String, Object>> propAnnotations =
    // CU.filterFirstMapEntry(clazzAnnotations, (key, value) -> {
    // return (key == propertyName);
    // });

    return null; // TODO
  }
}
