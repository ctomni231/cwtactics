package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback4;
import org.wolfTec.cwt.utility.beans.Bean;

@Bean
public class GameMapBean {

  private Array<Array<Tile>> mapData;
  private int sizeX;
  private int sizeY;

  @SuppressWarnings("unchecked")
  public GameMapBean(int maxSizeX, int maxSizeY) {
    this.setSizeX(maxSizeX);
    this.setSizeY(maxSizeY);

    mapData = JSCollections.$array();
    for (int x = 0, xe = maxSizeX; x < xe; x++) {
      Array<Tile> column = JSCollections.$array();

      for (int y = 0, ye = maxSizeY; y < ye; y++) {
        column.push(new Tile());
      }

      mapData.push(column);
    }
  }

  public Tile getTile(int x, int y) {
    return mapData.$get(x).$get(y);
  }

  /**
   * Returns the distance of two positions.
   *
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return
   */
  public int getDistance(int sx, int sy, int tx, int ty) {
    // TODO maybe we need a bridge here
    return Math.abs(sx - tx) + Math.abs(sy - ty);
  }

  public void searchUnit(Unit unit, Callback4<Integer, Integer, Unit, Array<Object>> callback,
      Array<Object> callbackArgument) {

    for (int x = 0, xe = getSizeX(); x < xe; x++) {
      for (int y = 0, ye = getSizeY(); y < ye; y++) {
        if (mapData.$get(x).$get(y).unit == unit) {
          callback.$invoke(x, y, unit, callbackArgument);
        }
      }
    }
  }

  public int getSizeX() {
    return sizeX;
  }

  private void setSizeX(int sizeX) {
    this.sizeX = sizeX;
  }

  public int getSizeY() {
    return sizeY;
  }

  private void setSizeY(int sizeY) {
    this.sizeY = sizeY;
  }
}
