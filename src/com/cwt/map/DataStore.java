package com.cwt.map;

import java.util.Arrays;

/**
 * DataStore.java
 *
 * This class organizes and stores data for the map system. This class stores
 * data in a double integer array.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.28.11
 */
public class DataStore {

    private int[][] dataItems;//This holds the group of integer data
    private boolean backtrack;//This holds how data is stored in the array

    /**
     * This class organizes a double integer array for storage and easy
     * retrieval
     */
    public DataStore(){
        dataItems = new int[0][];
        backtrack = true;
    }

    /**
     * This adds a new Layer to add data to
     * @return The layer index
     */
    public int addNewLayer(){
        if(dataItems == null)
            dataItems = addBranch(dataItems);
        else if(dataItems[dataItems.length - 1].length > 0)
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
     * This function adds an array of data to the layer you specify
     * @param data The data to add to the indexed layer
     * @return The layer index
     */
    public int addData(int[] data){
        if(data == null)
            return -1;
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
        if(backtrack && index >= 0 && index < dataItems.length)
            dataItems[index] = addData(dataItems[index], data);
        return index;
    }

    /**
     * This function adds an array of data to the layer you specify
     * @param index The layer to add the data to
     * @param data The data to add to the indexed layer
     * @return The layer index
     */
    public int addData(int index, int[] data){
        if(data != null){
            if(backtrack && index >= 0 && index < dataItems.length){
                for(int i = 0; i < data.length; i++)
                    dataItems[index] = addData(dataItems[index], data[i]);
            }
        }
        return index;
    }

    /**
     * This function acts like an add data command, but only if the data array
     * is present within the current array. If the data exists, it returns
     * the index matching the current array instead. This function will
     * disable you from adding data by index.
     * @param data The data to check or add to the database
     * @return The layer index
     */
    public int addRefData(int[] data){
        if(data == null)
            return -1;
        if(backtrack)
            backtrack = false;

        if(dataItems == null)
            addNewLayer();
        else if(dataItems[dataItems.length - 1].length > 0)
            addNewLayer();

        for(int i = 0; i < dataItems.length; i++){
            if(Arrays.equals(dataItems[i], data))
                return i;
        }

        return addData(data);
    }

    /**
     * This function acts like an add data command, but only if the current
     * data is present within the previous members array. If the data in the
     * current array exists, it returns the index matching the previous
     * member it matches instead. This function will disable you from adding
     * data by index.
     * @return A layer index matching the last inputted array
     */
    public int addRefData(){
        if(dataItems.length == 0)
            return 0;
        int[] temp = dataItems[dataItems.length-1];
        clearCurrent();
        return addRefData(temp);
    }

    /**
     * This clears the current layer of all data items
     */
    public void clearCurrent(){
        dataItems[dataItems.length-1] = new int[0];
    }

    /**
     * This function gets the amount of items stored in this class
     * @return The amount of indices in this class
     */
    public int size(){
        return (dataItems != null) ? dataItems.length : 0;
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
