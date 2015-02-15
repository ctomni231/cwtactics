package org.wolfTec.cwt.game.statemachine.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.statemachine.State;

public class SkirmishMapSelectState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_GAMEROUND_SKIRMISH_MAP_SELECT;
  }

}
