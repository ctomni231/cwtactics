package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback3;
import org.stjs.javascript.functions.Function4;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;

public class TileMap {

  public int mapWidth;
  public int mapHeight;
  public Array<Array<Tile>> map;

  public TileMap() {
    map = JSCollections.$array();
    for (int x = 0, xe = Constants.MAX_MAP_WIDTH; x < xe; x++) {
      map.push(JSCollections.$array());
      for (int y = 0, ye = Constants.MAX_MAP_HEIGHT; y < ye; y++) {
        map.$get(x).push(new Tile());
      }
    }
  }

  /**
   * 
   * @param x
   * @param y
   * @return true if the given position (x,y) is valid on the current active
   *         map, else false
   */
  public boolean isValidPosition(int x, int y) {
    return (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight);
  }

  public Tile getTile(int x, int y) {
    AssertUtil.assertThat(isValidPosition(x, y));
    return map.$get(x).$get(y);
  }

  public void forEachTile(Callback3<Integer, Integer, Tile> cb) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        cb.$invoke(x, y, map.$get(x).$get(y));
      }
    }
  }

  /**
   * Invokes a callback on all tiles in a given range at a position (x,y).
   * 
   * @param x
   * @param y
   * @param range
   * @param cb
   * @param arg
   */
  public void doInRange(int x, int y, int range, Function4<Integer, Integer, Tile, Integer, Boolean> cb) {
    int lX;
    int hX;
    int lY = y - range;
    int hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= mapHeight) hY = mapHeight - 1;
    for (; lY <= hY; lY++) {

      int disY = Math.abs(lY - y);
      lX = x - range + disY;
      hX = x + range - disY;
      if (lX < 0) lX = 0;
      if (hX >= mapWidth) hX = mapWidth - 1;
      for (; lX <= hX; lX++) {

        // invoke the callback on all tiles in range
        // if a callback returns `false` then the process will be stopped
        if (cb.$invoke(lX, lY, getTile(lX, lY), Math.abs(lX - x) + disY) == false) {
          return;
        }
      }
    }
  }

  /**
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return the distance bewteen the two positions
   */
  public static int getDistance(int sx, int sy, int tx, int ty) {
    return Math.abs(sx - tx) + Math.abs(sy - ty);
  }

}
