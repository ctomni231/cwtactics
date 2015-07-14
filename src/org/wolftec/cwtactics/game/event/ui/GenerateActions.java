package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface GenerateActions extends SystemEvent {
  void onGenerateActions(int x, int y);
}
