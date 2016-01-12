package org.wolftec.cwt.model.sheets.types;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

/**
 * 
 *
 */
public class PropertyType extends TileType
{
  public boolean       capturable;
  public int           vision;
  public int           funds;
  public CannonType    cannon;
  public SiloType      rocketsilo;
  public Array<String> builds;
  public Array<String> repairs;
  public int           repairAmount;
  public boolean       looseAfterCaptured;
  public boolean       notTransferable;
  public String        changeAfterCaptured;

  public PropertyType()
  {
    cannon = new CannonType();
    rocketsilo = new SiloType();
    builds = JSCollections.$array();
    repairs = JSCollections.$array();
  }
}
