package org.wolftec.cwt.model;

/**
 * Object that holds information about objects at a given position (x,y).
 */
public class PositionData {

  public int      x;
  public int      y;
  public Tile     tile     = null;
  public Unit     unit     = null;
  public Property property = null;
  public int      unitId;
  public int      propertyId;

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
  public void set(int px, int py) {
    this.clean();

    x = px;
    y = py;
    tile = exports.mapData[px][py];

    if (tile.visionTurnOwner > 0 && this.tile.unit) {
      this.unit = this.tile.unit;
      this.unitId = exports.units.indexOf(this.tile.unit);
    }

    if (tile.property) {
      property = tile.property;
      propertyId = exports.properties.indexOf(this.tile.property);
    }
  }
}
