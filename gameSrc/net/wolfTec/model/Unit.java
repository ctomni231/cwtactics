package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.database.UnitType;
import net.wolfTec.utility.Assert;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt")
public class Unit {

    public int hp;
    public int ammo;
    public int fuel;
    public boolean hidden;
    public boolean canAct;

    public Unit loadedIn = null;
    public UnitType type = null;
    public Player owner;

    /**
     *
     * @param type
     */
    public void initByType (UnitType type) {
        this.type = type;
        this.hp = 99;
        this.ammo = type.ammo;
        this.fuel = type.fuel;
        this.hidden = false;
        this.loadedIn = null;
        this.canAct = false;
    }

    /**
     *
     * @return {boolean}
     */
    public boolean isInactive () {
        return this.owner == null;
    }

    /**
     * Damages a unit.
     *
     * @param damage
     * @param minRest
     */
    public void takeDamage (int damage, int minRest) {
        Assert.greaterEquals(damage, 1);
        Assert.greaterEquals(damage, 0);

        this.hp -= damage;
        if (this.hp < minRest) this.hp = minRest;
    }

    /**
     * Heals an unit. If the unit health will be greater than the maximum health value then the difference will be
     * added as gold to the owners gold depot.
     *
     * @param health
     * @param diffAsGold
     */
    public void heal (int health, boolean diffAsGold) {
        this.hp += health;
        if (this.hp > 99) {

            // pay difference of the result health and 100 as
            // gold ( in relation to the unit cost ) to the
            // unit owners gold depot
            if (diffAsGold == true) {
                int diff = this.hp - 99;
                this.owner.gold += parseInt((this.type.cost * diff) / 100, 10);
            }

            this.hp = 99;
        }
    }

    /**
     * @return {boolean} true when hp is greater than 0 else false
     */
    public boolean isAlive () {
        return this.hp > 0;
    }

    /**
     * Returns true when the unit ammo is lower equals 25%.
     *
     * @return {boolean}
     */
    public boolean hasLowAmmo () {
        int cAmmo = this.ammo;
        int mAmmo = this.type.ammo;
        if (mAmmo != 0 && cAmmo <= (mAmmo * 0.25)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns true when the unit fuel is lower equals 25%.
     *
     * @return {boolean}
     */
    public boolean hasLowFuel () {
        int cFuel = this.fuel;
        int mFuel = this.type.fuel;
        if (cFuel <= (mFuel * 0.25)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * @returns {boolean}
     */
    public boolean isCapturing () {
        if (this.loadedIn != null) {
            return false;
        }

        return false;
        /*
         if( unit.x >= 0 ){
         var property = model.property_posMap[ unit.x ][ unit.y ];
         if( property !== null && property.capturePoints < 20 ){
         unitStatus.CAPTURES = true;
         }
         else unitStatus.CAPTURES = false;
         } */
    }

    public void setActable (boolean value) {
        this.canAct = value;
    }

}
