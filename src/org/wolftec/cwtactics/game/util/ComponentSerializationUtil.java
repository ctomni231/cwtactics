package org.wolftec.cwtactics.game.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.core.Component;

public class ComponentSerializationUtil {

  public static <T extends Component> T parseFromData(Object data, Class<T> componentClass) {
    String componentClassName = ClassUtil.getClassName(componentClass);
    if (!JSObjectAdapter.hasOwnProperty(data, componentClassName)) return null;

    Object componentData = JSObjectAdapter.$get(data, componentClassName);

    T component = JSObjectAdapter.$js("new componentClass()");
    Object componentPrototype = JSObjectAdapter.$prototype(componentClass);
    Array<String> componentPrototypeProperties = JsUtil.objectKeys(componentPrototype);

    JsUtil.forEachArrayValue(componentPrototypeProperties, (index, property) -> {
      if (JSGlobal.typeof(JSObjectAdapter.$get(componentPrototype, property)) == "function") return;
      if (property.startsWith("__")) return;

      if (JSObjectAdapter.hasOwnProperty(componentData, property)) {
        JSObjectAdapter.$put(component, property, JSObjectAdapter.$get(componentData, property));
      }
    });

    return component;
  }
}
