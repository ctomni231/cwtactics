package org.wolfTec.cwt.game.statemachine.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.ingame.ActionmenuState;
import org.wolfTec.wolfTecEngine.statemachine.State;

public class ConfirmWipeoutState extends ActionmenuState {

  @Override
  public String getId() {
    return EngineGlobals.STATE_CONFIRM_WIPEOUT;
  }

}
