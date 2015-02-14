package org.wolfTec.cwt.game.statemachine.gameStates.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.State;

public class ParameterSetupState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_GAMEROUND_PARAMETER_SETUP;
  }

}
