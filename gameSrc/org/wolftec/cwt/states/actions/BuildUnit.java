package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.logic.FactoryLogic;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.Action;
import org.wolftec.cwt.states.ActionData;
import org.wolftec.cwt.states.ActionType;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.StringNumberConverter;

public class BuildUnit implements Action {

  private ModelManager model;
  private FactoryLogic factory;
  private FogLogic     fog;

  @Override
  public String key() {
    return "buildUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return factory.isFactory(data.source.property) && factory.canProduce(data.source.property);
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareMenu(UserInteractionData data) {
    factory.generateBuildMenu(data.source.property, data, true);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void invoke(ActionData data) {
    factory.buildUnit(model.getProperty(data.p1), StringNumberConverter.toId(data.p2));
    fog.fullRecalculation();
  }

}
