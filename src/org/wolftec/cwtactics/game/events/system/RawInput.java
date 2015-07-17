package org.wolftec.cwtactics.game.events.system;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface RawInput extends SystemEvent {
  void onRawInput(String device, int type, int screenX, int screenY);
}
