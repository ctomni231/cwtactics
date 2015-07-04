package org.wolftec.cwtactics.game.event.game.transporter;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadUnit extends SystemEvent {

  void onLoadUnit(String transporter, String load);
}
