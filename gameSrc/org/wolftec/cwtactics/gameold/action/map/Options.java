package org.wolftec.cwtactics.gameold.action.map;

import org.wolftec.cwtactics.gameold.action.Action;
import org.wolftec.cwtactics.gameold.action.ActionItem;
import org.wolftec.cwtactics.gameold.action.ActionType;
import org.wolftec.cwtactics.gameold.state.StateDataBean;
import org.wolftec.cwtactics.gameold.state.menu.OptionsMainState;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.state.StateManager;

@ManagedComponent
public class Options implements Action {

  @Injected
  private StateDataBean stateData;

  @Injected
  private StateManager stateMachine;

  @Override
  public ActionType getActionType() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public void invoke(ActionItem data) {
    stateData.fromIngameToOptions = true;
    stateMachine.changeToStateClass(OptionsMainState.class);
  }
}
