package org.wolftec.cwtactics.gameold.action;

import org.wolftec.cwtactics.gameold.domain.model.Tile;

public interface Action {

  default boolean isEnabled(Tile source, TileData sourceMeta, Tile target, TileData targetMeta) {
    return false;
  }

  ActionType getActionType();

  abstract void invoke(ActionItem data);
}
