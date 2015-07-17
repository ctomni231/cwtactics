package org.wolftec.cwtactics.game.events.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadMap extends SystemEvent {
  public void onLoadMap(String entity, Object data);
}
