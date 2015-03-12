package org.wolfTec.cwt.game.gamemodel.bean;

import org.wolfTec.cwt.game.gamemodel.model.Property;
import org.wolfTec.cwt.game.gamemodel.model.Tile;
import org.wolfTec.cwt.game.gamemodel.model.Unit;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;

@ManagedComponent
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
