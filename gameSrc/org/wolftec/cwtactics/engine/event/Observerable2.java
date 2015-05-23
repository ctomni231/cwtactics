package org.wolftec.cwtactics.engine.event;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback2;

public class Observerable2<A, B> {

  private Array<Callback2<A, B>> observers;

  public Observerable2() {
    observers = JSCollections.$array();
  }

  public void subscribe(Callback2<A, B> handler) {
    observers.push(handler);
  }

  public void unsubscribe(Callback2<A, B> handler) {
    while (true) {
      int index = observers.indexOf(handler);
      if (index == -1) {
        return;
      }
      observers.splice(index, 1);
    }
  }

  public void publish(A dataA, B dataB) {
    for (int i = 0; i < observers.$length(); i++) {
      observers.$get(i).$invoke(dataA, dataB);
    }
  }
}
