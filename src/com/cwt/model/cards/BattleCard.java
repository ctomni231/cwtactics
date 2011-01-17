package com.cwt.model.cards;

import com.cwt.system.ObjectPool;

/**
 * Battle card, represents a possible battle between an attacker and a
 * defender.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class BattleCard
{

    private String defenderID;
    private int attackDamage;
    private int counterDamage;

    /**
     * @return the defenderID
     */
    public final String getDefenderID()
    {
        return defenderID;
    }

    /**
     * @param defenderID the defenderID to set
     */
    public final void setDefenderID( String defenderID)
    {
        this.defenderID = defenderID;
    }

    /**
     * @return the attackDamage
     */
    public final int getAttackDamage()
    {
        return attackDamage;
    }

    /**
     * @param attackDamage the attackDamage to set
     */
    public final void setAttackDamage(int attackDamage)
    {
        this.attackDamage = attackDamage;
    }

    /**
     * @return the counterDamage
     */
    public final int getCounterDamage()
    {
        return counterDamage;
    }

    /**
     * @param counterDamage the counterDamage to set
     */
    public final void setCounterDamage(int counterDamage)
    {
        this.counterDamage = counterDamage;
    }

    
    /**
     * Factory singleton as service to acquire and release battle card instances.
     */
    public static class BattleCardPool extends ObjectPool<BattleCard>
    {

        // singleton instance
        private static final BattleCardPool INSTANCE = new BattleCardPool();

        @Override
        protected final BattleCard recycleInstance(BattleCard obj)
        {
            obj.setDefenderID( null );
            obj.setAttackDamage(0);
            obj.setCounterDamage(0);

            return obj;
        }

        @Override
        protected final BattleCard createInstance()
        {
            return( new BattleCard() );
        }

        /**
         * Retuns the singleton instance of the singleton class.
         */
        public static BattleCardPool getInstance() {
            return BattleCardPool.INSTANCE;
        }
    }
}
