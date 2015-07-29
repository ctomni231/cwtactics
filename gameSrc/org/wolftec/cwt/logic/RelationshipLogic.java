package org.wolftec.cwt.logic;

import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Player;
import org.wolftec.cwt.model.Tile;
import org.wolftec.cwt.model.Unit;

public class RelationshipLogic {

  // Means two objects are the same object (so there is only one object).
  //
  public static final int RELATION_SAME_THING = -1;

  // Means there is no relationship between two objects.
  //
  public static final int RELATION_NEUTRAL    = 0;

  // Means two objects belongs to the same owner.
  //
  public static final int RELATION_OWN        = 1;

  // Means two objects belongs to the same team.
  //
  public static final int RELATION_ALLIED     = 2;

  // Means two objects belongs not to the same owner (they are enemies).
  //
  public static final int RELATION_ENEMY      = 3;

  // Means at least one of the two arguments is null.
  //
  public static final int RELATION_NONE       = 4;

  // Indicates a wish to check in the hierarchical way. First try to extract the
  // unit owner and then the property
  // owner when no unit exists.
  //
  public static final int CHECK_NORMAL        = 0;

  // Indicates a wish to check unit owner.
  //
  public static final int CHECK_UNIT          = 1;

  // Indicates a wish to check property owner.
  //
  public static final int CHECK_PROPERTY      = 2;

  private ModelManager    model;

  //
  // Extracts the relationship between the object **left** and the object
  // **right** and returns the correct
  // **RELATION_{?}** constant. The check mode can be set by **checkLeft** and
  // **checkRight**.
  //
  public int getRelationShipTo(Tile left, Tile right, int checkLeft, int checkRight) {
    Object oL = null;
    Object oR = null;

    if (checkLeft != CHECK_PROPERTY) oL = left.unit;
    if (checkRight != CHECK_PROPERTY) oR = right.unit;

    if (oL == null && checkLeft != CHECK_UNIT) oL = left.property;
    if (oR == null && checkRight != CHECK_UNIT) oR = right.property;

    if (oL == null) {
      return RELATION_NONE;
    }

    return getRelationship(oL, oR);
  }

  /**
   * Extracts the relationship between **objectA** and **objectB** and returns
   * the correct **RELATION_{?}** constant.
   * 
   * @param objectA
   * @param objectB
   * @return
   */
  public int getRelationship(Object objectA, Object objectB) {

    // one object is null
    if (objectA == null || objectB == null) {
      return RELATION_NONE;
    }

    // same object
    if (objectA == objectB) {
      return RELATION_SAME_THING;
    }

    Player playerA = (objectA instanceof Player) ? (Player) objectA : objectA.owner;
    Player playerB = (objectB instanceof Player) ? (Player) objectB : objectB.owner;

    // one of the owners is inactive or not set (e.g. neutral properties)
    if (playerA == null || playerB == null || playerA.team == -1 || playerB.team == -1) {
      return RELATION_NEUTRAL;
    }

    // same side
    if (playerA == playerB) {
      return RELATION_OWN;
    }

    // allied or enemy ?
    if (playerA.team == playerB.team) {
      return RELATION_ALLIED;
    } else {
      return RELATION_ENEMY;
    }
  }

  /**
   * 
   * @param player
   * @param x
   * @param y
   * @param relationship
   * @return **true **if there is at least one unit with a given
   *         **relationship** to **player** in one of the neighbors of a given
   *         position (**x**,**y**). If not, **false** will be returned.
   */
  public boolean hasUnitNeighbourWithRelationship(Player player, int x, int y, int relationship) {

    Unit unit;

    // WEST
    if (x > 0) {
      unit = model.getTile(x - 1, y).unit;
      if (unit != null && getRelationship(player, unit.owner) == relationship) return true;
    }

    // NORTH
    if (y > 0) {
      unit = model.getTile(x, y - 1).unit;
      if (unit != null && getRelationship(player, unit.owner) == relationship) return true;
    }

    // EAST
    if (x < model.mapWidth - 1) {
      unit = model.getTile(x + 1, y).unit;
      if (unit != null && getRelationship(player, unit.owner) == relationship) return true;
    }

    // SOUTH
    if (y < model.mapHeight - 1) {
      unit = model.getTile(x, y + 1).unit;
      if (unit != null && getRelationship(player, unit.owner) == relationship) return true;
    }

    return false;
  }
}
