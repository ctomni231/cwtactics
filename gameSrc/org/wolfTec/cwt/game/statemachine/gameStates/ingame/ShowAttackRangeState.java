package org.wolfTec.cwt.game.statemachine.gameStates.ingame;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.wolfTecEngine.beans.Bean;

@Bean
public class ShowAttackRangeState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_GAMEROUND_SHOW_ATTACK_RANGE;
  }
}
