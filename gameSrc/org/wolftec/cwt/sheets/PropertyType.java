package org.wolftec.cwt.sheets;

import org.stjs.javascript.Array;

public class PropertyType extends SheetType {
  public int           defense;
  public int           capturePoints;
  public int           vision;
  public boolean       visionBlocker;
  public LaserType     laser;
  public SiloType      rocketsilo;
  public Array<String> builds;
  public boolean       looseAfterCaptured;
  public boolean       notTransferable;
}
