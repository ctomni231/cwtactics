package com.cwt.map;

/**
 * KeyStore.java
 *
 * This class organizes and stores data for the map system. This class uses
 * integers to organize data in an expandable array using a base 2 reference.
 * Its design was created to reduce the amount of space used for data storage.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.28.11
 */
public class KeyStore {

    public final int INT_SIZE = -2147483648;//Integer Max amount
    private int[] arrayData;//Stores the data in an array
    private int max;//The amount of data to store in this array

    /**
     * This function stores data in an expandable array headed with a key
     * value for indexing. It was made to make the most of the arrays by
     * storing only the data changes in an array.
     */
    public KeyStore(){
        arrayData = new int[0];
        max = 0;
    }

    /**
     * This function adds data to the array in the form of an integer. The
     * array always tries to store the least amount of data possible.
     * @param index The position to store the data
     * @param data The data to be stored
     */
    public void addData(int index, int data){
        if(index < 0 || index > 31)
            return;

        if(index >= max)
            max = index+1;

        addCode(index);
        if(index+1 >= max && !checkCode(index))
            arrayData = addData(arrayData, data);
        else
            arrayData = insertData(arrayData,
                    getCodePosition(index, arrayData[0])+1, data);
    }

    /**
     * This function replaces one integer in the array for another integer.
     * @param index The position to store the data
     * @param data The data to be stored
     */
    public void replaceData(int index, int data){
        if(checkCode(index))
            arrayData[getCodePosition(index, arrayData[0])+1] = data;
        else
            addData(index, data);
    }

    /**
     * This function gets an array containing data from the stored array.
     * Dummy value is put into the place of non-included array values.
     * @return An array containing the values of this storage array.
     */
    public int[] getData(){
        int[] list = new int[max];
        if(max > 0){
            for(int i = 0, counter = 0, number = arrayData[0]; i < max; i++){
                if(number >= Math.pow(2, 31-i)+INT_SIZE){
                    number -= Math.pow(2, 31-i);
                    counter++;
                    list[i] = arrayData[counter];
                }else
                    list[i] = -1;
            }
        }
        return list;
    }

    /**
     * This function gets data from the stored array using an index
     * @param index The index from where to get the data
     * @return The value representing the index
     */
    public int getData(int index){
        return (index >= 0 && index < max) ? getData()[index] : -1;
    }

    /**
     * This function checks the code to see if a particular item exists
     * @param index The position to check the validity of the data
     * @return Whether the data exists(true) or not(false)
     */
    public boolean checkCode(int index){
        if(arrayData == null)
            return false;
        else if(arrayData.length < 1)
            return false;
        return checkCode(index, arrayData[0]);
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

        //for(int i = 0; i < fillData.length; i++)
        //    System.out.println("DATA "+i+":"+fillData[i]);
        //System.out.println("ADD-------------------------------------");

        return fillData;
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This function allows you to push data in the middle of
     * an array.
     * @param fillData The data to add to a primitive array
     * @param index The position where to add data into the array
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

        //for(int i = 0; i < fillData.length; i++)
        //    System.out.println("DATA "+i+":"+fillData[i]);
        //System.out.println("INS "+index+":---------------------------------");

        return fillData;
    }

    /**
     * This function adds an index to the key, if it is valid
     * @param index The index to add to the key
     */
    private void addCode(int index){
        if(arrayData.length == 0)
            arrayData = new int[]{ -INT_SIZE };

        if(!checkCode(index, arrayData[0]))
            arrayData[0] += Math.pow(2, 31-index);
    }

    /**
     * This function takes the code portion of the data and checks if it
     * exists.
     * @param index The index to check if a number exists
     * @param number The number to check the particular index for
     * @return Whether the number exists in this list
     */
    private boolean checkCode(int index, int number){

        for(int i = 0; i < max; i++){
            if(i == index)
                return (number >= Math.pow(2, 31-i)+INT_SIZE);
            if(number >= Math.pow(2, 31-i)+INT_SIZE)
                number -= Math.pow(2, 31-i);
        }
        return false;
    }

    /**
     * This function gets the position of a certain code item in a key
     * @param index The index to check if the number exists
     * @param number The number to check the particular index for
     * @return Whether the number exists in this list
     */
    private int getCodePosition(int index, int number){      
        for(int counter = 0, i = 0; i < max; i++){
            if(i == index)
                return counter;
            if(number >= Math.pow(2, 31-i)+INT_SIZE){
                number -= Math.pow(2, 31-i);
                counter++;
            }
        }
        return -1;
    }
}
