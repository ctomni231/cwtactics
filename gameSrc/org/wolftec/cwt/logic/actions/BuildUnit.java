package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.SheetIdNumberUtil;
import org.wolftec.cwt.logic.features.FactoryLogic;
import org.wolftec.cwt.logic.features.FogLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class BuildUnit implements Action {

  private ModelManager model;
  private FactoryLogic factory;
  private FogLogic fog;

  @Override
  public String key() {
    return "buildUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean checkSource(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY && propertyFlag == TileMeta.OWN;
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
  public void prepareActionMenu(UserInteractionData data) {
    factory.generateBuildMenu(data.source.property, data, true);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    factory.buildUnit(model.getProperty(data.p1), SheetIdNumberUtil.convertNumberToId(data.p2));
    fog.fullRecalculation();
  }

}
