package com.cwt.oldgame;

import com.cwt.game.tools.ByteMap;
import com.cwt.oldgame.tools.DataStorage;
import com.cwt.oldgame.tools.FileStorage;
import com.cwt.oldgame.tools.GraphicStorage;
import com.cwt.oldgame.tools.MapStorage;
import com.cwt.oldgame.tools.TagStorage;
import com.jslix.debug.NotifyLibrary;
import com.jslix.image.ImgLibrary;

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
 * @version 12.08.11
 */

public class PixAnimate {

    /** The default base size for all tiles */
    public static final int BASE = 32;

    /** Holds map storage data */
    private static MapList mapStore = new MapList();
    /** This holds scaled images */
    private static ImgLibrary storedImg = new ImgLibrary();
    /** This converts image data to byte data */
    private static ByteMap converter = new ByteMap();
    /** This holds all the byte data conversion for images */
    private static ArrayList<Integer> imgList = new ArrayList<Integer>();
    /** Holds map lists used by Map Editor */
    private static MapStorage mapStorage;
    /** Holds the scale factor of the images */
    private static double scale = 1.0;
    /** Holds a temporary x-axis location */
    private static int locx;
    /** Holds a temporary y-axis location */
    private static int locy;
    /** Holds a temporary tile width */
    private static int tsx;
    /** Holds a temporary tile height */
    private static int tsy;
    /** Holds a temporary x-axis size */
    private static int sizex;
    /** Holds a temporary y-axis size */
    private static int sizey;

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
        locx = mapStore.getFileData().getData(temp[0], FileStorage.LOCX);
        locy = mapStore.getFileData().getData(temp[0], FileStorage.LOCY);
        sizex = mapStore.getFileData().getData(temp[0], FileStorage.SIZEX);
        sizey = mapStore.getFileData().getData(temp[0], FileStorage.SIZEY);
        tsx = mapStore.getFileData().getData(temp[0], FileStorage.TSIZEX);
        tsy = mapStore.getFileData().getData(temp[0], FileStorage.TSIZEY);
        parseImg.addImage(0, mapStore.getFileData().getFile(temp[0]));

        //Fixes the default values
        locx = (locx < 0) ? 0 : locx;
        locy = (locy < 0) ? 0 : locy;
        sizex = (sizex < 0) ? BASE : sizex;
        sizey = (sizey < 0) ? BASE : sizey;
        tsx = (tsx < 0) ? 1 : tsx;
        tsy = (tsy < 0) ? 1 : tsy;

        //Scales the image
        storedImg.setImageSize((int)(sizex*(BASE/(double)sizex)*tsx*scale),
            (int)(sizey*(BASE/(double)sizex)*tsy*scale));

        //Stores the image
        imgList.add(converter.getCompact());
        storedImg.addImage(parseImg.getImage(0, locx, locy, sizex, sizey));
        System.out.println("("+storedImg.getX(0)+","+
                storedImg.getY(0)+")");
    }

    /**
     * This function sets the scale factor for the drawn objects
     * @param tileSize The pixel length of one side of a tile
     */
    public static void setScale(int tileSize){
        scale = tileSize/BASE;
    }

    /**
     * This function gives you the relative scale factor of currently
     * drawn tiles from the base size
     * @return The current scale factor of currently drawn tiles
     */
    public static double getScale(){
        return scale;
    }

    /**
     * This function gives you a copy of all the objects stored in memory
     * and their locations in the form of a class.
     * @return The class containing every map object
     */
    public static MapList getMapData(){
        return isReady() ? mapStore : null;
    }

    /**
     * This function updates you when all objects are loaded into memory
     * @return Whether all object are loaded(T) or not(F)
     */
    public static boolean isReady(){
        return mapStore.isReady();
    }

     /**
     * This function sets the matching integer used for the code segment
     * @param code The code segment to match for this list
     */
    public static void setCode(int code){
        mapStore.setCode(code);
    }

    /**
     * This function sets the matching text used for the base segment
     * @param base The base segment to match for this list
     */
    public static void setBase(String base){
        mapStore.setBase(base);
    }

    /**
     * This function sets the matching text used for the type segment
     * @param type The type segment to match for this list
     */
    public static void setType(String type){
        mapStore.setType(type);
    }

    /**
     * This function sets the matching integer used for the weather segment
     * @param weather The weather segment to match for this list
     */
    public static void setWeather(int weather){
        mapStore.setWeather(weather);
    }

    /**
     * This function sets the matching integer used for the size segment
     * @param size The size segment to match for this list
     */
    public static void setSize(int size){
        mapStore.setSize(size);
    }

    /**
     * This function sets the matching integer used for the direction segment
     * @param direction The direction segment to match for this list
     */
    public static void setDirection(int direction){
        mapStore.setDirection(direction);
    }

    /**
     * This function sets the matching text used for the army segment
     * @param army The army segment to match for this list
     */
    public static void setArmy(String faction){
        mapStore.setArmy(faction);
    }

    /**
     * This function sets the matching text used for the tag segment
     * @param type The type slot to drop the tag text into
     * @param tag The string representation of the current tag
     */
    public static void setTag(String type, String tag){
        mapStore.setTag(type, tag);
    }

    /**
     * This function resets all the data to the defaults
     */
    public static void resetDefault(){
        mapStore.reset();
    }

    /**
     * This function takes all object variables within the MapList and
     * sorts them according to the parameters set within the function
     * of the class
     * @return A sorted list containing only items within the parameters set
     */
    public static int[] getList(){
        return mapStore.list();
    }

    /**
     * This function adds animations to the matching process
     */
    public static void addAnimation(){
        mapStore.addAnimation();
    }

    /**
     * This function adds random tiles to the matching process
     */
    public static void addRandom(){
        mapStore.addRandom();
    }

    /**
     * This function gets the terrain list of the objects
     * @return The terrain list
     */
    public static int[] getTerrain(){
        if(mapStorage == null)
            mapStorage = new MapStorage();
        return mapStorage.getTerrain();
    }

    /**
     * This function gets the terrain list of the objects
     * @return The cursor list
     */
    public static int[] getCursor(){
        if(mapStorage == null)
            mapStorage = new MapStorage();
        return mapStorage.getCursor();
    }

    //-------------------------------
    //TEST FUNCTIONS
    //-------------------------------

    /**
     * This gets data from the data element of the MapElement
     */
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
            if(mapStore.getTagData().getTags(temp[0], TagStorage.O).length != 0)
                System.out.println("TAGS:"+mapStore.getTagData().
                    getTags(temp[0], TagStorage.O)[0]);
            System.out.println("-----------------------------------------");
        }
    }

    /**
     * This gets data from the tag element of MapElement
     */
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
