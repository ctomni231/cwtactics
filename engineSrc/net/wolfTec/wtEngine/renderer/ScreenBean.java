package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.WolfTecEngine;
import net.wolfTec.wtEngine.base.EngineInitializationListener;
import net.wolfTec.wtEngine.base.EngineOptions;
import net.wolfTec.wtEngine.model.Direction;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.Canvas;

@Namespace("cwt") public class ScreenBean implements EngineInitializationListener {

  public static final int LAYER_BACKGROUND = 0;
  public static final int LAYER_MAP = 1;
  public static final int LAYER_FOG = 2;
  public static final int LAYER_UNIT = 3;
  public static final int LAYER_FOCUS = 4;
  public static final int LAYER_EFFECTS = 5;
  public static final int LAYER_UI = 6;

  public int height;
  public int width;
  public int shiftX;
  public int shiftY;
  public int scale;

  private Array<Layer> layers;

  @Override public void onEngineInit(EngineOptions options, WolfTecEngine engine) {
    layers = JSCollections.$array();
    
    int numOfLayers = LAYER_UI+1;
    while (numOfLayers > 0) {
      layers.push(new Layer());
      numOfLayers--;
    }
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

  public void hideLayer(int index) {
    Canvas layer = layers.$get(index).getLayer(Constants.INACTIVE_ID);
    JSObjectAdapter.$js("layer.style.display = 'none'");
  }

  public void showLayer(int index) {
    Canvas layer = layers.$get(index).getLayer(Constants.INACTIVE_ID);
    JSObjectAdapter.$js("layer.style.display = ''");
  }

  public Layer getLayer(int index) {
    return layers.$get(index);
  }

}
