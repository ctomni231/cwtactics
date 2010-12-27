package com.customwarsTactics.model.cards;

import java.util.ArrayList;

/**
 * Holds the complete map of move able tiles for an unit.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 27.12.2010
 */
public class MoveCard
{
    private ArrayList<MoveObjectCard> moveAble;

    // use able by effects
    private int freeTiles;

    public MoveCard()
    {
        moveAble = new ArrayList<MoveObjectCard>();
    }

    /**
     * @return the moveAble
     */
    public ArrayList<MoveObjectCard> getMoveAble()
    {
        return moveAble;
    }

    /**
     * @return the freeTiles
     */
    public int getFreeTiles()
    {
        return freeTiles;
    }

    /**
     * @param freeTiles the freeTiles to set
     */
    public void setFreeTiles(int freeTiles)
    {
        this.freeTiles = freeTiles;
    }


}
