package org.wolfTec.cwt.game.statemachine.gameStates.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.State;

public class OptionsSetMappingState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_OPTIONS_REMAP_INPUT;
  }

}
