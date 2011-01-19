package com.cwt.map;

/**
 * DataStore.java
 *
 * This class organizes and stores data for the map system. This class stores
 * data in a double integer array.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.18.11
 */
public class DataStore {

    private int[][] dataItems;//This holds the group of integer data

    /**
     * This class organizes a double integer array for storage and easy
     * retrieval
     */
    public DataStore(){
        dataItems = new int[0][];
    }

    /**
     * This adds a new Layer to add data to
     * @return The layer index
     */
    public int addNewLayer(){
        dataItems = addBranch(dataItems);
        return dataItems.length-1;
    }

    /**
     * This adds data to the newest possible layer
     * @param data The data to add to the current layer
     * @return The layer index
     */
    public int addData(int data){
        if(dataItems == null)
            addNewLayer();
        return addData(dataItems.length-1, data);
    }

    /**
     * This adds data to the layer you specify
     * @param index The layer to add the data to
     * @param data The data to add to the indexed layer
     * @return The layer index
     */
    public int addData(int index, int data){
        if(index >= 0 && index < dataItems.length)
            dataItems[index] = addData(dataItems[index], data);
        return index;
    }

    /**
     * This clears the current layer of all data items
     */
    public void clearCurrent(){
        dataItems[dataItems.length-1] = new int[0];
    }

    /**
     * This function gets the data from the layers, if it is invalid you'll
     * get an empty array
     * @param index The index to pull the data from
     * @return An array representing the layer chosen in the index
     */
    public int[] getData(int index){
        return index >= 0 && index < dataItems.length ?
            dataItems[index] : new int[0];
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private int[] addData(int[] fillData, int data){
        if(fillData == null)
            fillData = new int[0];

        int[] temp = fillData;
        fillData = new int[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }

    /**
     * This adds an integer array to an array branch
     * @param fillData The data to add the integer array to
     * @return The new array with a new integer array appended
     */
    private int[][] addBranch(int[][] fillData){
        if(fillData == null)
            fillData = new int[0][];

        int[][] temp = fillData;
        fillData = new int[temp.length+1][];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = new int[0];

        return fillData;
    }
}
