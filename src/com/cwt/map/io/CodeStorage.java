package com.cwt.map.io;

/**
 * CodeStorage.java
 *
 * This class deals with checking the valid code entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.14.11
 */
public class CodeStorage{

    //----------------------------------------------
    //The valid data for the code section of the XML
    //----------------------------------------------

    /** The Terrain object code */
    public final byte TERRAIN = 0;
    /** The Property object code */
    public final byte PROPERTY = 1;
    /** The Unit object code */
    public final byte UNIT = 2;
    /** The code for Commander objects */
    public final byte COMMANDER = 3;
    /** The code for cursor objects */
    public final byte CURSOR = 4;
    /** The code for arrow objects */
    public final byte ARROW = 5;
    /** The code for attribute objects */
    public final byte ATTRIBUTE = 6;

    //----------------------------------------------
    //The valid data for the data section of the XML
    //----------------------------------------------

    /** The Data object code */
    public final byte DATA = 0;
    /** The Color object code */
    public final byte COLOR = 1;
    /** The Language object code */
    public final byte LANGUAGE = 2;
    /** The Blend color object code */
    public final byte BLEND = 3;

    //----------------------------------------------
    //The valid data for the type section of the XML
    //----------------------------------------------

    /** The Graphic object code */
    public final byte GRAPHIC = 0;

    //----------------------------------------------
    //The valid data for the file section of the XML
    //----------------------------------------------

    /** The File object code */
    public final byte FILE = 0;
    /** The Tag object code */
    public final byte TAG = 1;

    /** The reference code for code, data, type, and file respectively */
    private RefStore[] checkXML;

    /**
     * This class is used to check validity of code segments in the XML files.
     * This initializes all the references for the code section.
     */
    public CodeStorage(){
        //Validity of the code
        RefStore temp = new RefStore();
        temp.add(new String[]{"TER.*","FIE.*"}, TERRAIN);
        temp.add(new String[]{"CIT.*","PRO.*"}, PROPERTY);
        temp.add("UNI.*", UNIT);
        temp.add("CUR.*", CURSOR);
        temp.add("ATT.*", ATTRIBUTE);
        temp.add("ARR.*", ARROW);
        checkXML = addData(checkXML, temp);
        //Validity of the data
        temp = new RefStore();
        temp.add("DAT.*", DATA);
        temp.add("COL.*", COLOR);
        temp.add("BLE.*", BLEND);
        temp.add("LAN.*", LANGUAGE);
        checkXML = addData(checkXML, temp);
        //Validity of the type
        temp = new RefStore();
        temp.add("GRA.*", GRAPHIC);
        checkXML = addData(checkXML, temp);
        //Validity of the file
        temp = new RefStore();
        temp.add("FIL.*", FILE);
        temp.add("TAG", TAG);
        checkXML = addData(checkXML, temp);
    }

    /**
     * This function is used to wrap all the function into function
     * layers
     * @param index The layer of the XML file to check
     * @param part The naming part to test
     * @return The index representing the object code
     */
    public int checkAll(int index, String part){
        return (index >= 0 && index <= checkXML.length) ?
            checkXML[index].get(part) : -1;
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
        for(int i = -1; i++ < temp.length-1;)
            fillData[i] = temp[i];
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
