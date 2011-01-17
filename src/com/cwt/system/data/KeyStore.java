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
 * @version 01.16.11
 * @todo TODO Working on completing the indexing for the class, work with
 * the data array instead of the current setup.
 */
public class KeyStore {

    public final int INT_SIZE = -2147483648;//Integer Max amount
    private int[] data;//Stores the data in an array
    private int max;//The amount of data to store in this array

    /**
     * This function stores data in an expandable array headed with a key
     * value for indexing. It was made to make the most of the arrays by
     * storing only the data changes in an array.
     */
    public KeyStore(){
        this(0);
    }

    /**
     * This function stores data in an expandable array headed with a key
     * value for indexing. It was made to make the most of the arrays by
     * storing only the data changes in an array.
     * @param maxData The amount of data to store in this array
     */
    public KeyStore(int maxData){
        data = new int[0];
        max = (maxData > 0 && maxData < 31) ? maxData : 31;
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

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This function allows you to push data in the middle of
     * an array.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private int[] insertData(int[] fillData, int index, int data){
        if(fillData == null)
            fillData = new int[0];

        if(index >= fillData.length)
            return addData(fillData, data);
        else if(index >= 0){
            int[] temp = fillData;
            fillData = new int[temp.length+1];
            for(int i = 0; i < fillData.length; i++)
                fillData[i] = (i <= index) ? temp[i] : temp[i-1];
            fillData[index] = data;
        }

        return fillData;
    }

    /**
     * This function adds an index to the key, if it is valid
     * @param @param index The index to add to the key
     * @param number The number to add the index to
     * @return The new number with the added key in it
     */
    private int addCode(int index, int number){
        if(index >= 0){
            if(!checkCode(index, number))
                number += Math.pow(2, index);
            if(number > 0)
                number += INT_SIZE;
        }
        return number;
    }

    /**
     * This function takes the code portion of the data and checks if it
     * exists.
     * @param index The index to check if a number exists
     * @param number The number in question
     * @return Whether the number exists in this list
     */
    private boolean checkCode(int index, int number){
        number -= INT_SIZE;
        for(int i = max; i >= 0; i--){
            if(i == index)
                return (number >= Math.pow(2, i));
            if(number >= Math.pow(2, i))
                number -= Math.pow(2, i);
        }

        return false;
    }

}
