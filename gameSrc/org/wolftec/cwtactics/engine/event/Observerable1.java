package org.wolftec.cwtactics.engine.event;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;

public class Observerable1<A> {

  private Array<Callback1<A>> observers;

  public Observerable1() {
    observers = JSCollections.$array();
  }

  public void subscribe(Callback1<A> handler) {
    observers.push(handler);
  }

  public void unsubscribe(Callback1<A> handler) {
    while (true) {
      int index = observers.indexOf(handler);
      if (index == -1) {
        return;
      }
      observers.splice(index, 1);
    }
  }

  public void publish(A dataA) {
    for (int i = 0; i < observers.$length(); i++) {
      observers.$get(i).$invoke(dataA);
    }
  }
}
