package org.wolftec.cwt.model.sheets.types;

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
  public AttackType    attack;
  public int           maxloads;
  public int           captures;
  public SupplierType  supply;
  public boolean       blocked;
  public boolean       stealth;

  public UnitType() {
    supply = new SupplierType();
    attack = new AttackType();
    suicide = new SuicideType();
  }
}
