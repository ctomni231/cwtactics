package com.cwt.map;

import java.util.HashMap;

/**
 * DataStorage.java
 *
 * This class stores data for various data objects that aren't covered in
 * the other storage classes. It checks the XML file for validity and the
 * CWT graphic mainframe depends on this class to organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.26.11
 */
public class DataStorage {

    public final int DIRECTION = MapElement.DIRECTION;
    public final int WEATHER = MapElement.WEATHER;
    public final int SIZE = MapElement.SIZE;

    public final int NAME = MapElement.NAME;
    public final int BASE = MapElement.BASE;
    public final int TYPE = MapElement.TYPE;
    public final int ARMY = MapElement.ARMY;

    private KeyStore refTrack;

    private RefStore[] ref;
    private ListStore[] list;

    private RefStore refTemp;
    private ListStore listTemp;

    public DataStorage(){
        refTrack = new KeyStore();
    }

    public void addRef(int code, String key, int value){
        if(refTrack.checkCode(code)){
            refTemp = ref[code];
            refTemp.add(key, value);
            ref[code] = refTemp;
        }else{
            refTemp = new RefStore();
            refTemp.add(key, value);
            ref = addData(ref, refTemp);
            refTrack.addData(code, ref.length-1);
        }
    }

    public void addRef(int code, String[] keys, int value){
        for(String key: keys)
            addRef(code, key, value);
    }

    public int addItem(int code, HashMap<String, String> fillData){

        for(String key: fillData.keySet()){
            //System.out.println("KEY: "+key);

            switch(code){
                /*case ARMY:
                case NAME:
                case BASE:
                case TYPE:
                    if(refTrack.checkCode(code)){
                        listTemp = list[refTrack.getData(code)];
                        listTemp.add(key);
                        list[refTrack.getData(code)] = listTemp;
                    }else{
                        listTemp = new ListStore();
                        listTemp.add(key);
                        list = addData(list, listTemp);
                        refTrack.addData(code, list.length-1);
                    }
                    return refTrack.getData(code);//*/
                case NAME:
                    if(refTrack.checkCode(code)){
                    }
                default:
                    if(refTrack.checkCode(code))
                        return ref[refTrack.getData(code)].get(key);
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
    private RefStore[] addData(RefStore[] fillData, RefStore data){
        if(fillData == null)
            fillData = new RefStore[0];

        RefStore[] temp = fillData;
        fillData = new RefStore[temp.length+1];
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
    private ListStore[] addData(ListStore[] fillData, ListStore data){
        if(fillData == null)
            fillData = new ListStore[0];

        ListStore[] temp = fillData;
        fillData = new ListStore[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
