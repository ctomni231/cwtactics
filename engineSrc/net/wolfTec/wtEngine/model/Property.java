package net.wolfTec.wtEngine.model;

/**
 * A property is an capturable object on the game map which can be owned by a
 * player.
 */
public class Property implements PlayerObject {

  public int points;
  public Player owner;
  public PropertyType type;

  @Override public Player getOwner() {
    return owner;
  }

}
