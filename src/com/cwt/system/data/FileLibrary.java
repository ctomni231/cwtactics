package com.cwt.system.data;

/**
 * FileLibrary.java
 *
 * This class deals with checking the valid file entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.24.10
 */
public class FileLibrary {

    private String[] fileItems;
    private int[][] loc;

    public void addItem(String data){
        loc = addBranch(loc);
        int temp = checkData(data);
        if(temp != -1)
            fileItems = addData(fileItems, data);
        else
            temp = fileItems.length-1;
        loc[loc.length-1] = addData(loc[loc.length-1], temp);
    }

    /**
     * This function checks the data to make sure it isn't a duplicate
     * @param code The reference code to the item list
     * @param data The data to be stored to the reference
     * @return Whether the data exists(F) or not (T)
     */
    private int checkData(String data){
        if(fileItems != null){
            for(int i = 0; i < fileItems.length; i++){
                if(fileItems[i].equals(data))
                    return i;
            }
        }
        return -1;
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
