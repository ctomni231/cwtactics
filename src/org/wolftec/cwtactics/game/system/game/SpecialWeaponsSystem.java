package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.FireAble;
import org.wolftec.cwtactics.game.components.game.Living;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.HealthEvents;
import org.wolftec.cwtactics.game.event.game.SpecialWeaponsEvents;
import org.wolftec.cwtactics.game.event.ui.action.ActionFlags;
import org.wolftec.cwtactics.game.event.ui.action.AddAction;
import org.wolftec.cwtactics.game.event.ui.action.BuildActions;
import org.wolftec.cwtactics.game.event.ui.action.InvokeAction;

public class SpecialWeaponsSystem implements System, SpecialWeaponsEvents, BuildActions, InvokeAction {

  private EntityManager em;
  private EventEmitter ev;

  private AddAction actionEv;
  private SpecialWeaponsEvents specialEv;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1 && flags.get(ActionFlags.FLAG_SOURCE_PROP_NONE) == 1) {
      if (em.hasEntityComponent(property, FireAble.class)) {
        FireAble silo = em.getComponent(property, FireAble.class);

        if (em.getComponent(unit, Owner.class).owner == em.getComponent(EntityId.GAME_ROUND, Turn.class).owner && silo.usableBy.indexOf(unit) != -1) {
          actionEv.addAction("fireSilo", true);
        }
      }
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "fireSilo") {
      String silo = em.getEntityByFilter(Position.class, (em, ent, pos) -> !em.hasEntityComponent(ent, Living.class) && pos.x == x && pos.y == y);
      String launcher = em.getEntityByFilter(Position.class, (em, ent, pos) -> em.hasEntityComponent(ent, Living.class) && pos.x == x && pos.y == y);

      specialEv.onFireRocket(silo, launcher, tx, ty);
    }
  }

  @Override
  public void onFireRocket(String silo, String firer, int tx, int ty) {
    FireAble fireAble = em.getComponent(silo, FireAble.class);

    em.forEachComponentOfType(Position.class, (em, entity, pos) -> {
      if (em.hasEntityComponent(entity, Living.class)) {
        int diffX = Math.abs(pos.x - tx);
        int diffY = Math.abs(pos.y - ty);
        if (diffX + diffY <= fireAble.range) {
          ev.publish(HealthEvents.class).onDamageUnit(entity, fireAble.damage, 10);
        }
      }
    });
  }
}
