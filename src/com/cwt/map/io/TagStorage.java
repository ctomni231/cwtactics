package com.cwt.map.io;

import java.util.HashMap;

/**
 * TagStorage.java
 *
 * This class deals with checking the valid terrain connection and object
 * type entries in the game. The CWT graphic mainframe depends on this class
 * to organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.14.11
 */
public class TagStorage{

    /** Holds the default place tag of this object */
    public static final byte O = 0;
    /** Holds the tile this object overlaps */
    public static final byte OL = 1;
    /** Holds the valid connection for North */
    public static final byte N = 2;
    /** Holds the valid connection for South */
    public static final byte S = 3;
    /** Holds the valid connection for East */
    public static final byte E = 4;
    /** Holds the valid connection for West */
    public static final byte W = 5;
    /** Holds the valid connection for Northeast */
    public static final byte NE = 6;
    /** Holds the valid connection for Northwest */
    public static final byte NW = 7;
    /** Holds the valid connection for Southeast */
    public static final byte SE = 8;
    /** Holds the valid connection for Southwest */
    public static final byte SW = 9;
    /** Holds the rejected connection for North */
    public static final byte NR = 10;
    /** Holds the rejected connection for South */
    public static final byte SR = 11;
    /** Holds the rejected connection for East */
    public static final byte ER = 12;
    /** Holds the rejected connection for West */
    public static final byte WR = 13;

    /** This holds the individual connections */
    private KeyStore[] tagItems;
    /** This holds multiple tag for each connection */
    private DataStore multItems;
    /** This holds the connection name references */
    private ListStore tagNames;
    /** This holds valid connection references */
    private RefStore ref;

    /** This holds temporary connection values */
    private KeyStore tempKey;

    /**
     * This class deals with organizing the tag connections for every object.
     * This is mostly used for terrain, but is also used to store other
     * objects as well.
     */
    public TagStorage(){
        tagNames = new ListStore();
        multItems = new DataStore();
        tempKey = new KeyStore();
        ref = new RefStore();
        ref.add("O", O);
        ref.add("OL", OL);
        ref.add("N", N);
        ref.add("S", S);
        ref.add("E", E);
        ref.add("W", W);
        ref.add("NE", NE);
        ref.add("NW", NW);
        ref.add("SE", SE);
        ref.add("SW", SW);
        ref.add("NR", NR);
        ref.add("SR", SR);
        ref.add("ER", ER);
        ref.add("WR", WR);
    }

    /**
     * This function finalizes the storage for the tags
     * @return The index where this tag is stored
     */
    public int addItem(){
        tagItems = addData(tagItems, tempKey);
        tempKey = new KeyStore();
        return tagItems.length-1;
    }

    /**
     * This adds an item to the tag section and stores it into an array
     * @param fillData The data where all the tag items are stored
     * @return The index where this data was stored
     */
    public void addItem(HashMap<String, String> fillData) {
        int temp;
        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);
            temp = ref.get(key);
            switch(temp){
                case -1:
                    System.out.println("Tag key '"+key+"' not recognized!");
                    break;
                default:
                    storeItem(temp, tagNames.addData(fillData.get(key)));
            }
        }

        /*
        for(int i = 0; i < tempKey.getData().length; i++){
            if(tempKey.getData()[i] < -1)
                System.out.println("STORE "+i+":"+tagNames.
                    getData(((tempKey.getData()[i]*-1)-2)));
            else
                System.out.println("STORE "+i+":"+tempKey.getData()[i]);
        }
        System.out.println("TAG:---------------------------------");//*/
    }

    /**
     * This gets all the tag names for a specific index and item
     * @param index The reference to the tag group
     * @param item The tag group to extract the data from
     * @return The list of tag names from the group
     */
    public String[] getTags(int index, byte item){
        int[] temp = getData(index, item);
        String[] tags = new String[temp.length];
        for(int i = 0; i < temp.length; i++)
            tags[i] = tagNames.getData(temp[i]);
        return tags;
    }

    /**
     * This gets the correct data for the tag items and converts them into
     * integers
     * @param index The reference index for the tag items
     * @param item The tag item reference
     * @return The list of integers for this specific tag
     */
    private int[] getData(int index, byte item){
        if(index >= 0 && index < tagItems.length){
            index = tagItems[index].getData(item);
            if(index < -1)
                return new int[]{-index-2};
            else if(index > 0)
                return multItems.getData(index);
        }
        return new int[0];
    }

    /**
     * This class stores the tags within the array in a way that keeps the
     * class from taking up too much memory
     * @param index The index where this item is to be stored
     * @param data The data of this particular item
     */
    private void storeItem(int index, int data){
        if(tempKey.checkCode(index)){
            if(tempKey.getData(index) < -1){
                multItems.addNewLayer();
                multItems.addData(-tempKey.getData(index)-2);
                tempKey.replaceData(index, multItems.addData(data));
            }else
                multItems.addData(tempKey.getData(index), data);
        }else
            tempKey.addData(index, -data-2);
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private KeyStore[] addData(KeyStore[] fillData, KeyStore data){
        if(fillData == null)
            fillData = new KeyStore[0];

        KeyStore[] temp = fillData;
        fillData = new KeyStore[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
