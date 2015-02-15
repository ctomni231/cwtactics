package org.wolfTec.cwt.game.statemachine.animation;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.statemachine.AnimationState;

@Bean
public class ChangeWeatherAnimationState extends AnimationState {

  @Override
  public String getId() {
    return EngineGlobals.STATE_ANIMATION_CHANGE_WEATHER;
  }
}
