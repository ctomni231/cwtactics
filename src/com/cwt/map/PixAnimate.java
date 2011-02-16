package com.cwt.map;

import com.cwt.map.io.DataStorage;
import com.cwt.map.io.FileStorage;
import com.cwt.map.io.GraphicStorage;
import com.cwt.map.io.TagStorage;
import java.awt.Color;

/**
 * PixAnimate.java
 *
 * This class turns MapElement data into images and helps regulate the
 * animations for those images. This also works on scaling the images and
 * allows map data to be statically gathered.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.15.11
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
            int temp[] = mapStore.getArray(i, MapElement.DATA);
            System.out.println(
                    "NAME:"+mapStore.getData().getData(temp[0], DataStorage.NAME)+
                    "\nBASE:"+mapStore.getData().getData(temp[0], DataStorage.BASE)+
                    "\nTYPE:"+mapStore.getData().getData(temp[0], DataStorage.TYPE));
            temp = mapStore.getArray(i, MapElement.GRAPHIC);
            System.out.println(
                    "WEATHER:"+mapStore.getGraphicData().getData(temp[0], GraphicStorage.WEATHER)+
                    "\nDIRECTION:"+mapStore.getGraphicData().getData(temp[0], GraphicStorage.DIRECTION)+
                    "\nARMY:"+mapStore.getGraphicData().getData(temp[0], GraphicStorage.ARMY)+
                    "\nSIZE:"+mapStore.getGraphicData().getData(temp[0], GraphicStorage.SIZE));
            temp = mapStore.getArray(i, MapElement.FILE);
            System.out.println(
                "FILE:"+mapStore.getFileData().getFile(temp[0])+
                "\nX:"+mapStore.getFileData().getData(temp[0], FileStorage.LOCX)+
                "\nY:"+mapStore.getFileData().getData(temp[0], FileStorage.LOCY)+
                "\nSX:"+mapStore.getFileData().getData(temp[0], FileStorage.SIZEX)+
                "\nSY:"+mapStore.getFileData().getData(temp[0], FileStorage.SIZEY)+
                "\nTX:"+mapStore.getFileData().getData(temp[0], FileStorage.TSIZEX)+
                "\nTY:"+mapStore.getFileData().getData(temp[0], FileStorage.TSIZEY));
            temp = mapStore.getArray(i, MapElement.TAGS);
            System.out.println("TAGS:"+mapStore.getTagData().
                    getTags(temp[0], TagStorage.O)[0]);
            System.out.println("-----------------------------------------");
        }
    }

    public static void getTags(){
        for(int i = 0; i < mapStore.size(); i++){
            int temp[] = mapStore.getArray(i, MapElement.DATA);
            System.out.println(
                "NAME:"+mapStore.getData().getData(temp[0], DataStorage.NAME)+
                "\nBASE:"+mapStore.getData().getData(temp[0], DataStorage.BASE)+
                "\nTYPE:"+mapStore.getData().getData(temp[0], DataStorage.TYPE));
            temp = mapStore.getArray(i, MapElement.COLOR);
            if(temp.length > 0){
                for(int data: mapStore.getColorData().getData(temp[0]))
                    System.out.println(new Color(data).toString());
            }
            System.out.println("-----------------------------------------");
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
