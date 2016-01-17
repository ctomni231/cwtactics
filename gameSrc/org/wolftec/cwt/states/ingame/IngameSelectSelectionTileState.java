package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.AbstractIngameState;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class IngameSelectSelectionTileState extends AbstractIngameState
{

  private UserInteractionData data;
  private ModelManager model;

  @Override
  public void onEnter(StateFlowData transition)
  {
    data.actionTarget.clean();
  }

  @Override
  public void onExit(StateFlowData transition)
  {
    data.targets.reset();
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta)
  {
    if (data.targets.getValue(data.cursorX, data.cursorY) >= 0)
    {
      model.updatePositionData(data.actionTarget, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
