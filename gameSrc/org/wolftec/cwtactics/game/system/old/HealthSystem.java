package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.Living;

public class HealthSystem implements ISystem {

  @Override
  public void onConstruction() {
    events().INFLICTS_DAMAGE.subscribe(this::damageEntity);
  }

  /**
   * Damages a defender entity with a given amount of damage.
   * 
   * @param attacker
   * @param defender
   * @param damage
   */
  public void damageEntity(String attacker, String defender, Integer damage) {
    Living hpC = gec(defender, Living.class);

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
    Living hpC = gec(id, Living.class);

    hpC.hp += amount;
    if (hpC.hp > 99) {
      hpC.hp = 99;
    }

    events().UNIT_HEALED.publish(id, amount); // TODO rest needed ?
  }
}
