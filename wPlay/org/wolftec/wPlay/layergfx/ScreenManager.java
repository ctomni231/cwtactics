package org.wolftec.wPlay.layergfx;

import org.stjs.javascript.Array;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.wCore.container.ContainerUtil;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagerOptions;
import org.wolftec.wPlay.layergfx.DirectionUtil.Direction;

/**
 * Screen manager.
 */
@ManagedComponent
public class ScreenManager implements ManagedComponentInitialization {

  public int MENU_ENTRY_HEIGHT;
  public int MENU_ENTRY_WIDTH;

  @Injected
  private ManagerOptions options;

  private Array<GraphicLayer> layers;
  private Array<Integer> layerStates;
  private Array<Integer> layerTime;

  protected Canvas cv;
  protected CanvasRenderingContext2D ctx;
  public int height;
  public int width;
  public int offsetX;
  public int offsetY;
  public int scale;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    MENU_ENTRY_HEIGHT = 2 * options.tileSize;
    MENU_ENTRY_WIDTH = 10 * options.tileSize;

    layers = manager.getComponentsByClass(GraphicLayer.class);
    // TODO sort

    layerStates = ContainerUtil.createArray();
    layerTime = ContainerUtil.createArray();
  }

  public void resetAnimations() {
    for (int i = 0; i < layers.$length(); i++) {
      layerStates.$set(i, 0);
      layerTime.$set(i, layers.$get(i).getFrameTime());
    }
  }

  public void update(int delta) {
    for (int i = 0; i < layers.$length(); i++) {

      layerTime.$set(i, layerTime.$get(i) + delta);
      if (layerTime.$get(i) <= 0) {
        // next frame of a layer

        layerTime.$set(i, layers.$get(i).getFrameTime());

        layerStates.$set(i, layerStates.$get(i));
        if (layers.$get(i).getNumberOfFrames() != 1
            && layerStates.$get(i) >= layers.$get(i).getNumberOfFrames()) {

          layerStates.$set(i, 0);
        }
      }
    }
  }

  public void draw() {
    // TODO this may cause a performance impact
    // TODO maybe cache layers up to a given level ?
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (int i = 0; i < layers.$length(); i++) {
      ctx.drawImage(layers.$get(i).getImage(layerStates.$get(i)), 0, 0);
    }
  }

  public void setCameraPosition(int x, int y) {
    for (int i = 0; i < layers.$length(); i++) {
      layers.$get(i).onSetScreenPosition(x, y, -1, -1);
    }
  }

  public void shiftCameraPosition(Direction direction, int amount) {
    for (int i = 0; i < layers.$length(); i++) {
      layers.$get(i).onScreenShift(direction, i, i, amount, i);
    }
  }
}
