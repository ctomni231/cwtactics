package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.Option;
import org.wolftec.cwt.core.annotations.OptionalField;

/**
 * Object that holds information about objects at a given position (x,y).
 */
public class PositionData {

  public int  x;
  public int  y;
  public Tile tile = null;

  @OptionalField
  public Option<Unit> unit = null;

  @OptionalField
  public Option<Property> property = null;

  public int unitId;
  public int propertyId;

  public PositionData() {
    clean();
  }

  //
  // Cleans all data of the object.
  //
  public void clean() {
    this.x = -1;
    this.y = -1;
    this.tile = null;
    this.unit = null;
    this.property = null;
    this.unitId = -1;
    this.propertyId = -1;
  }

  //
  // Grabs the data from another position object.
  //
  public void grab(PositionData otherPos) {
    this.x = otherPos.x;
    this.y = otherPos.y;
    this.tile = otherPos.tile;
    this.unit = otherPos.unit;
    this.unitId = otherPos.unitId;
    this.property = otherPos.property;
    this.propertyId = otherPos.propertyId;
  }

  /**
   * Sets a position.
   * 
   * @param px
   * @param py
   */
  public void set(ModelManager manager, int px, int py) {
    this.clean();

    x = px;
    y = py;
    tile = manager.getTile(x, y);

    if (tile.visionTurnOwner > 0 && tile.unit != null) {
      unit = Option.of(tile.unit);
      unitId = manager.getUnitId(tile.unit);
    } else {
      unit = Option.empty();
    }

    if (tile.property != null) {
      property = Option.of(tile.property);
      propertyId = manager.getPropertyId(tile.property);
    } else {
      property = Option.empty();
    }
  }
}
