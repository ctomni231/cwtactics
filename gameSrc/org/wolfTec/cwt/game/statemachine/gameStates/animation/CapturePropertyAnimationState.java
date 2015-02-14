package org.wolfTec.cwt.game.statemachine.gameStates.animation;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.gameStates.AnimationState;
import org.wolfTec.cwt.utility.beans.Bean;

@Bean
public class CapturePropertyAnimationState extends AnimationState {

  @Override
  public String getId() {
    return EngineGlobals.STATE_ANIMATION_CAPTURE;
  }
}
