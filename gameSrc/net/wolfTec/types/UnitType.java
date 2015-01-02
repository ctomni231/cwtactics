package net.wolfTec.types;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.utility.Assert;

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
        Assert.greaterEquals(cost, 1);
        Assert.isNot(cost, 0);

        Assert.greaterEquals(range, 0);
        Assert.lowerEquals(range, Constants.MAX_SELECTION_RANGE);

        Assert.greaterEquals(vision, 1);
        Assert.lowerEquals(vision, Constants.MAX_SELECTION_RANGE);

        Assert.greaterEquals(fuel, 0);
        Assert.lowerEquals(fuel, 99);

        Assert.greaterEquals(ammo, 0);
        Assert.lowerEquals(ammo, 99);

        Assert.greaterEquals(dailyFuelDrain, 1);
        Assert.lowerEquals(dailyFuelDrain, 99);

        Assert.greaterEquals(dailyFuelDrainHidden, 2);
        Assert.lowerEquals(dailyFuelDrainHidden, 99);

        Assert.notNull(getMoveType());

        if (maxloads != Constants.INACTIVE_ID) Assert.greaterThen(maxloads, 0);

        if (captures != Constants.INACTIVE_ID) Assert.greaterEquals(captures, 1);

        if (attack != null) {
            Assert.greaterEquals(attack.minrange, 1);
            Assert.greaterEquals(attack.maxrange, attack.maxrange+1);

            checkAttackMap(attack.mainWeapon);
            checkAttackMap(attack.secondaryWeapon);
        }

        if (suicide != null) {
            Assert.greaterEquals(suicide.damage, 1);
            Assert.lowerEquals(suicide.damage, 10);

            Assert.greaterEquals(suicide.range, 1);
            Assert.lowerEquals(suicide.range, Constants.MAX_SELECTION_RANGE);
        }
    }

    private void checkAttackMap (Map<String, Integer> map) {
        Iterator<String> unitIds = map.iterator();
        while (unitIds.hasNext()) {
            String targetId = unitIds.next();
            Assert.notEmpty(targetId);
            Assert.greaterEquals(map.$get(targetId), 1);
        }
    }

    /**
     *
     * @return move type object for the given move type id of the unit type
     */
    @SuppressWarnings("unchecked")
    public MoveType getMoveType () {
    	// TODO
        return ((Database<MoveType>) CustomWarsTactics.getBean("moveTypeDb")).getSheet(movetype);
    }
}
