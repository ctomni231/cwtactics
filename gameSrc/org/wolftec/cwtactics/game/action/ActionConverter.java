package org.wolftec.cwtactics.game.action;

import org.wolftec.core.ManagedComponent;
import org.wolftec.persistence.DataTypeConverter;

@ManagedComponent
public class ActionConverter extends DataTypeConverter<ActionItem> {

  @Override
  public Class<?> getDataTypeClass() {
    return ActionItem.class;
  }

}
