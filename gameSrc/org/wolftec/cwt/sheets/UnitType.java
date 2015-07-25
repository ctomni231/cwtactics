package org.wolftec.cwt.sheets;

import org.stjs.javascript.Array;

public class UnitType extends SheetType {
  public int           costs;
  public int           range;
  public int           vision;
  public int           fuel;
  public int           ammo;
  public int           dailyFuelDrain;
  public int           dailyFuelDrainHidden;
  public Array<String> canload;
  public String        movetype;
  public SuicideType   suicide;
  public int           maxloads;
  public int           captures;
}
