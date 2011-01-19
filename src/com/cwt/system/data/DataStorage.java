package com.cwt.system.data;

/**
 * DataStorage.java
 *
 * This class organizes and stores data for the map system. This class is
 * the hub for tracking files read in from XML documents. If the calls
 * to this class is slow, a HashMap may be required for faster indexing.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.14.10
 */
public class DataStorage {

    public final int CODE = 0;//Holds the type of object this is
    public final int BASE = 1;//Holds the object grouping type
    public final int TYPE = 2;//Holds which game this object belongs to
    public final int WEATHER = 3;//Holds the weather type of the object
    public final int DIRECTION = 4;//Holds the direction of the object
    public final int ARMY = 5;//Holds which faction this object is part of
    public final int TAG_O = 6;//Holds the default place tag of this object
    public final int TAG_OL = 7;//Holds the tile this object overlaps
    public final int TAG_N = 8;//Holds the valid connection for North
    public final int TAG_NR = 9;//Holds the rejected connection for North
    public final int TAG_NE = 10;//Holds the valid connection for Northeast
    public final int TAG_NW = 11;//Holds the valid connection for Northwest
    public final int TAG_S = 12;//Holds the valid connection for South
    public final int TAG_SR = 13;//Holds the rejected connection for South
    public final int TAG_SE = 14;//Holds the valid connection for Southeast
    public final int TAG_SW = 15;//Holds the valid connection for Southwest
    public final int TAG_E = 16;//Holds the valid connection for East
    public final int TAG_ER = 17;//Holds the rejected connection for East
    public final int TAG_W = 18;//Holds the valid connection for West
    public final int TAG_WR = 19;//Holds the rejected connection for West
    public final int FILE_LOC = 20;//Holds the file location of the object
    public final int XML_LOC = 21;//Holds teh XML tag location of the object
    public final int NAME = 22;//Holds the name of the object
    public final int RAND = 23;//Holds the random variables of the object
    public final int ANIM = 24;//Holds the amount of animations

    public final int MAX_DATA = 25;//Holds the amount of data entries

    private String[][] dataItems;//Stores all the data items in this class

    /**
     * This class organizes all data items in a library list format that
     * does not duplicate names. This class is used to store the naming for
     * objects in the system.
     */
    public DataStorage(){
        dataItems = new String[MAX_DATA][];
    }

    /**
     * This function adds data to the items
     * @param code The reference code to the item list
     * @param data The data to be stored to the reference
     */
    public void addData(int code, String data){
        if(code >= 0 && code < MAX_DATA){
            if(checkData(code, data))
                dataItems[code] = addData(dataItems[code], data);
        }
    }
    
    /**
     * This function returns a String from an index
     * @param code The reference code to the item list
     * @param index The number representing the data
     * @return A string representing the index
     */
    public String getData(int code, int index){
        if(code >= 0 && code < MAX_DATA){
            if(index >= 0 && index < dataItems[code].length)
                return dataItems[code][index];
        }
        return "";
    }
    
    /**
     * This function returns an index from a String pattern
     * @param code The reference code to the item list
     * @param data The String data you want to find in the list
     * @return A number representing the String data
     */
    public int getData(int code, String data){
        if(dataItems[code] != null){
            for(int i = 0; i < dataItems[code].length; i++){
                if(dataItems[code][i].equals(data))
                    return i;
            }
        }
        return -1;
    }

    /**
     * This function checks the data to make sure it isn't a duplicate
     * @param code The reference code to the item list
     * @param data THe data to be stored to the reference
     * @return Whether the data exists(F) or not (T)
     */
    private boolean checkData(int code, String data){
        if(dataItems[code] != null){
            for(int i = 0; i < dataItems[code].length; i++){
                if(dataItems[code][i].equals(data))
                    return false;
            }
        }
        return true;
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private String[] addData(String[] fillData, String data){
        if(fillData == null)
            fillData = new String[0];

        String[] temp = fillData;
        fillData = new String[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
