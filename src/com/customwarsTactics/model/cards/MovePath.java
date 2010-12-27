package com.customwarsTactics.model.cards;

import com.customwarsTactics.model.mapObjects.Tile;
import java.util.ArrayList;

/**
 * Holds a set of tiles connected to a path.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class MovePath
{
    private ArrayList<Tile> movePath;
    private int leftPoints; //TODO not complete yet

    public MovePath()
    {
        movePath = new ArrayList<Tile>();
    }

    /**
     * @return returns an arraylist with the tiles that represents the move path
     */
    public final ArrayList<Tile> getPath()
    {
        return movePath;
    }

    /**
     * Clears the move path.
     */
    public final void clearPath()
    {
        movePath.clear();
    }

    /**
     * Adds a tile to the move path.
     *
     * @param tile tile instance
     */
    public final void addTileToPath( Tile tile )
    {
        assert tile != null;
        assert !movePath.contains(tile);

        movePath.add(tile);
    }

    /**
     * Cuts the rest of a path from a given tile ( inclusive ).
     *
     * @param tile tile instance from that the path will be cutted
     */
    public final void cutPathFromTile( Tile tile )
    {
        assert tile != null;
        assert movePath.contains(tile);

        int index = movePath.size() - 1;
        while( true )
        {
            assert index >= 0;

            if( movePath.remove( index ) == tile )
                break;

            index--;
        }
    }
}
