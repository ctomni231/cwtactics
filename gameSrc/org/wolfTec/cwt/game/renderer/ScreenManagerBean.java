package org.wolfTec.cwt.game.renderer;

import org.stjs.javascript.Array;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.Direction;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.InjectedByInterface;

@Bean
public class ScreenManagerBean {

  public static final int MENU_ENTRY_HEIGHT = 2 * EngineGlobals.TILE_BASE;
  public static final int MENU_ENTRY_WIDTH = 10 * EngineGlobals.TILE_BASE;

  @InjectedByInterface
  private Array<ScreenLayer> layers;

  public int height;
  public int width;
  public int offsetX;
  public int offsetY;
  public int scale;

  public void setPosition(int x, int y) {

    // TODO
  }

  public void shiftScreen(Direction direction, int amount) {

  }
}
