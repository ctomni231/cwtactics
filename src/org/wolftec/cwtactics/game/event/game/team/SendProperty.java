package org.wolftec.cwtactics.game.event.game.team;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SendProperty extends SystemEvent {

  void onSendProperty(String property, String target);
}
