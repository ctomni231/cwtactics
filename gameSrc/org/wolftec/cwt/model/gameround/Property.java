package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.sheets.types.PropertyType;

public class Property {

  public final Ownable owners;

  public PropertyType type;

  public final Supplier<Property> supply;
  public final Visioner<Property> vision;
  public final Silo silo;
  public final Capturable capture;

  public final Position position;

  public Property() {
    supply = Specialization.constructSpecialization(Supplier.class, this);
    vision = Specialization.constructSpecialization(Visioner.class, this);
    silo = Specialization.constructSpecialization(Silo.class, this);
    capture = Specialization.constructSpecialization(Capturable.class, this);

    owners = new Ownable();
    position = new Position();
  }
}
