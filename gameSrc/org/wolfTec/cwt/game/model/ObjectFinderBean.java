package org.wolfTec.cwt.game.model;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;

@Bean
public class ObjectFinderBean {

  @Injected
  private GameRoundBean gameround;

  public int getX(int positionValue) {
    return -1; // TODO
  }

  public int getY(int positionValue) {
    return -1; // TODO
  }

  public int findProperty(Property property) {
    return -1; // TODO
  }

  public int findUnit(Unit unit) {
    return -1; // TODO
  }

  public int findTile(Tile unit) {
    return -1; // TODO
  }
}
