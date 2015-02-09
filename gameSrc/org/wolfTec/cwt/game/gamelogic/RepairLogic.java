package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;

public interface RepairLogic extends BaseLogic {

  /**
   * Returns **true** if the property at the position (**x**,**y**) fulfills the
   * following requirements a) the property has a healing ability b) the
   * property is occupied by an unit of the same team c) the occupying unit can
   * be healed by the property
   * 
   * The value **false** will be returned if one of the requirements fails.
   * 
   * @param x
   * @param y
   * @return
   */
  default boolean canPropertyRepairAt(int x, int y) {
    Tile tile = getGameRound().getMap().getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;
    // TODO
    // if (prop != null && unit != null) {
    // if (prop.type.) {unit.type.getMoveType().ID
    // return true;
    // }
    // }
    return false;
  }
}
