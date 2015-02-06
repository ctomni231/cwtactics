package net.wolfTec.wtEngine.model;

import java.util.Iterator;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.utility.AssertUtilyBean;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;

/**
 * Unit type which holds all information about a unit type. In general this are all non-changeable data of an unit.
 */
public class UnitType extends ObjectType {

    public int cost;
    public int range;
    public int vision;
    public int fuel;
    public int ammo;
    public String movetype;
    public int dailyFuelDrain;
    public int dailyFuelDrainHidden;
    public int maxloads;

    public Array<String> canload;

    public Array<String> supply;

    public int captures;
    public boolean stealth;

    public AttackType attack;
    public SuicideType suicide;
    
    public UnitType() {
      cost = Constants.INACTIVE_ID;
      range = Constants.INACTIVE_ID;
      vision = Constants.INACTIVE_ID;
      fuel = Constants.INACTIVE_ID;
      ammo = Constants.INACTIVE_ID;
      movetype = null;
      dailyFuelDrain = Constants.INACTIVE_ID;
      dailyFuelDrainHidden = Constants.INACTIVE_ID;
      maxloads = Constants.INACTIVE_ID;
      canload = null;
      supply = null;
      captures = Constants.INACTIVE_ID;
      stealth = false;
      attack = null;
      suicide = null;
    }

    @Override
    public void validate() {
        AssertUtilyBean.greaterEquals(cost, 1);
        AssertUtilyBean.isNot(cost, 0);

        AssertUtilyBean.greaterEquals(range, 0);
        AssertUtilyBean.lowerEquals(range, Constants.MAX_SELECTION_RANGE);

        AssertUtilyBean.greaterEquals(vision, 1);
        AssertUtilyBean.lowerEquals(vision, Constants.MAX_SELECTION_RANGE);

        AssertUtilyBean.greaterEquals(fuel, 0);
        AssertUtilyBean.lowerEquals(fuel, 99);

        AssertUtilyBean.greaterEquals(ammo, 0);
        AssertUtilyBean.lowerEquals(ammo, 99);

        AssertUtilyBean.greaterEquals(dailyFuelDrain, 1);
        AssertUtilyBean.lowerEquals(dailyFuelDrain, 99);

        AssertUtilyBean.greaterEquals(dailyFuelDrainHidden, 2);
        AssertUtilyBean.lowerEquals(dailyFuelDrainHidden, 99);

        AssertUtilyBean.notNull(getMoveType());

        if (maxloads != Constants.INACTIVE_ID) AssertUtilyBean.greaterThen(maxloads, 0);

        if (captures != Constants.INACTIVE_ID) AssertUtilyBean.greaterEquals(captures, 1);

        if (attack != null) {
            AssertUtilyBean.greaterEquals(attack.minrange, 1);
            AssertUtilyBean.greaterEquals(attack.maxrange, attack.maxrange+1);

            checkAttackMap(attack.mainWeapon);
            checkAttackMap(attack.secondaryWeapon);
        }

        if (suicide != null) {
            AssertUtilyBean.greaterEquals(suicide.damage, 1);
            AssertUtilyBean.lowerEquals(suicide.damage, 10);

            AssertUtilyBean.greaterEquals(suicide.range, 1);
            AssertUtilyBean.lowerEquals(suicide.range, Constants.MAX_SELECTION_RANGE);
        }
    }

    private void checkAttackMap (Map<String, Integer> map) {
        Iterator<String> unitIds = map.iterator();
        while (unitIds.hasNext()) {
            String targetId = unitIds.next();
            AssertUtilyBean.notEmpty(targetId);
            AssertUtilyBean.greaterEquals(map.$get(targetId), 1);
        }
    }

    /**
     *
     * @return move type object for the given move type id of the unit type
     */
    @SuppressWarnings("unchecked")
    public MoveType getMoveType () {
    	// TODO
        //return ((Database<MoveType>) CustomWarsTactics.getBean("moveTypeDb")).getSheet(movetype);
    	return null;
    }
}
