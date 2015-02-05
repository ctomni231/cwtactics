package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.base.BeanFactory;
import net.wolfTec.wtEngine.base.BeanInitializationListener;
import net.wolfTec.wtEngine.model.Direction;

import org.stjs.javascript.Array;

public class ScreenManagerBean implements BeanInitializationListener {

  public static final int MENU_ENTRY_HEIGHT = 2 * Constants.TILE_BASE;
  public static final int MENU_ENTRY_WIDTH = 10 * Constants.TILE_BASE;
  
  public int height;
  public int width;
  public int offsetX;
  public int offsetY;
  public int scale;

  private Array<ScreenLayer> layers;

  @Override public void onEngineInit(BeanFactory engine) {
    layers = engine.getBeansOfInterface(ScreenLayer.class);
  }

  public void setPosition(int x, int y) {
    
    
    // TODO
  }

  public void shiftScreen(Direction direction, int amount) {
    
  }
}
