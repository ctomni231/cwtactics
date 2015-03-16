package org.wolftec.cwtactics.game.logic;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.game.model.GameRoundBean;
import org.wolftec.cwtactics.game.model.Property;
import org.wolftec.cwtactics.game.model.Tile;
import org.wolftec.cwtactics.game.model.Unit;

@ManagedComponent public class RepairLogic {

  @Injected private GameRoundBean gameround;
  
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
  public boolean canPropertyRepairAt(int x, int y) {
    Tile tile = gameround.getTile(x, y);
    Unit unit = tile.unit;
    Property prop = tile.property;
    
    // TODO
    // if (prop != null && unit != null) {
    // if (prop.type.) {unit.type.getMoveType().ID
    // return true;
    // }
    // }
    return false;
  }
}
