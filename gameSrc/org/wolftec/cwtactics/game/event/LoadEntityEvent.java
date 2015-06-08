package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface LoadEntityEvent extends IEvent {
  default void onLoadEntity(String data, String entityType) {
  }

  default void onLoadedEntity(String entity, String type) {
  }
}
