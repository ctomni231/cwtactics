package com.cwt.map;

import java.util.HashMap;
import static com.yasl.logging.Logging.*;

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
 */
public class TagStorage{

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

    private KeyStore[] tagItems;//This holds the individual connections
    private DataStore multItems;//This holds multiple tag for each connection
    private ListStore tagNames;//This holds the connection name references
    private RefStore ref;//This holds valid connection references

    private KeyStore tempKey;//This holds temporary connection values

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

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);
            switch(ref.get(key)){
                case -1:
                    warn("Tag key '"+key+"' not recognized!");
                    break;
                default:
                    storeItem(ref.get(key), tagNames.addData(
                            fillData.get(key)));
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
     * This class stores the tags within the array in a way that keeps the
     * class from taking up too much memory
     * @param index The index where this item is to be stored
     * @param data The data of this particular item
     */
    private void storeItem(int index, int data){
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
}
