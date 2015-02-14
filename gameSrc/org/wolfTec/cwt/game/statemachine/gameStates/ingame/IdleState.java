package org.wolfTec.cwt.game.statemachine.gameStates.ingame;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.utility.beans.Bean;

@Bean
public class IdleState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_IDLE;
  }
}
