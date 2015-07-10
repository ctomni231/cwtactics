package org.wolftec.cwtactics.game.core.sysevent;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.core.SystemInstanceHandler;
import org.wolftec.cwtactics.game.core.SystemPropertyHandler;
import org.wolftec.cwtactics.game.core.systems.System;

public class SystemEventsManager implements SystemPropertyHandler, SystemInstanceHandler {

  @SyntheticType
  private class ListenerHolder {
    Array<Object> __listeners__;
  }

  private Map<String, ListenerHolder> events;

  public SystemEventsManager() {
    events = JSCollections.$map();
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
      ListenerHolder eventNode = createEventNode(eventClass);
      events.$put(eventName, eventNode);
      return eventNode;
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
  public ListenerHolder createEventNode(Class<? extends SystemEvent> eventClass) {
    ListenerHolder event = JSObjectAdapter.$js("{}");
    event.__listeners__ = JSCollections.$array();

    ClassUtil.forEachClassProperty(eventClass, (prop, value) -> {
      if (prop.startsWith("__") || prop == "equals") {
        return;
      }

      createMethodHandler(event, prop);
    });

    return event;
  }

  /**
   * Registers a event publisher function for the given property in the
   * {@link ListenerHolder} object. The result publisher function will use the
   * {@link ListenerHolder} listeners as target.
   * 
   * @param event
   *          object which holds all listeners for the given event
   * @param prop
   *          event name
   */
  private void createMethodHandler(final ListenerHolder event, String prop) {
    JSObjectAdapter.$put(event, prop, (Callback0) () -> {
      Array<?> arguments = JSObjectAdapter.$js("arguments");
      for (int i = 0; i < event.__listeners__.$length(); i++) {
        Object listener = event.__listeners__.$get(i);
        JSFunctionAdapter.apply(JSObjectAdapter.$get(listener, prop), listener, arguments);
      }
    });
  }

  /**
   * Registers a given listener object for a given event class.
   * 
   * @param listener
   * @param eventClass
   */
  public void registerEventListener(Object listener, Class<? extends SystemEvent> eventClass) {
    ListenerHolder eventNode = getEventNode(eventClass);
    eventNode.__listeners__.push(listener);
  }
}
