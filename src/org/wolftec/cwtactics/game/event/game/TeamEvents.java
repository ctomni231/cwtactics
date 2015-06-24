package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface TeamEvents extends IEvent {

  default void onSendMoney(String source, String target, int amount) {

  }

  default void onSendUnit(String unit, String target) {

  }

  default void onSendProperty(String property, String target) {

  }
}
