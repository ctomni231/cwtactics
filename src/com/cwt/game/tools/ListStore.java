package com.cwt.game.tools;

/**
 * ListStore.java
 *
 * This class organizes and stores data for the map system. This class stores
 * String data in a reference key system that allows the minimal amount of
 * String data to be stored in memory.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.18.11
 */
public class ListStore {

    /** This array stores all the Strings */
    private String[] dataItems;

    /**
     * This class takes String objects and organizes them in a reference
     */
    public ListStore(){
        dataItems = new String[0];
    }

    /**
     * This function adds data to the items
     * @param data The data to be stored to the reference
     */
    public void add(String data){
        if(!checkData(data))
            dataItems = addData(dataItems, data);
    }

    /**
     * This function adds data to the items
     * @param data The data to be stored to the reference
     * @return The index where this data was stored
     */
    public int addData(String data){
        if(!checkData(data)){
            dataItems = addData(dataItems, data);
            return dataItems.length-1;
        }
        return getData(data);
    }

    /**
     * This function returns a String from an index
     * @param index The number representing the data
     * @return A string representing the index
     */
    public String getData(int index){
        return (index >= 0 && index < dataItems.length) ?
            dataItems[index] : "";
    }

    /**
     * This function returns an index from a String pattern
     * @param data The String data you want to find in the list
     * @return A number representing the String data
     */
    public int getData(String data){
        for(int i = 0; i < dataItems.length; i++){
            if(dataItems[i].equals(data))
                return i;
        }
        return -1;
    }
    
    /**
     * This function returns a list of items in this Object
     * @return A list of items within this Object
     */
    public String[] getData(){
    	return dataItems;
    }

    /**
     * This function returns the amount of items within the list
     * @return The amount of items
     */
    public int size(){
        return dataItems.length;
    }

    /**
     * This function checks the data to make sure it isn't a duplicate
     * @param data The data to be stored to the reference
     * @return Whether the data exists(T) or not(F)
     */
    private boolean checkData(String data){
        for(int i = 0; i < dataItems.length; i++){
            if(dataItems[i].equals(data))
                return true;
        }
        return false;
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
