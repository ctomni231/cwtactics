package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.Constants;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.utility.BeanFactory;
import org.wolfTec.utility.BeanInitializationListener;

public abstract class AnimationManagerBean implements BeanInitializationListener{

  private int curTime;
  
  private Array<AnimatedLayer> layers;
  private Array<Integer> layerStates;
  
  @Override public void onEngineInit(BeanFactory engine) {
    layers = engine.getBeansOfInterface(AnimatedLayer.class);
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
