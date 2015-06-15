package org.wolftec.cwtactics.game.event.persistence;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.IEvent;

public interface MapLoadEvent extends IEvent {
  public void onMapLoad(Map<String, Object> data);
}
