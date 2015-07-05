package org.wolftec.cwtactics.game.event.ui.action;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface RawInput extends SystemEvent {
  void onRawInput(String device, String type, int screenX, int screenY);
}
