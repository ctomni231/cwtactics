package org.wolftec.cwtactics.game.event.game.team;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SendMoney extends SystemEvent {

  void onSendMoney(String source, String target, int amount);
}
