package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback;
import org.wolftec.cwt.core.Injectable;

public class EventHandler implements Injectable {

  public static class EventChannel {

    Array<Callback> callbacks;

    EventChannel() {
      this.callbacks = JSCollections.$array();
    }

    public void subscribe(Callback callback) {
      this.callbacks.push(callback);
    }

    public void unsubscribe(Callback callback) {
      int index = this.callbacks.indexOf(callback);
      if (index == -1) {
        return;
      }

      this.callbacks.splice(index, 1);
    }

    public void unsubscribeAll() {
      this.callbacks.splice(0);
    }

    public void broadcast() {
      Array<?> args = JSObjectAdapter.$js("arguments");
      for (int i = 0, e = this.callbacks.$length(); i < e; i++) {
        JSFunctionAdapter.apply(this.callbacks.$get(i), null, args);
      }
    }
  }

  private Map<String, EventChannel> events;

  public EventHandler() {
    events = JSCollections.$map();
  }

  /**
   * Returns an {@link EventChannel} for a given event name.
   * 
   * @param event
   * @return
   */
  public EventChannel event(String event) {
    if (!Nullable.isPresent(events.$get(event))) {
      events.$put(event, new EventChannel());
    }

    return events.$get(event);
  }

  // Removes an **EventChannel** object with a given **event** name. All
  // handlers will be released.
  //
  public void removeEvent(String event) {
    if (Nullable.isPresent(events.$get(event))) {
      events.$get(event).unsubscribeAll();
      events.$delete(event);
    }
  }
}
