package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.FireAble;
import org.wolftec.cwtactics.game.components.game.Living;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.game.HealthEvents;
import org.wolftec.cwtactics.game.event.game.SpecialWeaponsEvents;
import org.wolftec.cwtactics.game.event.ui.MenuEvents;
import org.wolftec.cwtactics.game.util.PositionUtil;

public class SpecialWeaponsSystem implements ConstructedClass, SpecialWeaponsEvents, MenuEvents {

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onBuildActions(int x, int y, String tile, String property, String unit) {
    if (em.hasEntityComponent(property, FireAble.class)) {
      FireAble silo = em.getComponent(property, FireAble.class);
      if (em.getComponent(unit, Owner.class).owner == em.getComponent(EntityId.GAME_ROUND, Turn.class).owner && silo.usableBy.indexOf(unit) != -1) {
        ev.publish(MenuEvents.class).onAddMenuEntry("fireSilo", true);
      }
    }
  }

  @Override
  public void onFireRocket(String silo, String firer, int tx, int ty) {
    FireAble fireAble = em.getComponent(silo, FireAble.class);

    int damage = fireAble.damage;
    PositionUtil.forEachPositionInRange(tx, ty, fireAble.range, (x, y) -> {

      /* TODO grab unit at position x,y */
      String unit = null;
      Living unitHp = null;

      ev.publish(HealthEvents.class).onDamageUnit(unit, damage, 10);
    });
  }
}
