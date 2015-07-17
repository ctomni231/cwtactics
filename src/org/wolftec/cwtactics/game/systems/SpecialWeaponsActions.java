package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.components.FireAble;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.Turn;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.FireRocket;
import org.wolftec.cwtactics.game.events.ui.ActionFlags;
import org.wolftec.cwtactics.game.events.ui.AddAction;
import org.wolftec.cwtactics.game.events.ui.BuildActions;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;

public class SpecialWeaponsActions implements System, BuildActions, InvokeAction {

  private AddAction            actionEv;
  private FireRocket           specialEv;

  private Components<FireAble> firables;
  private Components<Position> positions;
  private Components<Owner>    owners;
  private Components<Living>   livings;
  private Components<Turn>     turns;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1 && flags.get(ActionFlags.FLAG_SOURCE_PROP_NONE) == 1) {
      if (firables.has(property)) {
        FireAble silo = firables.get(property);

        if (owners.get(unit).owner == turns.get(Entities.GAME_ROUND).owner && silo.usableBy.indexOf(unit) != -1) {
          actionEv.onAddAction("fireSilo", true);
        }
      }
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "fireSilo") {
      String silo = positions.find((ent, pos) -> !livings.has(ent) && pos.x == x && pos.y == y);
      String launcher = positions.find((ent, pos) -> livings.has(ent) && pos.x == x && pos.y == y);

      specialEv.onFireRocket(silo, launcher, tx, ty);
    }
  }
}
