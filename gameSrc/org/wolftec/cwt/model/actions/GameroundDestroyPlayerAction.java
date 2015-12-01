package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;

public class GameroundDestroyPlayerAction extends AbstractAction {

  private final GameroundDestroyPlayerUnitsAction destroyUnits;
  private final GameroundRemovePlayerPropertiesAction destroyProps;

  public GameroundDestroyPlayerAction(GameroundDestroyPlayerUnitsAction destroyUnits, GameroundRemovePlayerPropertiesAction destroyProps) {
    this.destroyUnits = destroyUnits;
    this.destroyProps = destroyProps;
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    destroyProps.evaluateByData(model, controller);
    destroyUnits.evaluateByData(model, controller);
    model.battlefield.players.removePlayer(model.battlefield.players.getPlayer(controller.data.p1));
  }

}
