package com.cwt.map;

import com.cwt.map.io.DataStorage;
import com.cwt.map.io.FileStorage;
import com.cwt.map.io.GraphicStorage;
import com.cwt.map.io.TagStorage;
import com.cwt.system.jslix.NotifyLibrary;
import com.cwt.system.jslix.tools.ImgLibrary;
import java.awt.Color;
import java.util.ArrayList;
import org.newdawn.slick.Image;

/**
 * PixAnimate.java
 *
 * This class turns MapElement data into images and helps regulate the
 * animations for those images. This also works on scaling the images and
 * allows map data to be statically gathered.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 08.07.11
 */

public class PixAnimate {

    /**
     * This is the default base size for all tiles in the game 
     */
    private static final int BASE = 32;
    /**
     * This holds the map storage data for the class
     */
    private static MapList mapStore = new MapList();
    /**
     * This holds the scaled images for drawing to the screen
     */
    private static ImgLibrary storedImg = new ImgLibrary();
    /**
     * This converts image storage data into byte data
     */
    private static ByteMap converter = new ByteMap();
    /**
     * This holds the byte data conversions for the stored Images
     */
    private static ArrayList<Integer> imgList = new ArrayList<Integer>();
    /**
     * This holds the scale factor of the images
     */
    private static double scale = 1.0;

    /**
     * This function initializes the game elements including the music
     * and the map objects
     * @param isApplet Stores whether this screen is a frame or applet
     */
    public static void initialize(boolean isApplet){
        mapStore.setApplet(isApplet);
        mapStore.decode();
        NotifyLibrary.setJustify(true);
        NotifyLibrary.setFlow(true);
    }

    /**
     * This function gets an image from the MapElement list of images using
     * the parameters specified
     * @param index The index location of the image
     * @param player The player color of this image object
     * @param direction The facing direction of this image object
     * @return An Java representation of the image
     */
    public static java.awt.Image getImage(int index,
            int player, int direction){
        storeImage(index, player, direction);
        return storedImg.getImage(imgList.indexOf(converter.getCompact()));
    }

    /**
     * This function gets an image from the MapElement list of images using
     * the parameters specified
     * @param index The index location of the image
     * @param player The player color of this image object
     * @param direction The facing direction of this image object
     * @return A Slick representation of the image
     */
    public static Image getSlickImage(int index, int player, int direction){
        storeImage(index, player, direction);
        return storedImg.getSlickImage(
                imgList.indexOf(converter.getCompact()));
    }

    /**
     * This function stores a scaled image in the image library
     * @param index The index of the image in the MapElement storage
     * @param player The player color of this object
     * @param direction The direction this object is facing
     */
    private static void storeImage(int index, int player, int direction){
        converter.clear();
        converter.addShort(0, index);
        converter.addByte(2, player);
        converter.addByte(3, direction);
        
        //If it exists, don't make new image
        if(imgList.contains(converter.getCompact()))  return;

        //Gets the image
        ImgLibrary parseImg = new ImgLibrary();
        int[] temp = mapStore.getArray(index, MapElement.FILE);
        int sizex = mapStore.getFileData().getData(temp[0], FileStorage.SIZEX);
        int sizey = mapStore.getFileData().getData(temp[0], FileStorage.SIZEY);
        parseImg.addImage(0, mapStore.getFileData().getFile(temp[0]));

        //Scales the image
        storedImg.setImageSize((int)(sizex*(BASE/(double)sizex)*mapStore.
            getFileData().getData(temp[0], FileStorage.TSIZEX)*scale),
            (int)(sizey*(BASE/(double)sizex)*mapStore.getFileData().
            getData(temp[0], FileStorage.TSIZEY)*scale));

        //Stores the image
        imgList.add(converter.getCompact());
        storedImg.addImage(parseImg.getImage(0, mapStore.getFileData().
            getData(temp[0], FileStorage.LOCX), mapStore.getFileData().
            getData(temp[0], FileStorage.LOCY), sizex, sizey));
    }

    /**
     * This function updates you when all objects are loaded into memory
     * @return Whether all object are loaded(T) or not(F)
     */
    public static boolean isReady(){
        return mapStore.isReady();
    }

    //-------------------------------
    //TEST FUNCTIONS
    //-------------------------------
    public static void getData(){
        for(int i = 0; i < mapStore.size(); i++){
            int temp[] = mapStore.getArray(i, MapElement.DATA);
            NotifyLibrary.addMessage("NAME:"+mapStore.getData().getData(temp[0], DataStorage.NAME),
                30);
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
            NotifyLibrary.addMessage("NAME:"+mapStore.getData().getData(temp[0], DataStorage.NAME),
                30);
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
}
