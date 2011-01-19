package com.cwt.map;

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
 * @version 01.19.11
 * @todo TODO I have to split the addItem into a dual part so multiple tags
 * can be added to the system.
 */
public class TagStorage implements Storage {

    public final byte O = 0;//Holds the default place tag of this object
    public final byte OL = 1;//Holds the tile this object overlaps
    public final byte N = 2;//Holds the valid connection for North
    public final byte S = 3;//Holds the valid connection for South
    public final byte E = 4;//Holds the valid connection for East
    public final byte W = 5;//Holds the valid connection for West
    public final byte NE = 6;//Holds the valid connection for Northeast
    public final byte NW = 7;//Holds the valid connection for Northwest
    public final byte SE = 8;//Holds the valid connection for Southeast
    public final byte SW = 9;//Holds the valid connection for Southwest
    public final byte NR = 10;//Holds the rejected connection for North
    public final byte SR = 11;//Holds the rejected connection for South
    public final byte ER = 12;//Holds the rejected connection for East
    public final byte WR = 13;//Holds the rejected connection for West

    private KeyStore[] tagItems;
    private DataStore multItems;
    private ListStore tagNames;
    private HashMap<String, Byte> ref;

    private KeyStore tempKey;

    public TagStorage(){
        tagNames = new ListStore();
        multItems = new DataStore();
        initReferences();
    }

    public int addItem(HashMap<String, String> fillData) {
        tempKey = new KeyStore();

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);
            if(ref.containsKey(key.toUpperCase()))
                checkItem(ref.get(key.toUpperCase()),
                        tagNames.addData(fillData.get(key)));

            //if(key.toUpperCase().equals("O"))
            //    checkItem(O, tagNames.addData(fillData.get(key)));
            //else if(key.toUpperCase().equals("OL"))
            //    checkItem(OL, tagNames.addData(fillData.get(key)));
        }

        for(int i = 0; i < tempKey.getData().length; i++){
            if(tempKey.getData()[i] < -1)
                System.out.println("STORE "+i+":"+tagNames.
                    getData((tempKey.getData()[i]*-1)-2));
        }
        System.out.println("TAG:---------------------------------");

        tagItems = addData(tagItems, tempKey);

        return tagItems.length-1;
    }

    /**
     * This class stores the tags within the array in a way that keeps the
     * class from taking up too much memory
     * @param index The index where this item is to be stored
     * @param data The data of this particular item
     */
    private void checkItem(int index, int data){
        if(tempKey.checkCode(index)){
            if(tempKey.getData(index) < -1){
                multItems.addNewLayer();
                multItems.addData((tempKey.getData(index)*-1) - 2);
                tempKey.replaceData(index, multItems.addData(data));
            }else
                multItems.addData(tempKey.getData(index), data);
        }else
            tempKey.addData(index, (data+2)*-1);
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

    /**
     * This class organizes all references into a hashMap for faster indexing
     */
    private void initReferences(){
        ref = new HashMap<String, Byte>();
        ref.put("O", O);
        ref.put("OL", OL);
        ref.put("N", N);
        ref.put("S", S);
        ref.put("E", E);
        ref.put("W", W);
        ref.put("NE", NE);
        ref.put("NW", NW);
        ref.put("SE", SE);
        ref.put("SW", SW);
        ref.put("NR", NR);
        ref.put("SR", SR);
        ref.put("ER", ER);
        ref.put("WR", WR);
    }

}
