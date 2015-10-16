package org.wolftec.cwt.model.sheets.types;

import org.stjs.javascript.Array;

/**
 * 
 *
 */
public class PropertyType extends TileType {
  public int           capturePoints;
  public int           vision;
  public int           funds;
  public LaserType     laser;
  public CannonType    cannon;
  public SiloType      rocketsilo;
  public Array<String> builds;
  public Array<String> repairs;
  public int           repairAmount;
  public boolean       looseAfterCaptured;
  public boolean       notTransferable;
  public String        changeAfterCaptured;

  public PropertyType() {
    laser = new LaserType();
    cannon = new CannonType();
    rocketsilo = new SiloType();
  }
}
