package org.wolftec.cwtactics.gameold.domain.model;

import org.wolftec.cwtactics.gameold.domain.types.PropertyType;

/**
 * A property is an capturable object on the game map which can be owned by a
 * player.
 */
public class Property implements PlayerOwnedObject {

  public int points;
  public Player owner;
  public PropertyType type;

}
