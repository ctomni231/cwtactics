package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.model.Direction;

import org.stjs.javascript.Array;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.InjectedByInterface;

@Bean public class ScreenManagerBean {

  public static final int MENU_ENTRY_HEIGHT = 2 * Constants.TILE_BASE;
  public static final int MENU_ENTRY_WIDTH = 10 * Constants.TILE_BASE;

  @InjectedByInterface private Array<ScreenLayer> layers;

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
