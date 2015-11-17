package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.annotations.OptionalParameter;
import org.wolftec.cwt.core.annotations.OptionalReturn;

public class Ownable {

  public static enum Relationship {
    ONE_BEING, SAME_OWNER, SAME_TEAM, DIFFERENT_TEAM, NO_REALTIONSHIP, NEUTRAL
  }

  /** Means two objects are the same object (so there is only one object). */
  @Deprecated public static final int RELATION_SAME_THING = -1;

  /** Means there is no relationship between two objects. */
  @Deprecated public static final int RELATION_NEUTRAL = 0;

  /** Means two objects belongs to the same owner. */
  @Deprecated public static final int RELATION_OWN = 1;

  /** Means two objects belongs to the same team. */
  @Deprecated public static final int RELATION_ALLIED = 2;

  /** Means two objects belongs not to the same owner (they are enemies). */
  @Deprecated public static final int RELATION_ENEMY = 3;

  /** Means at least one of the two arguments is null. */
  @Deprecated public static final int RELATION_NONE = 4;

  /**
   * Indicates a wish to check in the hierarchical way. First try to extract the
   * unit owner and then the property owner when no unit exists.
   */
  public static final int CHECK_NORMAL = 0;

  /** Indicates a wish to check unit owner. */
  public static final int CHECK_UNIT = 1;

  /** Indicates a wish to check property owner. */
  public static final int CHECK_PROPERTY = 2;

  private Player owner;

  @OptionalReturn
  public Player getOwner() {
    return owner;
  }

  public void setOwner(@OptionalParameter Player player) {
    owner = player;
  }

  /**
   * @return true, when the given property has no owner, else false.
   */
  public boolean isNeutral() {
    return owner == null;
  }

  public Relationship getRealtionshipTo(Ownable ownable) {
    /* same ownables means same object */
    if (this == ownable) {
      return Relationship.ONE_BEING;
    }
    return getRealtionshipToPlayer(ownable.owner);
  }

  public Relationship getRealtionshipToPlayer(Player player) {

    /* something/nothing to nothing means -> NONE */
    if (owner == null || player == null) {
      return Relationship.NO_REALTIONSHIP;
    }

    // TODO
    if (owner.team == -1 || player.team == -1) {
      return Relationship.NEUTRAL;
    }

    if (owner == player) {
      return Relationship.SAME_OWNER;
    }

    if (owner.team == player.team) {
      return Relationship.SAME_TEAM;
    }

    return Relationship.DIFFERENT_TEAM;
  }
}
