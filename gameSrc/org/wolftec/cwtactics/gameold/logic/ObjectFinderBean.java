package org.wolftec.cwtactics.gameold.logic;

import org.wolftec.cwtactics.gameold.domain.model.GameManager;
import org.wolftec.cwtactics.gameold.domain.model.Property;
import org.wolftec.cwtactics.gameold.domain.model.Tile;
import org.wolftec.cwtactics.gameold.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
public class ObjectFinderBean {

  @Injected
  private GameManager gameround;

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

  public int findTileByUnit(Unit unit) {
    return -1; // TODO
  }
}
