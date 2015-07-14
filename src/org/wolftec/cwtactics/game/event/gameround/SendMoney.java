package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SendMoney extends SystemEvent {

  void onSendMoney(String source, String target, int amount);
}
