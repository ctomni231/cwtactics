package org.wolftec.cwtactics.gameold.logic;

import org.wolftec.cwtactics.gameold.domain.model.GameManager;
import org.wolftec.cwtactics.gameold.domain.model.Player;
import org.wolftec.cwtactics.gameold.domain.model.PlayerOwnedObject;
import org.wolftec.cwtactics.gameold.domain.model.Tile;
import org.wolftec.cwtactics.gameold.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

/**
 *
 */
@Constructed
public class RelationshipCheck {

  @Injected
  private GameManager gameround;

  public enum CheckMode {

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
  public Relationship getRelationShipTo(Tile left, Tile right, CheckMode checkLeft,
      CheckMode checkRight) {

    PlayerOwnedObject oL = null;
    PlayerOwnedObject oR = null;

    if (checkLeft != CheckMode.CHECK_PROPERTY) {
      oL = left.unit;
    }
    if (checkRight != CheckMode.CHECK_PROPERTY) {
      oR = right.unit;
    }

    if (oL == null && checkLeft != CheckMode.CHECK_UNIT) {
      oL = left.property;
    }
    if (oR == null && checkRight != CheckMode.CHECK_UNIT) {
      oR = right.property;
    }

    if (oL == null) {
      return Relationship.RELATION_NONE;
    }

    return getRelationshipOfObjects(oL, oR);
  }

  /**
   * Extracts the relationship between objectA and objectB* and returns the
   * correct RELATION_{?} constant.
   *
   * @param objectA
   * @param objectB
   * @returns {*}
   */
  public Relationship getRelationshipOfObjects(PlayerOwnedObject objectA, PlayerOwnedObject objectB) {

    // one object is null
    if (objectA == null || objectB == null) {
      return Relationship.RELATION_NONE;
    }

    // same object
    if (objectA == objectB) {
      return Relationship.RELATION_SAME_THING;
    }

    return getRelationshipOfPlayers(gameround.getOwnerOfObject(objectA),
        gameround.getOwnerOfObject(objectB));
  }

  public Relationship getRelationshipOfPlayers(Player playerA, Player playerB) {

    // one object is null
    if (playerA == null || playerB == null) {
      return Relationship.RELATION_NONE;
    }

    // same object
    if (playerA == playerB) {
      return Relationship.RELATION_SAME_THING;
    }

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
      if (unit != null && getRelationshipOfPlayers(player, unit.owner) == relationship) {
        return true;
      }
    }

    // NORTH
    if (y > 0) {
      unit = gameround.getTile(x, y - 1).unit;
      if (unit != null && getRelationshipOfPlayers(player, unit.owner) == relationship) {
        return true;
      }
    }

    // EAST
    if (x < gameround.mapWidth - 1) {
      unit = gameround.getTile(x + 1, y).unit;
      if (unit != null && getRelationshipOfPlayers(player, unit.owner) == relationship) {
        return true;
      }
    }

    // SOUTH
    if (y < gameround.mapHeight - 1) {
      unit = gameround.getTile(x, y + 1).unit;
      if (unit != null && getRelationshipOfPlayers(player, unit.owner) == relationship) {
        return true;
      }
    }

    return false;
  }
}
