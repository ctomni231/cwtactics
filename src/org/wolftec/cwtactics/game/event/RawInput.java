package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface RawInput extends SystemEvent {
  void onRawInput(String device, int type, int screenX, int screenY);
}
