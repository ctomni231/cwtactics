package org.wolftec.cwt.sheets;

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
}
