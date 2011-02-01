package com.cwt.map.io;

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

    /**
     * This function updates you when all objects are loaded into memory
     * @return Whether all object are loaded(T) or not(F)
     */
    public static boolean isReady(){
        return mapStore.isReady();
    }
}
