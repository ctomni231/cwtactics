package org.wolftec.cwt.model;

public class Tile {

  public String   type;
  public Unit     unit;
  public Property property;

  public int      variant         = 0;

  public int      visionTurnOwner = 0;
  public int      visionClient    = 0;

  public Tile() {
    this.type = null;
    this.unit = null;
    this.property = null;
    this.visionTurnOwner = 0;
    this.variant = 0;
    this.visionClient = 0;
  }

  public boolean isOccupied() {
    return unit != null;
  }

  public boolean isVisible() {
    return visionTurnOwner > 0;
  }

}
