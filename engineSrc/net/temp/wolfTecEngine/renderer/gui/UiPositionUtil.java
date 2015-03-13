package net.temp.wolfTecEngine.renderer.gui;

import org.wolftec.core.ConvertUtility;
import org.wolftec.core.JsUtil;

/**
 * Utility class to handle the size and positions of {@link UiElement} objects.
 *
 */
public abstract class UiPositionUtil {

  public static enum Position {
    NORTH, NORTH_EAST, NORTH_WEST, SOUTH, SOUTH_EAST, SOUTH_WEST, WEST, EAST
  }

  private static int queryToPixel(int size, String query) {
    if (query.endsWith("px")) {
      return ConvertUtility.strToInt(query.substring(0, query.length() - 2));

    } else if (query.endsWith("%")) {
      int perc = ConvertUtility.strToInt(query.substring(0, query.length() - 1));
      return ConvertUtility.floatToInt(perc / 100 * size);

    } else {
      JsUtil.raiseError("Unknown size query {}", query);
      return -1;
    }
  }

  public static void setElementSize(UiElement element, String queryWidth, String queryHeight) {
    element.width = queryToPixel(0, queryWidth);
    element.height = queryToPixel(0, queryHeight);
  }

  // TODO gap
  public static void setElementPosition(UiElement element, Position position) {

  }
}
