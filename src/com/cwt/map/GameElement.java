package com.cwt.map;

import com.cwt.io.JukeBox;

/**
 * GameElement.java
 *
 * This class allows the map data to be statically gathered.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.09.11
 */

public class GameElement {

    /**
     * This holds the map storage data for the class
     */
    private static MapElement mapStore = new MapElement();

    /**
     * This function initializes the game elements including the music
     * and the map objects
     * @param isApplet Stores whether this screen is a frame or applet
     */
    public static void initialize(boolean isApplet){
        JukeBox.init();
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
