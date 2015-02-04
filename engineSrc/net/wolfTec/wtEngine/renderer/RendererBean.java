package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.WolfTecEngine;
import net.wolfTec.wtEngine.base.EngineInitializationListener;
import net.wolfTec.wtEngine.base.EngineOptions;
import net.wolfTec.wtEngine.model.Direction;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public class RendererBean implements EngineInitializationListener {

  public static final int MENU_ELEMENTS_MAX = 10;
  public static final int MENU_ENTRY_HEIGHT = 2 * Constants.TILE_BASE;
  public static final int MENU_ENTRY_WIDTH = 10 * Constants.TILE_BASE;
  public static final int ANIMATION_TICK_TIME = 150;

  private Array<Layer> layers;
  
  public void renderScreen() {
    
  }

  @Override public void onEngineInit(EngineOptions options, WolfTecEngine engine) {
    layers = engine.getBeansOfInterface(Layer.class);
  }
}
