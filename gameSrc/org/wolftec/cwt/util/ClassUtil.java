package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.collection.ListUtil;

/**
 * Utility class to handle several low level stuff with stjs based objects.
 * 
 * FIXME
 */
public abstract class ClassUtil
{

  private static final String PARAM_INHERIT = "$inherit";
  private static final String PARAM_TYPE_DESCRIPTION = "$typeDescription";
  private static final String PROPERTY_CLASS_NAME = "__className__";

  /**
   * Initializes the class names by putting a special hidden variable into the
   * constructor as well into the class itself. After that the names of the
   * classes of the given namespace can be read with the getClassName(object)
   * method.
   * 
   * @param namespace
   */
  public static void initClassNames(Object namespace)
  {
    forEachClassOfNamespace(namespace, (className, constructor) ->
    {
      if (getClassName(constructor) == null)
      {
        JSObjectAdapter.$put(constructor, PROPERTY_CLASS_NAME, className);
        JSObjectAdapter.$put(JSObjectAdapter.$prototype(constructor), PROPERTY_CLASS_NAME, className);
      }
    });
  }

  /**
   * Calls the callback for each property of a object.
   * 
   * @param object
   * @param callback
   *          (object, propertyName)
   */
  public static void forEachComplexPropertyOfInstance(Object object, Callback2<String, Object> callback)
  {
    Map<String, ?> types = (Map<String, ?>) JSObjectAdapter.$get(JSObjectAdapter.$constructor(object),
                                                                 PARAM_TYPE_DESCRIPTION);

    ObjectUtil.forEachMapValue(types, (prop, typeData) ->
    {

      /*
       * Because STJS collects static class members in the type description
       * we're assume that all members with a upper case name are statics (which
       * is a common accepted pattern).
       */
      boolean isPossibleStaticProperty = prop.toUpperCase() == prop;

      if (!isPossibleStaticProperty)
      {
        callback.$invoke(prop, typeData);
      }
    });
  }

  /**
   * Calls the callback for each property of a given class.
   * 
   * @param clazz
   * @param callback
   *          (class, propertyName)
   */
  public static void forEachClassProperty(Class<?> clazz, Callback2<String, Object> callback)
  {
    ObjectUtil.forEachMapValue(JSObjectAdapter.$prototype(clazz), (prop, defValue) ->
    {

      /*
       * normal iteration through the class prototype object map will return the
       * default prototype property values, but we need to call the callback
       * with the actual object values
       */
      callback.$invoke(prop, JSObjectAdapter.$get(clazz, prop));
    });
  }

  public static String getClassName(Object object)
  {
    if (object == null || object == JSGlobal.undefined)
    {
      return null;
    }
    return (String) JSObjectAdapter.$get(object, PROPERTY_CLASS_NAME);
  }

  /**
   * 
   * @param object
   * @return the class of a given object
   */
  public static <T> Class<T> getClass(T object)
  {
    return (Class<T>) JSObjectAdapter.$constructor(object);
  }

  /**
   * 
   * @param clazz
   * @return a new instance of the given class
   */
  public static <T> T newInstance(Class<T> clazz)
  {
    return JSObjectAdapter.$js("new clazz()");
  }

  /**
   * Calls the callback for each interface of a given class object.
   * 
   * @param clazz
   * @param callback
   *          (interface)
   */
  public static void forEachInterface(Class<?> clazz, Callback1<Class<?>> callback)
  {
    ListUtil.forEachArrayValue((Array<Class<?>>) JSObjectAdapter.$get(clazz, PARAM_INHERIT), (index, interfaceObj) ->
    {
      callback.$invoke(interfaceObj);
    });
  }

  /**
   * Searches for the interface in a class hierarchy. At the moment the class
   * has to implement an interface which extends the interface in it's own
   * hierarchy to be recognized.
   * 
   * @param classObj
   *          class that will be checked
   * @return true when the class object is a constructed class, else false
   */
  public static boolean classImplementsInterface(Class<?> classObj, Class<?> interfaceObj)
  {
    if (JSObjectAdapter.hasOwnProperty(classObj, PARAM_TYPE_DESCRIPTION))
    {
      Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(classObj, PARAM_INHERIT);

      if (interfaces.indexOf(interfaceObj) != -1)
      {
        return true;
      }

      // if the constructed class isn't directly implemented, then check all
      // implemented interfaces, which may extends the constructed class
      // interface
      for (int i = 0; i < interfaces.$length(); i++)
      {
        Class<?> currentInterfaceObj = interfaces.$get(i);
        if (classImplementsInterface(currentInterfaceObj, interfaceObj))
        {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 
   * @param clazz
   * @param property
   * @return the type of the given property of the given class
   */
  public static void searchClassPropertyType(Class<?> clazz, String property, Callback1<Class<?>> foundCb,
      Callback0 notFoundCb)
  {
    Object classDesc = JSObjectAdapter.$get(clazz, PARAM_TYPE_DESCRIPTION);
    String typeName = ObjectUtil.getObjectProperty(classDesc, property);

    if (NullUtil.isPresent(typeName))
    {
      if (JSGlobal.typeof(typeName) != "string")
      {
        typeName = ObjectUtil.getObjectProperty(typeName, "name");
      }

      Array<String> namePieces = JSStringAdapter.split(typeName, ".");
      getTypeByNamespace(namePieces, foundCb, notFoundCb);

    }
    else
    {
      notFoundCb.$invoke();
    }
  }

  /**
   * Returns the type of a given property from a given class. This only works
   * with complex type properties (no primitives).
   * 
   * @param classObject
   * @param property
   * @return type of the given property
   */
  public static void searchClassPropertySubType(Class<?> classObject, String property, int genericTypeIndex,
      Callback1<Class<?>> foundCb, Callback0 notFoundCb)
  {
    Object classDesc = JSObjectAdapter.$get(classObject, PARAM_TYPE_DESCRIPTION);
    String typeName = ObjectUtil.getObjectProperty(classDesc, property);

    if (NullUtil.isPresent(typeName) || JSGlobal.typeof(typeName) == "string")
    {
      Array<String> generics = (Array<String>) JSObjectAdapter.$get(typeName, "arguments");
      String typeName2 = generics.$get(genericTypeIndex);
      if (JSGlobal.typeof(typeName2) == "string")
      {
        getTypeByNamespace(JSStringAdapter.split(typeName2, "."), foundCb, notFoundCb);

      }
      else
      {
        /* type is too complex -> not supported yet */
        notFoundCb.$invoke();
      }
    }
    else
    {
      notFoundCb.$invoke();
    }
  }

  /**
   * 
   * @param namePieces
   *          parts of a string based namespace (e.g. com.my.package.ClassA) as
   *          string array
   * @return class object
   */
  private static void getTypeByNamespace(Array<String> namePieces, Callback1<Class<?>> foundCb, Callback0 notFoundCb)
  {
    Object result = Global.window;

    for (int i = 0; i < namePieces.$length(); i++)
    {
      result = ObjectUtil.getObjectProperty(result, namePieces.$get(i));
      if (!NullUtil.isPresent(result))
      {
        notFoundCb.$invoke();
        return;
      }
    }

    foundCb.$invoke((Class<?>) result);
  }

  /**
   * Calls the callback for each stjs class in the given namespace.
   * 
   * @param namespace
   * @param callback
   *          (className, class)
   */
  public static void forEachClassOfNamespace(Object namespace, Callback2<String, Class<?>> callback)
  {
    ListUtil.forEachArrayValue(JsUtil.objectKeys(namespace), (index, className) ->
    {
      Class<?> classObject = (Class<?>) JSObjectAdapter.$get(namespace, className);
      if (NullUtil.isPresent(ObjectUtil.getObjectProperty(classObject, PARAM_TYPE_DESCRIPTION)))
      {
        callback.$invoke(className, classObject);
      }
    });
  }
}
