package org.wolftec.cwtactics.game.model;

import org.wolftec.core.ManagedComponent;
import org.wolftec.persistence.DataTypeConverter;

@ManagedComponent
public class GameAppConfigConverter extends DataTypeConverter<GameAppConfigData> {

  @Override
  public Class<?> getDataTypeClass() {
    return GameAppConfigData.class;
  }
}
