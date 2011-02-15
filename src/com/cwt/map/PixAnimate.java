package com.cwt.map;

import com.cwt.map.io.TagStorage;

/**
 * PixAnimate.java
 *
 * This class turns MapElement data into images and helps regulate the
 * animations for those images. This also works on scaling the images and
 * allows map data to be statically gathered.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.14.11
 */

public class PixAnimate {

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
        mapStore.setApplet(isApplet);
        mapStore.decode();
    }

    public static void getData(){
        for(int i = 0; i < mapStore.size(); i++){
            int temp[] = mapStore.getArray(i, MapElement.FILE);
            System.out.println(
                    "FILE:"+mapStore.getFileData().getFile(temp[0]));
        }
    }

    public static void getTags(){
        for(int i = 0; i < mapStore.size(); i++){
            int temp[] = mapStore.getArray(i, MapElement.TAGS);
            System.out.println("TAGS:"+mapStore.getTagData().
                    getTags(temp[0], TagStorage.O)[0]);
        }
    }

    /**
     * This function updates you when all objects are loaded into memory
     * @return Whether all object are loaded(T) or not(F)
     */
    public static boolean isReady(){
        return mapStore.isReady();
    }
}
