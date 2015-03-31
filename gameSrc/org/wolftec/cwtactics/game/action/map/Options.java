package org.wolftec.cwtactics.game.action.map;

import org.wolftec.cwtactics.game.action.Action;
import org.wolftec.cwtactics.game.action.ActionItem;
import org.wolftec.cwtactics.game.action.ActionType;
import org.wolftec.cwtactics.game.state.StateDataBean;
import org.wolftec.cwtactics.game.state.menu.OptionsMainState;
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
