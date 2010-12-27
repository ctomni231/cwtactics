package com.customwarsTactics.model.cards;

import com.customwarsTactics.model.mapObjects.Tile;
import java.util.ArrayList;

/**
 * Range card, holds a set of tiles that can be attacked by an unit.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class RangeCard
{
    private ArrayList<Tile> inRange;

    public RangeCard()
    {
        inRange = new ArrayList<Tile>();
    }

    /**
     * @return the inRange
     */
    public final ArrayList<Tile> getInRange()
    {
        return inRange;
    }

    /**
     * @param tile tile instance
     * @return returns true if the tile instance is in the range card, else false
     */
    public final boolean isInRange( Tile tile )
    {
        assert tile != null;

        return inRange.contains(tile);
    }
}
