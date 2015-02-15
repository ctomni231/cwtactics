package org.wolfTec.cwt.game.statemachine.gameStates.animation;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.gameStates.AnimationState;
import org.wolfTec.wolfTecEngine.beans.Bean;

@Bean
public class LaserFireAnimationState extends AnimationState {

  @Override
  public String getId() {
    return EngineGlobals.STATE_ANIMATION_LASER_FIRE;
  }
}
