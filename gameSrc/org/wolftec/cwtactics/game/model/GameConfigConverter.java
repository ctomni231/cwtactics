package org.wolftec.cwtactics.game.model;

import org.wolftec.core.ManagedComponent;
import org.wolftec.persistence.DataTypeConverter;

@ManagedComponent
public class GameConfigConverter extends DataTypeConverter<GameConfigData> {

  @Override
  public Class<?> getDataTypeClass() {
    return GameConfigData.class;
  }
}
