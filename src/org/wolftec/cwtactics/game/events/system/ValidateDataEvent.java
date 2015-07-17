package org.wolftec.cwtactics.game.events.system;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ValidateDataEvent extends SystemEvent {
  void onValidation();
}
