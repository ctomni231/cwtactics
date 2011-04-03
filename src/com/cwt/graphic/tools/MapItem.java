package com.cwt.graphic.tools;

/*
 * MapItem.java
 *
 * This holds the Map Information needed to draw a map to the screen
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 04.02.11
 */
public class MapItem {

    public int terrain;//This holds the terrain graphic data for the map
    public int blank;//This holds the FOW graphic data for the map
    public int connect;//This holds the connection graphic data for the map
    public int unit;//This holds the unit graphic data for the map
    public boolean change;//This holds whether this item needs to be edited

    /**
     * This class stores all the items needed to draw tiles within the map.
     */
    public MapItem(){
        change = true;
    }
}
