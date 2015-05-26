package org.wolftec.cwtactics.engine.event;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;

public class Observerable0 {

  private Array<Callback0> observers;

  public Observerable0() {
    observers = JSCollections.$array();
  }

  public void subscribe(Callback0 handler) {
    observers.push(handler);
  }

  public void unsubscribe(Callback0 handler) {
    while (true) {
      int index = observers.indexOf(handler);
      if (index == -1) {
        return;
      }
      observers.splice(index, 1);
    }
  }

  public void publish() {
    for (int i = 0; i < observers.$length(); i++) {
      observers.$get(i).$invoke();
    }
  }
}
