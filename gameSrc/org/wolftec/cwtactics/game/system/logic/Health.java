package org.wolftec.cwtactics.game.system.logic;

import org.wolftec.cwtactics.game.components.objects.HealthComponent;
import org.wolftec.cwtactics.game.system.ISystem;

public class Health implements ISystem {

  @Override
  public void onInit() {
    events().INFLICTS_DAMAGE.subscribe((attacker, defender, damage) -> damageEntity(defender, damage, 0));
  }

  /**
   * Damages an unit object.
   * 
   * @param id
   *          entity id
   * @param amount
   *          amount of damage
   * @param minRest
   */
  public void damageEntity(String id, int amount, int minRest) {
    HealthComponent hpC = grabHealthComponent(id);

    hpC.hp -= amount;
    if (hpC.hp < 0) {
      hpC.hp = 0;
    }

    events().UNIT_DAMAGED.publish(id, amount); // TODO rest needed ?
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
    HealthComponent hpC = grabHealthComponent(id);

    hpC.hp += amount;
    if (hpC.hp > 99) {
      hpC.hp = 99;
    }

    events().UNIT_HEALED.publish(id, amount); // TODO rest needed ?
  }

  private HealthComponent grabHealthComponent(String id) {
    HealthComponent hpC = entityManager().getEntityComponent(id, HealthComponent.class);
    return hpC;
  }
}
