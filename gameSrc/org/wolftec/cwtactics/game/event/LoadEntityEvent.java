package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface LoadEntityEvent extends IEvent {

  public final String TYPE_UNIT = "UNIT";

  public final String TYPE_UNIT_DATA = "UNIT_TYPE";
  public final String TYPE_PROPERTY_DATA = "PROPERTY_TYPE";
  public final String TYPE_WEATHER_DATA = "WEATHER_TYPE";

  default void onLoadEntity(String entity, String entityType, Object data) {
  }

  default void onLoadedEntity(String entity, String type) {
  }
}
