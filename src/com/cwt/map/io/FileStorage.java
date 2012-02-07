package com.cwt.map.io;

import java.util.Arrays;
import java.util.HashMap;
import static com.yasl.logging.Logging.*;

/**
 * FileStorage.java
 *
 * This class deals with checking the valid file entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.15.11
 */
public class FileStorage{

    /** The path to the graphic file */
    public static final byte PATH = 0;
    /** The starting x-axis pixel location */
    public static final byte LOCX = 1;
    /** The starting y-axis pixel location */
    public static final byte LOCY = 2;
    /** The x-axis pixel length to cut */
    public static final byte SIZEX = 3;
    /** The y-axis pixel length to cut */
    public static final byte SIZEY = 4;
    /** The number of x-axis tiles */
    public static final byte TSIZEX = 5;
    /** The number of y-axis tiles */
    public static final byte TSIZEY = 6;
    /** Special flipping/rotating instructions */
    public static final byte FLIP = 7;

    /** Stores the items in an integer format */
    private KeyStore[] locItems;
    /** Stores the textual portion of the items */
    private ListStore fileItems;
    /** Stores references for the file items */
    private RefStore refItems;

    /** A temporary value for storing the items */
    private KeyStore tempKey;

    /**
     * This class takes the file section of the graphics and stores them
     * in an easy to extract format. It is used specifically for showing
     * and displaying graphics.
     */
    public FileStorage(){
        fileItems = new ListStore();
        refItems = new RefStore();
        refItems.add("P.*", PATH);
        refItems.add(new String[]{"L.*X","X"}, LOCX);
        refItems.add(new String[]{"L.*Y","Y"}, LOCY);
        refItems.add("S.*X", SIZEX);
        refItems.add("S.*Y", SIZEY);
        refItems.add("T.*X", TSIZEX);
        refItems.add("T.*Y", TSIZEY);
        refItems.add("F.*", FLIP);
    }

    /**
     * This adds an item to the file section and stores it into an array
     * @param fillData The data where all the file items are stored
     * @return The index where this data was stored
     */
    public int addItem(HashMap<String, String> fillData) {
        tempKey = new KeyStore();
        int temp;

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);
            temp = refItems.get(key);
            switch(temp){
                case -1:
                    warn("File key '"+key+"' not recognized!");
                    break;
                case PATH:
                    tempKey.addData(PATH, 
                            fileItems.addData(fillData.get(key)));
                    break;
                default:
                    tempKey.addData(temp, Integer.parseInt(fillData.get(key)));
            }
        }

        if(tempKey.getData(PATH) == -1)
            return -1;

        /*
        for(int i = 0; i < tempKey.getData().length; i++){
            if(i == 0)
                System.out.println("PATH:"+tempKey.getData()[i]);
            if(i == 1)
                System.out.println("LOCX:"+tempKey.getData()[i]);
            if(i == 2)
                System.out.println("LOCY:"+tempKey.getData()[i]);
            if(i == 3)
                System.out.println("SIZEX:"+tempKey.getData()[i]);
            if(i == 4)
                System.out.println("SIZEY:"+tempKey.getData()[i]);
            if(i == 5)
                System.out.println("TILESIZEX:"+tempKey.getData()[i]);
            if(i == 6)
                System.out.println("TILESIZEY:"+tempKey.getData()[i]);
            if(i == 7)
                System.out.println("FLIP:"+tempKey.getData()[i]);
        }
        System.out.println("FILE:---------------------------------");//*/
        
        return checkFile();
    }

    /**
     * This gets the file section of an item within the array
     * @param index The reference index of the file
     * @return The String representing the file
     */
    public String getFile(int index){
        return (getData(index, PATH) >= 0) ?
            fileItems.getData(getData(index, PATH)) : "";
    }

    /**
     * This gets a data from the section of the array of your choice
     * @param index The reference index of the item
     * @param item The byte representation of the item
     * @return An integer representing the data of the item
     */
    public int getData(int index, byte item){
        return (index >= 0 && index < locItems.length) ?
            locItems[index].getData(item) : -1;
    }

    /**
     * This checks the file against the current data before storing it as
     * new data. This is used just for saving memory.
     * @return The index where this data is found
     */
    private int checkFile(){
        if(locItems != null){
            for(int i = 0; i < locItems.length; i++){
                if(Arrays.equals(locItems[i].getData(), tempKey.getData()))
                    return i;
            }
        }
        locItems = addData(locItems, tempKey);
        return locItems.length-1;
    }

    /**
     * This holds the amount of file items within the class
     * @return The amount of file items
     */
    public int size(){
        return (locItems != null) ? locItems.length : 0;
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private KeyStore[] addData(KeyStore[] fillData, KeyStore data){
        if(fillData == null)
            fillData = new KeyStore[0];

        KeyStore[] temp = fillData;
        fillData = new KeyStore[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
