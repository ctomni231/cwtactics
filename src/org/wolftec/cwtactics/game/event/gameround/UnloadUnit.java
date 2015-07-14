package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnloadUnit extends SystemEvent {

  void onUnloadUnit(String transporter, String load, int atX, int atY);
}
