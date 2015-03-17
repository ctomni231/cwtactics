package org.wolftec.cwtactics.game.model;

import org.wolftec.core.ManagedComponent;
import org.wolftec.persistence.DataTypeConverter;

@ManagedComponent
public class MapFileTypeConverter extends DataTypeConverter<MapFileType> {

  @Override
  public Class<?> getDataTypeClass() {
    return MapFileType.class;
  }

}
