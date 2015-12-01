package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Property;

public class GameroundRemovePropertyOwnerAction extends AbstractAction {

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Property prop = model.battlefield.properties.getProperty(controller.data.p1);
    prop.owners.setOwner(null);
    // TODO prop.type = propertyDb.get(prop.type.changeAfterCaptured);
  }

}
