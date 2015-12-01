package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.annotations.OptionalField;
import org.wolftec.cwt.model.gameround.objecttypes.FieldType;

public class Tile {

  public FieldType type;

  @OptionalField // TODO will be integer as reference to the real unit
  public Unit unit;

  @OptionalField // TODO will be integer as reference to the real prop
  public Property property;

  public int variant = 0;

  public final Visible data;

  public Tile() {
    this.type = null;
    this.unit = null;
    this.property = null;
    this.variant = 0;
    this.data = new Visible(0, 0);
  }

  public boolean isOccupied() {
    return unit != null;
  }

}
