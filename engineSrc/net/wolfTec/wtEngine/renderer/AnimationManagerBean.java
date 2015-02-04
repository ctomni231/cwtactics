package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.WolfTecEngine;
import net.wolfTec.wtEngine.base.EngineInitializationListener;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public abstract class AnimationManagerBean implements EngineInitializationListener{

  /** */
  private int indexUnitAnimation;

  private Array<AnimatedLayer> layers;
  private Array<Integer> layerStates;
  
  @Override public void onEngineInit(WolfTecEngine engine) {
    layers = engine.getBeansOfInterface(AnimatedLayer.class);
    layerStates = JSCollections.$array();
  }
  
  public void update(int delta) {
    for (int i = 0; i < layers.$length(); i++) {
      AnimatedLayer layer = layers.$get(i);
      layer.renderState(layer.getSubStates());
    }
  }
}
