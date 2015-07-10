package org.wolftec.cwtactics.game.specialWeapons;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.sysevent.SystemEventsManager;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.ActionFlags;
import org.wolftec.cwtactics.game.event.AddAction;
import org.wolftec.cwtactics.game.event.BuildActions;
import org.wolftec.cwtactics.game.event.DamageUnit;
import org.wolftec.cwtactics.game.event.FireRocket;
import org.wolftec.cwtactics.game.event.InvokeAction;
import org.wolftec.cwtactics.game.event.LoadPropertyType;
import org.wolftec.cwtactics.game.living.Living;
import org.wolftec.cwtactics.game.map.Position;
import org.wolftec.cwtactics.game.player.Owner;
import org.wolftec.cwtactics.game.turn.Turn;

public class SpecialWeaponsSystem implements System, FireRocket, BuildActions, InvokeAction, LoadPropertyType {

  private SystemEventsManager  ev;
  private Asserter             asserter;

  private AddAction            actionEv;
  private FireRocket           specialEv;
  private DamageUnit           damageEvent;

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
          actionEv.addAction("fireSilo", true);
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

  @Override
  public void onFireRocket(String silo, String firer, int tx, int ty) {
    FireAble fireAble = firables.get(silo);

    positions.each((entity, pos) -> {
      if (livings.has(entity)) {
        int diffX = Math.abs(pos.x - tx);
        int diffY = Math.abs(pos.y - ty);
        if (diffX + diffY <= fireAble.range) {
          damageEvent.onDamageUnit(entity, fireAble.damage, 10);
        }
      }
    });
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    if (firables.isComponentInRootData(data)) {
      FireAble suicide = firables.acquireWithRootData(entity, data);
      asserter.inspectValue("FireAble.damage of " + entity, suicide.damage).isIntWithinRange(1, Constants.UNIT_HEALTH);
      asserter.inspectValue("FireAble.range of " + entity, suicide.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
      asserter.inspectValue("FireAble.changesType of " + entity, suicide.changesType).whenNotNull(() -> {
        asserter.isEntityId();
      });
    }
  }
}
