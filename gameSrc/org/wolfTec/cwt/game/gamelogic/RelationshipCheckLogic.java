package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Player;
import org.wolfTec.cwt.game.model.PlayerObject;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;

/**
 *
 */
@Bean
public class RelationshipCheckLogic {

  @Injected
  private GameRoundBean gameround;

  public enum RelationshipCheckMode {

    /**
     * Indicates a wish to check in the hierarchical way. First try to extract
     * the unit owner and then the property owner when no unit exists.
     */
    CHECK_NORMAL,

    /**
     * Indicates a wish to check unit owner.
     */
    CHECK_UNIT,

    /**
     * Indicates a wish to check property owner.
     */
    CHECK_PROPERTY
  }

  /**
   * Extracts the relationship between the object left and the object right and
   * returns the correct RELATION_{?} constant. The check mode can be set by
   * checkLeft and checkRight.
   *
   * @param left
   * @param right
   * @param checkLeft
   * @param checkRight
   * @returns {number}
   */
  public Relationship getRelationShipTo(Tile left, Tile right, RelationshipCheckMode checkLeft,
      RelationshipCheckMode checkRight) {
    Object oL = null;
    Object oR = null;

    if (checkLeft != RelationshipCheckMode.CHECK_PROPERTY) {
      oL = left.unit;
    }
    if (checkRight != RelationshipCheckMode.CHECK_PROPERTY) {
      oR = right.unit;
    }

    if (oL == null && checkLeft != RelationshipCheckMode.CHECK_UNIT) {
      oL = left.property;
    }
    if (oR == null && checkRight != RelationshipCheckMode.CHECK_UNIT) {
      oR = right.property;
    }

    if (oL == null) {
      return Relationship.RELATION_NONE;
    }

    return getRelationship(oL, oR);
  }

  /**
   * Extracts the relationship between objectA and objectB* and returns the
   * correct RELATION_{?} constant.
   *
   * @param objectA
   * @param objectB
   * @returns {*}
   */
  public Relationship getRelationship(Object objectA, Object objectB) {

    // one object is null
    if (objectA == null || objectB == null) {
      return Relationship.RELATION_NONE;
    }

    // same object
    if (objectA == objectB) {
      return Relationship.RELATION_SAME_THING;
    }

    Player playerA = (objectA instanceof Player) ? (Player) objectA : ((PlayerObject) objectA)
        .getOwner();
    Player playerB = (objectB instanceof Player) ? (Player) objectB : ((PlayerObject) objectB)
        .getOwner();

    // one of the owners is inactive or not set (e.g. neutral properties)
    if (playerA == null || playerB == null || playerA.team == -1 || playerB.team == -1) {
      return Relationship.RELATION_NEUTRAL;
    }

    // same side
    if (playerA == playerB) {
      return Relationship.RELATION_OWN;
    }

    // allied or enemy ?
    if (playerA.team == playerB.team) {
      return Relationship.RELATION_ALLIED;
    }

    return Relationship.RELATION_ENEMY;
  }

  /**
   * Returns true if there is at least one unit with a given relationship to
   * player in one of the neighbors of a given position (x,y). If not, false
   * will be returned.
   *
   * @param player
   * @param x
   * @param y
   * @param relationship
   * @returns {boolean}
   */
  public boolean hasUnitNeighbourWithRelationship(Player player, int x, int y,
      Relationship relationship) {
    Unit unit = null;

    // WEST
    if (x > 0) {
      unit = gameround.getTile(x - 1, y).unit;
      if (unit != null && getRelationship(player, unit.getOwner()) == relationship) {
        return true;
      }
    }

    // NORTH
    if (y > 0) {
      unit = gameround.getTile(x, y - 1).unit;
      if (unit != null && getRelationship(player, unit.getOwner()) == relationship) {
        return true;
      }
    }

    // EAST
    if (x < gameround.getMapWidth() - 1) {
      unit = gameround.getTile(x + 1, y).unit;
      if (unit != null && getRelationship(player, unit.getOwner()) == relationship) {
        return true;
      }
    }

    // SOUTH
    if (y < gameround.getMapHeight() - 1) {
      unit = gameround.getTile(x, y + 1).unit;
      if (unit != null && getRelationship(player, unit.getOwner()) == relationship) {
        return true;
      }
    }

    return false;
  }
}
