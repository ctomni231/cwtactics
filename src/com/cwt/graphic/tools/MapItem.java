package com.cwt.graphic.tools;

/*
 * MapItem.java
 *
 * This holds the Map Information needed to draw a map to the screen
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 08.29.11
 */
public class MapItem {

    /** This holds the terrain graphic data for the map */
    public int terrain;
    /** This holds the FOW graphic data for the map */
    public int blank;
    /** This holds the connection graphic data for the map */
    public int connect;
    /** This holds the unit graphic data for the map */
    public int unit;
    /** This holds whether this item needs to be edited */
    public boolean change;

    /**
     * This class stores all the items needed to draw tiles within the map.
     */
    public MapItem(){
        change = true;
        terrain = -1;
        blank = -1;
        connect = -1;
        unit = -1;
    }
}
