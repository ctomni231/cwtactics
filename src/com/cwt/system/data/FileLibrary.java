package com.cwt.system.data;

import java.util.HashMap;

/**
 * FileLibrary.java
 *
 * This class deals with checking the valid file entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.06.11
 */
public class FileLibrary {

    public final int PATH = 0;
    public final int LOCX = 1;
    public final int LOCY = 2;
    public final int SIZEX = 3;
    public final int SIZEY = 4;
    public final int TILESIZEX = 5;
    public final int TILESIZEY = 6;
    public final int FLIP = 7;

    public final int ITEMS = 8;
    private String[] fileItems;
    private int[][] loc;
    private int[] tempLoc;

    public FileLibrary(){
        tempLoc = new int[ITEMS];
    }

    public int addItem(HashMap<String, String> fillData){

        for(int i = 0; i < ITEMS; i++)
            tempLoc[i] = -1;

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);

            if(key.toUpperCase().matches("P.*")){
                tempLoc[PATH] = 0;
                addItem(fillData.get(key));
            }else if(key.toUpperCase().matches("L.*X") ||
                    key.toUpperCase().equals("X"))
                tempLoc[LOCX] = Integer.parseInt(fillData.get(key));
            else if(key.toUpperCase().matches("L.*Y") ||
                    key.toUpperCase().equals("Y"))
                tempLoc[LOCY] = Integer.parseInt(fillData.get(key));
            else if(key.toUpperCase().matches("S.*X"))
                tempLoc[SIZEX] = Integer.parseInt(fillData.get(key));
            else if(key.toUpperCase().matches("S.*Y"))
                tempLoc[SIZEY] = Integer.parseInt(fillData.get(key));
            else if(key.toUpperCase().matches("T.*X"))
                tempLoc[TILESIZEX] = Integer.parseInt(fillData.get(key));
            else if(key.toUpperCase().matches("T.*Y"))
                tempLoc[TILESIZEY] = Integer.parseInt(fillData.get(key));
            else if(key.toUpperCase().matches("F.*"))
                tempLoc[FLIP] = Integer.parseInt(fillData.get(key));
            //Figure out whether to store this in a sturctured array
            //or just to handle each data stream separately. Leaning
            //the first option.
        }

        if(tempLoc[0] == -1)
            return tempLoc[0];

        for(int i = 1; i < tempLoc.length; i++){
            if(tempLoc[i] != -1){
                tempLoc[0] = tempLoc[0] * 10 + i;
                addItem(i, tempLoc[i]);
            }
        }

        System.out.println("STORE: "+loc[loc.length-1].length+" "+
                loc[loc.length-1][1]);

        return loc.length-1;
    }

    public void addItem(String data){
        loc = addBranch(loc);
        int temp = checkData(data);
        if(temp == -1)
            fileItems = addData(fileItems, data);
        else
            temp = fileItems.length-1;
        loc[loc.length-1] = addData(loc[loc.length-1], temp);
    }

    public void addItem(int code, int data){
        if(loc[loc.length-1].length < 2)
            loc[loc.length-1] = addData(loc[loc.length-1], code);
        else
            loc[loc.length-1][1] = (loc[loc.length-1][1] * 10) + code;
        loc[loc.length-1] = addData(loc[loc.length-1], data);
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
