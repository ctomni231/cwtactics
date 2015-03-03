package org.wolfTec.cwt.game.gamemodel.model;


public class Tile {

  public Unit unit;
  public Property property;
  public TileType type;

  public int visionTurnOwner = 0;
  public int variant = 0;
  public int visionClient = 0;

  /**
   *
   * @return true if the property is occupied, else false
   */
  public boolean isOccupied() {
    return this.unit != null;
  }

  /**
   * 
   * @return returns true when the turn owner can see this tile.
   */
  public boolean isVisible() {
    return this.visionTurnOwner > 0;
  }

  /**
   * 
   * @return returns true when the turn owner can see this tile.
   */
  public boolean isClientVisible() {
    return this.visionClient > 0;
  }
}
