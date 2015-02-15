package org.wolfTec.cwt.game.statemachine.ingame;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class FlushActionsState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_FLUSH_ACTIONS;
  }
}
