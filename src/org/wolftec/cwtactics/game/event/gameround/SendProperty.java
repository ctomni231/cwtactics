package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SendProperty extends SystemEvent {

  void onSendProperty(String property, String target);
}
