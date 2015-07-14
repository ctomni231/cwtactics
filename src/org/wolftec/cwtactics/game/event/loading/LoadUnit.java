package org.wolftec.cwtactics.game.event.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadUnit extends SystemEvent {

  void onLoadUnit(String transporter, String load);
}
