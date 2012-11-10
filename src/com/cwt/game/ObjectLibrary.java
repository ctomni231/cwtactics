package com.cwt.game;

import com.cwt.io.XML_Reader;

/**
 * ObjectLibrary.java
 *
 * This class is meant to simplify the need for PixAnimate. It uses
 * images within the program to organize a library of object images
 * to use.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.31.12
 */

public class ObjectLibrary {

	/** The default base size for all tiles */
    public static final int BASE = 32;
    
    /** Holds map storage data */
    private static ObjectStorage objStore = new ObjectStorage();
    
    /**
     * This function initializes the game elements including the music
     * and the map objects
     * @param isApplet Stores whether this screen is a frame or applet
     */
    public static void initialize(boolean isApplet){ 	
        objStore.setApplet(isApplet);        
        objStore.decode();
    }
    
}
