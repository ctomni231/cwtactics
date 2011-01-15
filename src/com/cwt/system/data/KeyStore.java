package com.cwt.system.data;

/**
 * KeyStore.java
 *
 * This class organizes and stores data for the map system. This class uses
 * integers to organize data in an expandable array using a base 2 reference.
 * Its design was created to reduce the amount of space used for data storage.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.14.10
 */
public class KeyStore {

    private int[] data;

    public KeyStore(){
        data = new int[0];
    }

    public void addData(int index, int data){
        
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

}
