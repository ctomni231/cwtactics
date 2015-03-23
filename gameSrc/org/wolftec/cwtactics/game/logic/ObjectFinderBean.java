package org.wolftec.cwtactics.game.logic;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.game.model.GameRoundBean;
import org.wolftec.cwtactics.game.model.Property;
import org.wolftec.cwtactics.game.model.Tile;
import org.wolftec.cwtactics.game.model.Unit;

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
