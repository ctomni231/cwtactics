package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadPropertyType extends SystemEvent {
  void onLoadPropertyType(String entity, Object data);
}
