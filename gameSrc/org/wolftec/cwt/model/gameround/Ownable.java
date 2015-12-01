package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.annotations.OptionalParameter;
import org.wolftec.cwt.core.annotations.OptionalReturn;

public class Ownable {

  public static enum Relationship {
    ONE_BEING, SAME_OWNER, SAME_TEAM, DIFFERENT_TEAM, NO_REALTIONSHIP, NEUTRAL
  }

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

  // TODO Relationship(p1,p2) as class

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
