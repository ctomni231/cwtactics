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
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.core.CESManager;
import org.wolftec.cwtactics.game.core.SystemEvent;
import org.wolftec.cwtactics.game.core.Log;

public class EventEmitter implements System {

  private Log log;
  private Object eventEmitter;
  private Map<String, Array<Object>> eventListeners;

  @Override
  public void onConstruction() {
    eventEmitter = JSObjectAdapter.$js("{}");
    eventListeners = JSCollections.$map();

    Object namespace = JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);
    createEventEmitter(namespace);
    registerSubriberSystems(namespace);
  }

  protected void createEventEmitter(Object namespace) {
    Array<String> classNames = JsUtil.objectKeys(namespace);

    for (int i = 0; i < classNames.$length(); i++) {
      String className = classNames.$get(i);
      Class<?> classObject = (Class<?>) JSObjectAdapter.$get(namespace, className);

      if (isEventClass(classObject)) {
        exploreClassEvents(classObject);
      }
    }
  }

  private void exploreClassEvents(Class<?> classObject) {
    Object classPrototype = JSObjectAdapter.$prototype(classObject);
    Array<String> classFunctions = JsUtil.objectKeys(classPrototype);
    JsUtil.forEachArrayValue(classFunctions, (index, classFnName) -> {
      if (!classFnName.startsWith("on")) return;

      if (JSObjectAdapter.hasOwnProperty(eventEmitter, classFnName)) {
        log.error("event function " + classFnName + " is already registered by an other event class");
      }

      JSObjectAdapter.$put(eventEmitter, classFnName, createEventEmitterCallback(classFnName));
      log.info("registered event emitter for " + classFnName);
    });
  }

  private boolean isEventClass(Class<?> classObject) {
    Array<Class<?>> inherits = (Array<Class<?>>) JSObjectAdapter.$get(classObject, "$inherit");
    return inherits.indexOf(SystemEvent.class) != -1;
  }

  protected Callback0 createEventEmitterCallback(String evName) {

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

  protected void registerSubriberSystems(Object namespace) {
    Array<String> classNames = JsUtil.objectKeys(namespace);

    for (int i = 0; i < classNames.$length(); i++) {
      String className = classNames.$get(i);
      checkClass(namespace, className);
    }
  }

  private void checkClass(Object namespace, String className) {
    Class<?> classObject = (Class<?>) JSObjectAdapter.$get(namespace, className);
    Object constructedInstance = CESManager.getObject(classObject);

    if (constructedInstance == null) {
      return;
    }

    Array<Class<?>> classInherits = (Array<Class<?>>) JSObjectAdapter.$get(classObject, "$inherit");
    for (int j = 0; j < classInherits.$length(); j++) {
      Class<?> possibleEventClass = classInherits.$get(j);
      if (isEventClass(possibleEventClass)) {
        exploreSubscriberClass(className, constructedInstance, possibleEventClass);
      }
    }
  }

  private void exploreSubscriberClass(String className, Object constructedInstance, Class<?> possibleEventClass) {
    Object classPrototype = JSObjectAdapter.$prototype(possibleEventClass);
    Array<String> classFunctions = JsUtil.objectKeys(classPrototype);
    JsUtil.forEachArrayValue(classFunctions, (index, classFnName) -> {
      if (!classFnName.startsWith("on")) return;

      if (eventListeners.$get(classFnName) == JSGlobal.undefined) {
        eventListeners.$put(classFnName, JSCollections.$array());
      }

      if (!JsUtil.isEmptyFunction(JSObjectAdapter.$get(constructedInstance, classFnName))) {
        eventListeners.$get(classFnName).push(constructedInstance);
        log.info("registered event listener " + className + " for " + classFnName);
      }
    });
  }

  public <T extends SystemEvent> T publish(Class<T> eventClass) {
    // eventEmitter implements all T's (of course if you don't doing something
    // low level with the IEvent classes)
    return (T) eventEmitter;
  }
}
