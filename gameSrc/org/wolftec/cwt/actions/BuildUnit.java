package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.SheetIdNumberUtil;
import org.wolftec.cwt.logic.FactoryLogic;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

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
    return factory.isFactory(data.source.property.get()) && factory.canProduce(data.source.property.get());
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    factory.generateBuildMenu(data.source.property.get(), data, true);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    factory.buildUnit(model.getProperty(data.p1), SheetIdNumberUtil.toId(data.p2));
    fog.fullRecalculation();
  }

}
