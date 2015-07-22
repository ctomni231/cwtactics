package org.wolftec.cwtactics.game.core.sysevent;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.core.SystemInstanceHandler;
import org.wolftec.cwtactics.game.core.SystemPropertyHandler;
import org.wolftec.cwtactics.game.core.systems.System;

public class SystemEventsManager implements SystemPropertyHandler, SystemInstanceHandler, SharedEventCallHandler {

  private class ListenerHolder {

    public void emit(String method, Array<?> args) {
      for (int i = 0; i < listeners.$length(); i++) {
        Object listener = listeners.$get(i);
        JSFunctionAdapter.apply(JSObjectAdapter.$get(listener, method), listener, args);
      }
    };

    Array<Object> listeners;
  }

  private Map<String, ListenerHolder> events;
  private Map<String, Object>         emitters;
  private EventDistributor            eventDistributor;

  public SystemEventsManager() {
    events = JSCollections.$map();
  }

  @Override
  public void onSharedCall(String eventClass, String eventFunction, Array<?> args) {
    events.$get(eventClass).emit(eventFunction, JSObjectAdapter.$js("arguments"));
  }

  @Override
  public <T> T getSystemDepedency(System system, String propertyName, Class<?> propertyType) {
    T value = null;

    if (ClassUtil.classImplementsInterface(propertyType, SystemEvent.class)) {
      value = (T) getEventNode((Class<? extends SystemEvent>) propertyType);
    }

    return value;
  }

  @Override
  public void handleSystemInstance(System system) {
    if (ClassUtil.classImplementsInterface(ClassUtil.getClass(system), EventDistributor.class)) {
      if (eventDistributor != null) {
        JsUtil.throwError("AlredyRegisteredEventDistributor");
      }
      eventDistributor = (EventDistributor) system;
    }

    ClassUtil.forEachInterface(ClassUtil.getClass(system), (interfaceObj) -> {
      if (ClassUtil.classImplementsInterface(interfaceObj, SystemEvent.class)) {
        registerEventListener(system, (Class<? extends SystemEvent>) interfaceObj);
      }
    });
  }

  /**
   * 
   * @param eventClass
   *          event class
   * @return the event node for a given event class
   */
  public ListenerHolder getEventNode(Class<? extends SystemEvent> eventClass) {
    String eventName = ClassUtil.getClassName(eventClass);

    return CheckedValue.of(events.$get(eventName)).getOrElseByProvider(() -> {
      createEventNode(eventName, eventClass);
      return events.$get(eventName);
    });
  }

  public <T extends SystemEvent> T getEventNodeAsPublisher(Class<T> eventClass) {
    return (T) getEventNode(eventClass);
  }

  /**
   * Creates the event node for a given event class.
   * 
   * @param eventClass
   * @return event node
   */
  public void createEventNode(String eventName, Class<? extends SystemEvent> eventClass) {
    Object emitter = JSObjectAdapter.$js("{}");
    ListenerHolder event = JSObjectAdapter.$js("{}");
    event.listeners = JSCollections.$array();

    boolean shared = ClassUtil.classImplementsInterface(eventClass, SharedSystemEvent.class);
    ClassUtil.forEachClassProperty(eventClass, (prop, value) -> {
      if (prop.startsWith("__") || prop == "equals") {
        return;
      }

      createMethodHandler(eventName, event, emitter, prop, shared);
    });

    emitters.$put(eventName, emitter);
    events.$put(eventName, event);
  }

  /**
   * Registers a event publisher function for the given property in the
   * {@link ListenerHolder} object. The result publisher function will use the
   * {@link ListenerHolder} listeners as target.
   * 
   * @param event
   * @param emitter
   * @param prop
   * @param sharedEvent
   */
  private void createMethodHandler(String eventName, ListenerHolder event, Object emitter, String prop, boolean sharedEvent) {

    Callback eventInvoker;
    if (sharedEvent) {
      eventInvoker = (Callback0) () -> {
        eventDistributor.pushEventCall(eventName, prop, JSObjectAdapter.$js("arguments"));
        event.emit(prop, JSObjectAdapter.$js("arguments"));
      };

    } else {
      eventInvoker = (Callback0) () -> {
        event.emit(prop, JSObjectAdapter.$js("arguments"));
      };
    }

    JSObjectAdapter.$put(emitter, prop, eventInvoker);
  }

  /**
   * Registers a given listener object for a given event class.
   * 
   * @param listener
   * @param eventClass
   */
  public void registerEventListener(Object listener, Class<? extends SystemEvent> eventClass) {
    ListenerHolder eventNode = getEventNode(eventClass);
    eventNode.listeners.push(listener);
  }
}
