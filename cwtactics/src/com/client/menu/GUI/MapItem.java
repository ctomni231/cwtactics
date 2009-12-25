package com.client.menu.GUI;

import com.client.menu.GUI.tools.AnimStore;

/**
 * Holds data pertaining to Graphic portions of a map.
 * @author Crecen
 */
public class MapItem {
    public AnimStore terrain;
    public AnimStore blank;
    public AnimStore unit;
    public boolean change;

    public MapItem(){
        terrain = null;
        blank = null;
        unit = null;
        change = true;
    }
}
