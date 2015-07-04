package org.wolftec.cwtactics.game.event.persistence;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.core.SystemEvent;

public interface MapLoadEvent extends SystemEvent {
  public void onMapLoad(Map<String, Object> data);
}
