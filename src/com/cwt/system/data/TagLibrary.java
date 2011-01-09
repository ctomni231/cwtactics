package com.cwt.system.data;

import java.util.HashMap;

/**
 * TagLibrary.java
 *
 * This class deals with checking the valid tag entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.06.11
 */
public class TagLibrary {

    public final int O = 0;
    public final int OL = 1;
    public final int N = 2;
    public final int S = 3;
    public final int E = 4;
    public final int W = 5;
    public final int NE = 6;
    public final int NW = 7;
    public final int SE = 8;
    public final int SW = 9;
    public final int NR = 10;
    public final int SR = 11;
    public final int ER = 12;
    public final int WR = 13;

    public final int ITEMS = 14;

    private String[] tagItems;
    private int[][][] loc;
    private int[][] tempLoc;

    public TagLibrary(){
        tempLoc = new int[ITEMS][];
    }

    public void addItem(HashMap<String, String> fillData){

        for(String key: fillData.keySet()){
            if(key.toUpperCase().equals("O"))
                tempLoc[O] = addData(tempLoc[O], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("OL"))
                tempLoc[OL] = addData(tempLoc[OL], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("N"))
                tempLoc[N] = addData(tempLoc[N], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("S"))
                tempLoc[S] = addData(tempLoc[S], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("E"))
                tempLoc[E] = addData(tempLoc[E], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("W"))
                tempLoc[W] = addData(tempLoc[W], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("NE"))
                tempLoc[NE] = addData(tempLoc[NE], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("NW"))
                tempLoc[NW] = addData(tempLoc[NW], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("SE"))
                tempLoc[SE] = addData(tempLoc[SE], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("SW"))
                tempLoc[SW] = addData(tempLoc[SW], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("NR"))
                tempLoc[NR] = addData(tempLoc[NR], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("SR"))
                tempLoc[SR] = addData(tempLoc[SR], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("ER"))
                tempLoc[ER] = addData(tempLoc[ER], addItem(fillData.get(key)));
            else if(key.toUpperCase().equals("WR"))
                tempLoc[WR] = addData(tempLoc[WR], addItem(fillData.get(key)));
        }
    }

    public int storeItem(){
        loc = addBranch(loc);
        loc[loc.length-1] = new int[0][1];

        for(int i = 0; i < ITEMS; i++){
            if(tempLoc[i] != null){
                loc[loc.length-1][0][0] = (int)Math.pow(2, i);
                loc[loc.length-1] = addData(loc[loc.length-1], tempLoc[i]);
            }
        }

        return loc.length-1;
    }

    public int addItem(String data){
        int temp = checkData(data);
        if(temp == -1)
            tagItems = addData(tagItems, data);
        else
            temp = tagItems.length-1;
        return temp;
    }
    
    /**
     * This function checks the data to make sure it isn't a duplicate
     * @param code The reference code to the item list
     * @param data The data to be stored to the reference
     * @return Whether the data exists(F) or not (T)
     */
    private int checkData(String data){
        if(tagItems != null){
            for(int i = 0; i < tagItems.length; i++){
                if(tagItems[i].equals(data))
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

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private int[][] addData(int[][] fillData, int[] data){
        if(fillData == null)
            fillData = new int[0][];

        int[][] temp = fillData;
        fillData = new int[temp.length+1][];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = new int[0];

        return fillData;
    }

    /**
     * This adds an integer array to an array branch
     * @param fillData The data to add the integer array to
     * @return The new array with a new integer array appended
     */
    private int[][][] addBranch(int[][][] fillData){
        if(fillData == null)
            fillData = new int[0][][];

        int[][][] temp = fillData;
        fillData = new int[temp.length+1][][];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = new int[0][];

        return fillData;
    }

}
