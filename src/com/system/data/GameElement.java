package com.system.data;

/**
 * GameElement.java
 *
 * This class allows the map data to be statically gathered.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.17.10
 */

public class GameElement {

    private static MapElement mapStore = new MapElement();

    public static void initialize(boolean isApplet){
        mapStore.setApplet(isApplet);
        mapStore.decode();
    }
}
