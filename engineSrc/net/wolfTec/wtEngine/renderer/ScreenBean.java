package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.WolfTecEngine;
import net.wolfTec.wtEngine.base.EngineInitializationListener;
import net.wolfTec.wtEngine.model.Direction;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class ScreenBean implements EngineInitializationListener {

  public static final int MENU_ENTRY_HEIGHT = 2 * Constants.TILE_BASE;
  public static final int MENU_ENTRY_WIDTH = 10 * Constants.TILE_BASE;
  
  public int height;
  public int width;
  public int shiftX;
  public int shiftY;
  public int scale;

  private Array<Layer> layers;

  @Override public void onEngineInit(WolfTecEngine engine) {
    layers = engine.getBeansOfInterface(Layer.class);
  }

  public void setPosition(int x, int y) {
    
    
    // TODO
  }

  public void shiftScreen(Direction direction, int amount) {
    int newX = shiftX;
    int newY = shiftY;
    
    switch (direction) {
      case DOWN:
        newY += shiftY;
        break;
      case LEFT:
        newX -= shiftX;
        break;
      case RIGHT:
        newX += shiftX;
        break;
      case UP:
        newY -= shiftY;
        break;

      default:
        break;
    }
    
    setPosition(newX, newY);
  }
}
