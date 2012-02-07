package com.cwt.map.io;

import com.cwt.io.LangControl;
import java.util.Arrays;
import java.util.HashMap;
import static com.yasl.logging.Logging.*;

/**
 * DataStorage.java
 *
 * This class stores data for the data code portion of the XML file.
 * The CWT graphic mainframe depends on this class to organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.15.11
 */
public class DataStorage {

    /** Holds the name reference to this object */
    public static final byte NAME = 0;
    /** Holds the object grouping type */
    public static final byte BASE = 1;
    /** Holds which game this object belongs to */
    public static final byte TYPE = 2;

    /** Stores the items in an integer format */
    private KeyStore[] locItems;
    /** Stores the textual portion of the items */
    private ListStore[] dataItems;
    /** Stores references for the data items */
    private RefStore refItems;
    /** Helps conversion of the language for items */
    private LangControl locale;

    /** A temporary value for storing the items */
    private KeyStore tempKey;

    /**
     * This class takes the data section of the XML file and stores them
     * in an easy to extract format. It is used specifically for showing
     * and displaying graphics.
     */
    public DataStorage(){
        refItems = new RefStore();
        locale = new LangControl();
        refItems.add("NAM.*", NAME);
        refItems.add("BAS.*", BASE);
        refItems.add("TYP.*", TYPE);
        increaseIndex(refItems.size());
    }

    /**
     * This function sets the language path for the conversion of the
     * String objects
     * @param path The path to the language properties file
     */
    public void setLanguage(String path){
        if(locale.exists(path))
            locale.getBundle(path);
    }

    /**
     * This adds an item to the data section and stores it into an array
     * @param fillData The data where all the data items are stored
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
                    warn("Data key '"+key+"' not recognized!");
                    break;
                default:
                    tempKey.addData(temp, dataItems[temp].addData(
                            locale.getText(fillData.get(key))));
            }
        }

        return (tempKey.getData().length > 0) ? checkData() : -1;
    }

    /**
     * This gets the textual references of the items you specify
     * @param index The index of the item to retrieve
     * @param item The item name of the textual data
     * @return A String representation of the index
     */
    public String getData(int index, byte item){
        return (index >= 0 && index < locItems.length) ?
            dataItems[item].getData(locItems[index].getData(item)) : "";
    }

    /**
     * This checks the graphic data against the current data before
     * storing it as new data. This is used just for saving memory.
     * @return The index where this data is found
     */
    private int checkData(){
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

    /**
     * This function increases the ListStore indexes until it reaches the
     * index
     * @param index The number to increase the index to
     */
    private void increaseIndex(int index){
        if(dataItems == null)
            dataItems = addData(dataItems, new ListStore());

        while(dataItems.length < index)
            dataItems = addData(dataItems, new ListStore());
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private ListStore[] addData(ListStore[] fillData, ListStore data){
        if(fillData == null)
            fillData = new ListStore[0];

        ListStore[] temp = fillData;
        fillData = new ListStore[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
