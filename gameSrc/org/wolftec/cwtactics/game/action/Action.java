package org.wolftec.cwtactics.game.action;

import org.wolftec.cwtactics.game.domain.model.Tile;

public interface Action {

  default boolean isEnabled(Tile source, TileData sourceMeta, Tile target, TileData targetMeta) {
    return false;
  }

  ActionType getActionType();

  abstract void invoke(ActionItem data);
}
