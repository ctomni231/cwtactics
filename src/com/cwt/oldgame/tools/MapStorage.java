package com.cwt.oldgame.tools;

import com.cwt.oldgame.PixAnimate;

/**
 * MapStorage.java
 *
 * This class stores the objects for the map in a separate class for easy
 * access by the Map Editor and the Map Draw classes. It is an expansion
 * of the PixAnimate.java class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.04.11
 */
public class MapStorage {

    /** Holds a terrain list of the last parameter group */
    private int[] terrain;
    /** Holds a cursor list of the last parameter group */
    private int[] cursor;

    /**
     * The Map Storage class creates lists of objects set by parameters.
     * It tries to create a list of objects for every code parameter.
     */
    public MapStorage(){
        initialize();
    }

    /**
     * This function gets a default generic list for each code.
     */
    public final void initialize(){
        PixAnimate.setCode(0);
        terrain = PixAnimate.getList();
        PixAnimate.setCode(4);
        cursor = PixAnimate.getList();
    }

    /**
     * This function gives you a list of terrain objects
     * @return A list of terrain objects
     */
    public int[] getTerrain(){
        return terrain;
    }

    /**
     * This function gives you a list of cursor objects
     * @return A list of cursor objects
     */
    public int[] getCursor(){
        return cursor;
    }
}
