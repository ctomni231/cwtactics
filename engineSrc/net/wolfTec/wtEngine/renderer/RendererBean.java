package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.WolfTecEngine;
import net.wolfTec.wtEngine.base.EngineInitializationListener;
import net.wolfTec.wtEngine.base.EngineOptions;
import net.wolfTec.wtEngine.base.PostEngineInitializationListener;
import net.wolfTec.wtEngine.map.Direction;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public class RendererBean implements EngineInitializationListener {

  private Array<Layer> layers;
  
  public void renderScreen() {
    
  }

  public void shiftScreen(Direction direction, int amount) {
    
  }

  @Override public void onEngineInit(EngineOptions options, WolfTecEngine engine) {
    layers = engine.getBeansOfInterface(Layer.class);
  }
}
