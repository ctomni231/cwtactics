package org.wolftec.cwtactics.engine.components;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwtactics.game.Constants;

/**
 * 
 * <strong>This class is dynamic, so if you are going to change things here then
 * be careful!</strong>
 */
public class ConstructedFactory {

  private static Map<String, Object> components;

  /**
   * Initializes all classes which extends the {@link ConstructedClass}
   * interface.
   */
  public static void initObjects() {
    components = JSCollections.$map();

    String namespace = Constants.NAMESPACE;

    Object objectConst = JSObjectAdapter.$get(Global.window, "Object");
    Function1<Map<String, Object>, Array<String>> objectPropertiesFn = (Function1<Map<String, Object>, Array<String>>) JSObjectAdapter
        .$get(objectConst, "keys");
    Map<String, Object> namespaceObj = (Map<String, Object>) JSObjectAdapter.$get(Global.window, namespace);
    Array<String> keys = objectPropertiesFn.$invoke(namespaceObj);

    for (int i = 0; i < keys.$length(); i++) {

      String objectName = keys.$get(i);
      Object object = JSObjectAdapter.$get(JSObjectAdapter.$get(Global.window, namespace), objectName);

      if (JSObjectAdapter.hasOwnProperty(object, "$typeDescription")) {

        JSObjectAdapter.$put(object, "__className", objectName);
        Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(object, "$inherit");
        if (interfaces.indexOf(ConstructedClass.class) != -1) {
          ConstructedClass cmp = JSObjectAdapter.$js("new object()");
          components.$put(objectName, cmp);
          cmp.onConstruction();
        }
      }
    }
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
    T value = (T) components.$get((String) JSObjectAdapter.$get(clazz, "__className"));
    if (JSGlobal.undefined == value) {
      JSGlobal.exception("IllegalArgumentException");
    }
    return value;
  }
}
