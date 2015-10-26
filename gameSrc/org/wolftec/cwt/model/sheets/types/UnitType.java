package org.wolftec.cwt.model.sheets.types;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class UnitType extends SheetType {

  public int costs;
  public int range;
  public int vision;
  public int fuel;
  public int ammo;
  public int dailyFuelDrain;
  public int dailyFuelDrainHidden;
  public Array<String> canload;
  public String movetype;
  public SuicideType suicide;
  public AttackType attack;
  public int maxloads;
  public int captures; // TODO boolean
  public SupplierType supply;
  public boolean blocked;
  public LaserType laser;
  public boolean stealth;

  public UnitType() {
    supply = new SupplierType();
    attack = new AttackType();
    suicide = new SuicideType();
    laser = new LaserType();
    canload = JSCollections.$array();
  }
}
