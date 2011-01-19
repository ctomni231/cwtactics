package com.cwt.map;

import java.util.HashMap;

/**
 * HashStore.java
 *
 * This class organizes and stores data for the map system. This class stores
 * String data in a reference key system that allows the minimal amount of
 * String data to be stored in memory.
 *
 * (This class is the HashMap version of the ListStore class)
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.18.11
 */
public class HashStore {

    private HashMap<Integer, String> dataItems;//The String HashMap
    private int counter;//A counter to store the indexes of the HashMap

    /**
     * This class takes String objects and organizes them in a reference
     */
    public HashStore(){
        dataItems = new HashMap<Integer, String>();
        counter = 0;
    }

    /**
     * This function adds data to the items
     * @param data The data to be stored to the reference
     */
    public void addData(String data){
        if(!dataItems.containsValue(data))
            dataItems.put(counter++, data);
    }

    /**
     * This function returns a String from an index
     * @param index The number representing the data
     * @return A string representing the index
     */
    public String getData(int index){
        return dataItems.containsKey(index) ? dataItems.get(index) : "";
    }

    /**
     * This function returns an index from a String pattern
     * @param data The String data you want to find in the list
     * @return A number representing the String data
     */
    public int getData(String data){
        for(int i = 0; i < dataItems.size(); i++){
            if(dataItems.get(i).equals(data))
                return i;
        }
        return -1;
    }
}
