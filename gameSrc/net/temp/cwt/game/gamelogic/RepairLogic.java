package net.temp.cwt.game.gamelogic;

import net.temp.cwt.game.gamemodel.bean.GameRoundBean;
import net.temp.cwt.game.gamemodel.model.Property;
import net.temp.cwt.game.gamemodel.model.Tile;
import net.temp.cwt.game.gamemodel.model.Unit;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;

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
