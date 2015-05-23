package org.wolftec.cwtactics.engine.event;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback3;

public class Observerable3<A, B, C> {

  private Array<Callback3<A, B, C>> observers;

  public Observerable3() {
    observers = JSCollections.$array();
  }

  public void subscribe(Callback3<A, B, C> handler) {
    observers.push(handler);
  }

  public void unsubscribe(Callback3<A, B, C> handler) {
    while (true) {
      int index = observers.indexOf(handler);
      if (index == -1) {
        return;
      }
      observers.splice(index, 1);
    }
  }

  public void publish(A dataA, B dataB, C dataC) {
    for (int i = 0; i < observers.$length(); i++) {
      observers.$get(i).$invoke(dataA, dataB, dataC);
    }
  }
}
