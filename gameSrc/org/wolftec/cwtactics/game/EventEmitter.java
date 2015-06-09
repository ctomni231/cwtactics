package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.ConstructedFactory;
import org.wolftec.cwtactics.game.core.Log;

public class EventEmitter implements ConstructedClass {

  private Log log;
  private Object eventEmitter;
  private Map<String, Array<Object>> eventListeners;

  @Override
  public void onConstruction() {
    eventEmitter = JSObjectAdapter.$js("{}");
    eventListeners = JSCollections.$map();

    createEventEmitter();
    registerSubriberSystems();
  }

  private void createEventEmitter() {
    Object namespace = JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);
    Array<String> classNames = JsUtil.objectKeys(namespace);

    for (int i = 0; i < classNames.$length(); i++) {
      String className = classNames.$get(i);
      Class<?> classObject = (Class<?>) JSObjectAdapter.$get(namespace, className);

      if (isEventClass(classObject)) {
        Object classPrototype = JSObjectAdapter.$prototype(classObject);
        Array<String> classFunctions = JsUtil.objectKeys(classPrototype);
        JsUtil.forEachArrayValue(classFunctions, (index, classFnName) -> {
          if (!classFnName.startsWith("on")) return;

          if (JSObjectAdapter.hasOwnProperty(eventEmitter, classFnName)) {
            log.error("event function " + classFnName + " is already registered by an other event class");
            // TODO solve that drawback by having an emitter object for every
            // event class
          }

          JSObjectAdapter.$put(eventEmitter, classFnName, createEventEmitterCallback(classFnName));

          log.info("registered event emitter for " + classFnName);
        });
      }
    }
  }

  private boolean isEventClass(Class<?> classObject) {
    Array<Class<?>> inherits = (Array<Class<?>>) JSObjectAdapter.$get(classObject, "$inherit");
    return inherits.indexOf(IEvent.class) != -1;
  }

  private Callback0 createEventEmitterCallback(String evName) {

    // we place eventListeners here to prevent the binding of the result
    // function because else we had to use this.
    Map<String, Array<Object>> eventListeners = this.eventListeners;

    return () -> {
      Array<Object> listeners = eventListeners.$get(evName);
      for (int i = 0; i < listeners.$length(); i++) {
        Object listener = listeners.$get(i);
        JSFunctionAdapter.apply(JSObjectAdapter.$get(listener, evName), listener, JSObjectAdapter.$js("arguments"));
      }
    };
  }

  private void registerSubriberSystems() {
    Object namespace = JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);
    Array<String> classNames = JsUtil.objectKeys(namespace);

    for (int i = 0; i < classNames.$length(); i++) {
      String className = classNames.$get(i);
      checkClass(namespace, className);
    }
  }

  private void checkClass(Object namespace, String className) {
    Class<?> classObject = (Class<?>) JSObjectAdapter.$get(namespace, className);
    Object constructedInstance = ConstructedFactory.getObject(classObject);

    if (constructedInstance == null) {
      return;
    }

    Array<Class<?>> classInherits = (Array<Class<?>>) JSObjectAdapter.$get(classObject, "$inherit");
    for (int j = 0; j < classInherits.$length(); j++) {
      Class<?> possibleEventClass = classInherits.$get(j);
      if (isEventClass(possibleEventClass)) {
        Object classPrototype = JSObjectAdapter.$prototype(possibleEventClass);
        Array<String> classFunctions = JsUtil.objectKeys(classPrototype);
        JsUtil.forEachArrayValue(classFunctions, (index, classFnName) -> {
          if (!classFnName.startsWith("on")) return;

          if (eventListeners.$get(classFnName) == JSGlobal.undefined) {
            eventListeners.$put(classFnName, JSCollections.$array());
          }

          eventListeners.$get(classFnName).push(constructedInstance);

          log.info("registered event listener " + className + " for " + classFnName);
        });
      }
    }
  }

  public <T extends IEvent> T getEventEmitter() {
    return (T) eventEmitter;
  }
}
