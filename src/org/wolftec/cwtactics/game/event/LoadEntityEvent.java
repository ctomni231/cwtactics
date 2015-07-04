package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface LoadEntityEvent extends IEvent {
  default void onLoadUnitTypeEntity(String entity, Object data) {
  }

  default void onLoadTileTypeEntity(String entity, Object data) {
  }

  default void onLoadPropertyTypeEntity(String entity, Object data) {
  }

  default void onLoadWeatherTypeEntity(String entity, Object data) {
  }

  default void onLoadMoveTypeEntity(String entity, Object data) {
  }

  default void onLoadCommanderTypeEntity(String entity, Object data) {
  }

  default void onLoadArmyTypeEntity(String entity, Object data) {
  }

  default void onLoadUnitEntity(String entity, Object data) {
  }

  default void onLoadMapEntity(String entity, Object data) {
  }

  default void onLoadedEntity(String entity, String entityType) {
  }
}
