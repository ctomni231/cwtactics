package org.wolfTec.cwt.game.gamemodel.bean;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.cwt.game.gamemodel.model.Tile;
import org.wolfTec.managed.ManagedComponent;

public class GameMapBean {

  private Array<Array<Tile>> mapData;
  public int width;
  public int height;
  
  public GameMapBean(int maxSizeX, int maxSizeY) {
    this.setSize(maxSizeX, maxSizeY);

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

  private void setSize(int width, int height) {
    this.width = width;
    this.height = height;
  }
}
