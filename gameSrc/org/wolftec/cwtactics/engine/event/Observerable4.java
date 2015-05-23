package org.wolftec.cwtactics.engine.event;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback4;

public class Observerable4<A, B, C, D> {

  private Array<Callback4<A, B, C, D>> observers;

  public Observerable4() {
    observers = JSCollections.$array();
  }

  public void subscribe(Callback4<A, B, C, D> handler) {
    observers.push(handler);
  }

  public void unsubscribe(Callback4<A, B, C, D> handler) {
    while (true) {
      int index = observers.indexOf(handler);
      if (index == -1) {
        return;
      }
      observers.splice(index, 1);
    }
  }

  public void publish(A dataA, B dataB, C dataC, D dataD) {
    for (int i = 0; i < observers.$length(); i++) {
      observers.$get(i).$invoke(dataA, dataB, dataC, dataD);
    }
  }
}
