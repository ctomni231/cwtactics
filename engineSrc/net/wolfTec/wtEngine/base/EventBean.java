package net.wolfTec.wtEngine.base;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback1;

@Namespace("wtEngine") public class EventBean {

  private Map<String, Array<Callback1<Object>>> eventMap;

  public EventBean() {
    eventMap = JSCollections.$map();
  }

  @SuppressWarnings("unchecked") public void subscribe(String signal, Callback1<Object> callback) {
    if (!JSObjectAdapter.hasOwnProperty(eventMap, signal)) {
      eventMap.$put(signal, JSCollections.$array());
    }
    eventMap.$get(signal).push(callback);
  }

  public void unsubscribe(String signal, Callback1<Object> callback) {
    if (JSObjectAdapter.hasOwnProperty(eventMap, signal)) {
      Array<Callback1<Object>> handlers = eventMap.$get(signal);

    }
  }

  public void unsubscribeAll(String signal) {
    if (JSObjectAdapter.hasOwnProperty(eventMap, signal)) {
      Array<Callback1<Object>> handlers = eventMap.$get(signal);
      handlers.splice(0);
    }
  }
  
  public void emit(String signal, Object argumentObj) {
    if (JSObjectAdapter.hasOwnProperty(eventMap, signal)) {
      Array<Callback1<Object>> handlers = eventMap.$get(signal);
      for (int i = 0, e = handlers.$length(); i < e; i++) {
        handlers.$get(i).$invoke(argumentObj);
      }
    }
  }
}
