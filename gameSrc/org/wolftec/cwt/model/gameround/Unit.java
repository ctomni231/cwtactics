package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.sheets.types.UnitType;

public class Unit {

  public final Ownable owners;

  public int exp;
  public UnitType type;

  public final Living live;
  public final Transporter transport;
  public final Cannon cannon;
  public final Supplier<Unit> supply;
  public final Supplies supplies;
  public final Hidable hide;
  public final Destroyable destroyable;
  public final Usable usable;

  public final Position position;

  public Unit() {
    cannon = Specialization.constructSpecialization(Cannon.class, this);
    transport = Specialization.constructSpecialization(Transporter.class, this);
    live = Specialization.constructSpecialization(Living.class, this);
    supply = Specialization.constructSpecialization(Supplier.class, this);
    supplies = Specialization.constructSpecialization(Supplies.class, this);
    destroyable = Specialization.constructSpecialization(Destroyable.class, this);

    hide = new Hidable();
    usable = new Usable();
    owners = new Ownable();
    position = new Position();
  }
}
