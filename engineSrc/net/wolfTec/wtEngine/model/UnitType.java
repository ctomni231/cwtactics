package net.wolfTec.wtEngine.model;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.Game;
import net.wolfTec.wtEngine.utility.AssertUtil;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;

import java.util.Iterator;

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
        AssertUtil.greaterEquals(cost, 1);
        AssertUtil.isNot(cost, 0);

        AssertUtil.greaterEquals(range, 0);
        AssertUtil.lowerEquals(range, Constants.MAX_SELECTION_RANGE);

        AssertUtil.greaterEquals(vision, 1);
        AssertUtil.lowerEquals(vision, Constants.MAX_SELECTION_RANGE);

        AssertUtil.greaterEquals(fuel, 0);
        AssertUtil.lowerEquals(fuel, 99);

        AssertUtil.greaterEquals(ammo, 0);
        AssertUtil.lowerEquals(ammo, 99);

        AssertUtil.greaterEquals(dailyFuelDrain, 1);
        AssertUtil.lowerEquals(dailyFuelDrain, 99);

        AssertUtil.greaterEquals(dailyFuelDrainHidden, 2);
        AssertUtil.lowerEquals(dailyFuelDrainHidden, 99);

        AssertUtil.notNull(getMoveType());

        if (maxloads != Constants.INACTIVE_ID) AssertUtil.greaterThen(maxloads, 0);

        if (captures != Constants.INACTIVE_ID) AssertUtil.greaterEquals(captures, 1);

        if (attack != null) {
            AssertUtil.greaterEquals(attack.minrange, 1);
            AssertUtil.greaterEquals(attack.maxrange, attack.maxrange+1);

            checkAttackMap(attack.mainWeapon);
            checkAttackMap(attack.secondaryWeapon);
        }

        if (suicide != null) {
            AssertUtil.greaterEquals(suicide.damage, 1);
            AssertUtil.lowerEquals(suicide.damage, 10);

            AssertUtil.greaterEquals(suicide.range, 1);
            AssertUtil.lowerEquals(suicide.range, Constants.MAX_SELECTION_RANGE);
        }
    }

    private void checkAttackMap (Map<String, Integer> map) {
        Iterator<String> unitIds = map.iterator();
        while (unitIds.hasNext()) {
            String targetId = unitIds.next();
            AssertUtil.notEmpty(targetId);
            AssertUtil.greaterEquals(map.$get(targetId), 1);
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
