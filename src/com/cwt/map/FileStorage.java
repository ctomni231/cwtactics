package com.cwt.map;

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
 * @version 01.25.11
 */
public class FileStorage{

    public final byte PATH = 0;//The path to the graphic file
    public final byte LOCX = 1;//The x-axis pixel location to start in the file
    public final byte LOCY = 2;//The y-axis pixel location to start in the file
    public final byte SIZEX = 3;//The x-axis pixel length to cut
    public final byte SIZEY = 4;//The y-axis pixel length to cut
    public final byte TSIZEX = 5;//The number of tiles it takes for x-axis
    public final byte TSIZEY = 6;//The number of tiles it takes for y-axis
    public final byte FLIP = 7;//Special flipping and rotating instructions

    private KeyStore[] locItems;//Stores the items in an integer format
    private ListStore fileItems;//Stores the textual portion of the items
    private RefStore refItems;//Stores references for the file items

    private KeyStore tempKey;//A temporary value for storing the items

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
                    tempKey.addData(PATH, fileItems.addData(key));
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
