package org.wolftec.cwtactics.game.system.logic;

import org.wolftec.cwtactics.game.components.objects.HealthComponent;
import org.wolftec.cwtactics.game.system.ISystem;

public class HealthSystem implements ISystem {

  @Override
  public void onInit() {
    events().INFLICTS_DAMAGE.subscribe((att, def, damage) -> damageEntity(att, def, damage));
  }

  public void damageEntity(String attacker, String defender, Integer damage) {
    HealthComponent hpC = gec(attacker, HealthComponent.class);

    hpC.hp -= damage;
    if (hpC.hp < 0) {
      hpC.hp = 0;
    }

    events().UNIT_DAMAGED.publish(defender, damage); // TODO rest needed ?
  }

  /**
   * Heals an unit object.
   * 
   * @param id
   *          entity id
   * @param amount
   *          amount of healing in health
   */
  public void healEntity(String id, int amount) {
    HealthComponent hpC = gec(id, HealthComponent.class);

    hpC.hp += amount;
    if (hpC.hp > 99) {
      hpC.hp = 99;
    }

    events().UNIT_HEALED.publish(id, amount); // TODO rest needed ?
  }
}
