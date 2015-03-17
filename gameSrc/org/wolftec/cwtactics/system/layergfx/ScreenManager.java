package org.wolftec.cwtactics.system.layergfx;

import org.stjs.javascript.Array;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.container.ContainerUtil;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagerOptions;
import org.wolftec.cwtactics.system.layergfx.DirectionUtil.Direction;

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

    layers = ContainerUtil.createArray();
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
