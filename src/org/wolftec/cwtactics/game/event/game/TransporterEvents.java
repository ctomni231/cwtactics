package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.IEvent;

public interface TransporterEvents extends IEvent {

  default void onLoadUnit(String transporter, String load) {

  }

  default void onUnloadUnit(String transporter, String load, int atX, int atY) {

  }
}
