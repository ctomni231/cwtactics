package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.action.TileMeta;
import org.wolftec.cwt.logic.FactoryLogic;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;
import org.wolftec.cwt.util.SheetIdNumberUtil;

public class BuildUnit implements Action
{

  private ModelManager model;
  private FactoryLogic factory;
  private FogLogic fog;

  @Override
  public String key()
  {
    return "buildUnit";
  }

  @Override
  public ActionType type()
  {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean checkSource(TileMeta unitFlag, TileMeta propertyFlag)
  {
    return unitFlag == TileMeta.EMPTY && propertyFlag == TileMeta.OWN;
  }

  @Override
  public boolean condition(UserInteractionData data)
  {
    return factory.isFactory(data.source.property) && factory.canProduce(data.source.property);
  }

  @Override
  public boolean hasSubMenu()
  {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data)
  {
    factory.generateBuildMenu(data.source.property, (tp, enabled) ->
    {
      if (enabled)
      {
        data.addInfo(tp, true);
      }
    });
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData)
  {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    factory.buildUnit(model.getProperty(data.p1), SheetIdNumberUtil.convertNumberToId(data.p2));
    fog.fullRecalculation();
  }

}
