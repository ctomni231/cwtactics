package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SendMoney extends SystemEvent {

  void onSendMoney(String source, String target, int amount);
}
