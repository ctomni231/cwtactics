package com.cwt.model.cards;

import com.cwt.model.mapObjects.Tile;
import com.cwt.system.objectPool.ObjectPool;

/**
 * Battle card, represents a possible battle between an attacker and a
 * defender.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class MoveObjectCard
{

    private Tile tile;
    private int cost;

    /**
     * @return the tile
     */
    public final Tile getTile()
    {
        return tile;
    }

    /**
     * @param tile the tile to set
     */
    public final void setTile(Tile tile)
    {
        this.tile = tile;
    }

    /**
     * @return the cost
     */
    public final int getCost()
    {
        return cost;
    }

    /**
     * @param cost the cost to set
     */
    public final void setCost(int cost)
    {
        this.cost = cost;
    }
    
    /**
     * Factory singleton as service to acquire and release battle card instances.
     */
    public static class MoveObjectCardPool extends ObjectPool<MoveObjectCard>
    {

        // singleton instance
        private static final MoveObjectCardPool INSTANCE = new MoveObjectCardPool();

        @Override
        protected final MoveObjectCard recycleInstance(MoveObjectCard obj)
        {
            obj.setTile(null);
            obj.setCost(0);

            return obj;
        }

        @Override
        protected final MoveObjectCard createInstance()
        {
            return( new MoveObjectCard() );
        }

        /**
         * Retuns the singleton instance of the singleton class.
         */
        public static MoveObjectCardPool getInstance() {
            return MoveObjectCardPool.INSTANCE;
        }
    }
}
