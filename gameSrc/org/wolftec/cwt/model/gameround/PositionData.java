package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.annotations.OptionalField;

/**
 * Object that holds information about objects at a given position (x,y).
 */
public class PositionData
{

  public int x;
  public int y;

  @OptionalField public Tile tile = null;
  @OptionalField public Unit unit = null;
  @OptionalField public Property property = null;

  public int unitId;
  public int propertyId;

  public void clean()
  {
    this.x = -1;
    this.y = -1;
    this.tile = null;
    this.unit = null;
    this.property = null;
    this.unitId = -1;
    this.propertyId = -1;
  }
}
