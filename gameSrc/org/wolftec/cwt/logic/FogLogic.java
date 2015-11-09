package org.wolftec.cwt.logic;

import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.tags.Configurable;
import org.wolftec.cwt.tags.Configuration;
import org.wolftec.cwt.util.NullUtil;

public class FogLogic implements ManagedClass, Configurable {

  private ModelManager model;

  private Configuration cfgEnabled;

  @Override
  public void onConstruction() {
    cfgEnabled = new Configuration("game.fog.enabled", 0, 1, 1);
  }

  /**
   * Modifies a vision at a given position and player id.
   * 
   * @param x
   * @param y
   * @param owner
   * @param range
   * @param value
   */
  private void modifyVision(int x, int y, Player owner, int range, int value) {

    // ignore neutral objects
    if (owner.isInactive()) {
      return;
    }

    if (cfgEnabled.value == 0) {
      return;
    }

    boolean clientVisible = owner.clientVisible;
    boolean turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) {
      return;
    }

    if (range == 0) {
      Tile tile = model.getTile(x, y);
      if (clientVisible) tile.visionClient += value;
      if (turnOwnerVisible) tile.visionTurnOwner += value;

    } else {
      int mW = model.mapWidth;
      int mH = model.mapHeight;
      int lX;
      int hX;
      int lY = y - range;
      int hY = y + range;

      if (lY < 0) lY = 0;
      if (hY >= mH) hY = mH - 1;
      for (; lY <= hY; lY++) {

        int disY = Math.abs(lY - y);
        lX = x - range + disY;
        hX = x + range - disY;
        if (lX < 0) lX = 0;
        if (hX >= mW) hX = mW - 1;
        for (; lX <= hX; lX++) {

          // does the tile block vision ?
          Tile tile = model.getTile(lX, lY);

          if (tile.type.visionBlocker && model.getDistance(x, y, lX, lY) > 1) {
            continue;
          }

          if (clientVisible) tile.visionClient += value;
          if (turnOwnerVisible) tile.visionTurnOwner += value;
        }
      }
    }
  }

  //
  // Completely recalculates the fog aw2.
  //
  public void fullRecalculation() {
    int x;
    int y;
    int xe = model.mapWidth;
    int ye = model.mapHeight;
    boolean fogEnabled = (cfgEnabled.value == 1);

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {
        Tile tile = model.getTile(x, y);

        if (!fogEnabled) {
          tile.visionTurnOwner = 1;
          tile.visionClient = 1;
        } else {
          tile.visionTurnOwner = 0;
          tile.visionClient = 0;
        }
      }
    }

    // 2. add vision-object
    if (fogEnabled) {
      int vision;
      Unit unit;
      Tile tile;
      Property property;

      for (x = 0; x < xe; x++) {
        for (y = 0; y < ye; y++) {
          tile = model.getTile(x, y);

          unit = tile.unit;
          if (unit != null) {
            vision = unit.type.vision;
            if (vision < 0) vision = 0;

            modifyVision(x, y, unit.owner, vision, 1);
          }

          property = tile.property;
          if (property != null && property.owner != null) {
            vision = property.type.vision;
            if (vision < 0) vision = 0;

            modifyVision(x, y, property.owner, vision, 1);
          }
        }
      }
    }
  }

  // Removes a vision-object from the fog map.
  //
  private void removeVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, -1);
  }

  public void removeUnitVision(int x, int y, Player owner) {
    Unit unit = model.getTile(x, y).unit;
    if (!NullUtil.isPresent(owner)) owner = unit.owner;

    removeVision(x, y, owner, unit.type.vision);
  }

  public void removePropertyVision(int x, int y, Player owner) {
    Property prop = model.getTile(x, y).property;
    if (!NullUtil.isPresent(owner)) owner = prop.owner;

    removeVision(x, y, owner, prop.type.vision);
  }

  //
  // Adds a vision-object from the fog map.
  //
  private void addVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, +1);
  }

  public void addUnitVision(int x, int y, Player owner) {
    Unit unit = model.getTile(x, y).unit;
    if (!NullUtil.isPresent(owner)) owner = unit.owner;

    addVision(x, y, owner, unit.type.vision);
  }

  public void addPropertyVision(int x, int y, Player owner) {
    Property prop = model.getTile(x, y).property;
    if (!NullUtil.isPresent(owner)) owner = prop.owner;

    addVision(x, y, owner, prop.type.vision);
  }
}
