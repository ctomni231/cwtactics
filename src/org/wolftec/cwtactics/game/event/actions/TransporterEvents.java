package org.wolftec.cwtactics.game.event.actions;

import org.wolftec.cwtactics.game.IEvent;

public interface TransporterEvents extends IEvent {

  default void onLoadUnit(String transporter, String load) {

  }

  default void onUnloadUnit(String transporter, String load, int atX, int atY) {

  }
}
