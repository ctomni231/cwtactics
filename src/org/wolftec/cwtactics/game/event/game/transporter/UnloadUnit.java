package org.wolftec.cwtactics.game.event.game.transporter;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnloadUnit extends SystemEvent {

  void onUnloadUnit(String transporter, String load, int atX, int atY);
}
