package com.cwt.map.io;

import java.util.Arrays;
import java.util.HashMap;
import static com.yasl.logging.Logging.*;

/**
 * GraphicStorage.java
 *
 * This class stores data for the graphic code portion of the XML file.
 * The CWT graphic mainframe depends on this class to organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.15.11
 */
public class GraphicStorage {

    public static final byte WEATHER = 0;//Holds the weather of this object
    public static final byte DIRECTION = 1;//Holds the direction of this object
    public static final byte ARMY = 2;//Holds the army faction of this object
    public static final byte SIZE = 3;//Holds the viewing size on an object

    private KeyStore[] locItems;//Stores the items in an integer format
    private ListStore[] graphicItems;//Stores the textual portion of the items
    private RefStore refItems;//Stores references for the graphic items

    private KeyStore tempKey;//A temporary value for storing the items

    /**
     * This class takes the graphic section of the XML file and stores them
     * in an easy to extract format. It is used specifically for showing
     * and displaying graphics.
     */
    public GraphicStorage(){
        refItems = new RefStore();
        refItems.add("WEA.*", WEATHER);
        refItems.add("DIR.*", DIRECTION);
        refItems.add(new String[]{"ARM.*","FAC.*"}, ARMY);
        refItems.add("SIZ.*", SIZE);
    }

    /**
     * This adds an item to the graphic section and stores it into an array
     * @param fillData The data where all the graphic items are stored
     * @return The index where this data was stored
     */
    public int addItem(HashMap<String, String> fillData) {
        tempKey = new KeyStore();
        int temp;

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);
            temp = refItems.get(key);
            increaseIndex(temp);

            switch(temp){
                case -1:
                    warn("Graphic key '"+key+"' not recognized!");
                    break;
                default:
                    tempKey.addData(temp, graphicItems[temp].addData(
                            fillData.get(key)));
                    break;
            }
        }
        return (tempKey.getData().length != 0) ? checkGraphic() : -1;
    }

    /**
     * This gets the textual references of the items you specify
     * @param index The index of the item to retrieve
     * @param item The item name of the textual data
     * @return A String representation of the index
     */
    public String getData(int index, byte item){
        return (index >= 0 && index < locItems.length) ?
            graphicItems[item].getData(locItems[index].getData(item)) : "";
    }

    /**
     * This checks the graphic data against the current data before
     * storing it as new data. This is used just for saving memory.
     * @return The index where this data is found
     */
    private int checkGraphic(){
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
        if(graphicItems == null)
            graphicItems = addData(graphicItems, new ListStore());

        while(graphicItems.length <= index)
            graphicItems = addData(graphicItems, new ListStore());
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
