package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.gameround.objecttypes.UnitType;

public class Unit {

  public final Ownable owners;

  public int exp;
  public UnitType type;

  public final Living live;
  public final Transporter transport;
  public final Supplies supplies;
  public final Hidable hide;
  public final Usable usable;
  public final Position position;

  public Unit() {
    transport = new Transporter();
    live = new Living();
    hide = new Hidable();
    usable = new Usable();
    owners = new Ownable();
    position = new Position();
    supplies = new Supplies(this);
  }
}
