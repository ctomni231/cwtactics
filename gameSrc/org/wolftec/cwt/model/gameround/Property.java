package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.gameround.objecttypes.PropertyType;

public class Property {

  public PropertyType type;

  public final Ownable owners;
  public final Capturable capture;
  public final Position position;

  public Property() {
    capture = new Capturable();
    owners = new Ownable();
    position = new Position();
  }
}
