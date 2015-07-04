package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface TransporterEvents extends SystemEvent {

  default void onLoadUnit(String transporter, String load) {

  }

  default void onUnloadUnit(String transporter, String load, int atX, int atY) {

  }
}
