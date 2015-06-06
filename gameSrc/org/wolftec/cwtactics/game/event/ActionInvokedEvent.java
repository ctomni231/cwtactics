package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface ActionInvokedEvent extends IEvent {
  void onBuildUnit(String factory, String type);
}
