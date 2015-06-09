package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface ActionInvokedEvent extends IEvent {
  default void onBuildUnit(String factory, String type) {

  }

  default void onInvokeAction(String action, String pstr, int p1, int p2, int p3, int p4, int p5) {

  }
}
