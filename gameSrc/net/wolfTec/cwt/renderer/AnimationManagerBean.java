package net.wolfTec.cwt.renderer;

import net.wolfTec.cwt.Constants;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.InjectedByInterface;
import org.wolfTec.utility.PostInitialization;

@Bean public abstract class AnimationManagerBean {

  private int curTime;
  
  @InjectedByInterface private Array<AnimatedLayer> layers;
  private Array<Integer> layerStates;
  
  @PostInitialization public void init() {
    layerStates = JSCollections.$array();
    curTime = 0;
  }
  
  public void update(int delta) {

    curTime += delta;
    if (curTime > Constants.ANIMATION_TICK_TIME) {
      curTime = 0;
      
      for (int i = 0; i < layers.$length(); i++) {
        AnimatedLayer layer = layers.$get(i);
        int state = layerStates.$get(i);
        if (state +1 < layer.getSubStates()) {
          state += 1;
        } else {
          state = 0;
        } // TODO: grab animation strategy (array) from animated bean
        layerStates.$set(i, state);
        if (layer.isDoubleStepAnimated()) {
          if (state % 2 == 0) {
            layer.renderState(state/2);
          }
        } else {
          layer.renderState(state);
        }
      }
    }
  }
}
