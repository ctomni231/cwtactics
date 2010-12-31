package com.cwt.system.data;

/**
 * CodeLibrary.java
 *
 * This class deals with checking the valid code entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.21.10
 */
public class CodeLibrary {

    //The valid data for the code section of the XML
    public static final byte TERRAIN = 0;//The Terrain/Data object code
    public static final byte PROPERTY = 1;//The Property/Language object code
    public static final byte UNIT = 2;//The Unit/Color object code
    public static final byte COMMANDER = 3;//The code for Commander objects
    public static final byte CURSOR = 4;//The code for cursor objects
    public static final byte ARROW = 5;//The code for arrow objects
    public static final byte ATTRIBUTE = 6;//The code for attribute objects

    /**
     * This function is used to wrap all the function into function
     * layers
     * @param index The layer of the XML file to check
     * @param part The naming part to test
     * @return The index representing the object code
     */
    public static byte checkAll(int index, String part){
        switch(index){
            case 0:
                return checkCode(part.toUpperCase());
            case 1:
                return checkData(part.toUpperCase());
            case 2:
                return checkType(part.toUpperCase());
            case 3:
                return checkFile(part.toUpperCase());
        }
        return -1;
    }

    /**
     * This function checks the validity of code
     * @param part The text to test
     * @return The index representing the object code
     */
    public static byte checkCode(String part){
        if(part.matches("TER.*") || part.matches("FIE.*"))
            return TERRAIN;
        else if(part.matches("CIT.*") || part.matches("PRO.*"))
            return PROPERTY;
        else if(part.matches("UNI.*"))
            return UNIT;
        else if(part.matches("CUR.*"))
            return CURSOR;
        else if(part.matches("ATT.*")){
            return ATTRIBUTE;
        }else if(part.matches("ARR.*")){
            return ARROW;
        }
        return -1;
    }

    /**
     * This function checks the validity of the data section
     * @param part The text to test
     * @return The index representing the object code
     */
    public static byte checkData(String part){
        if(part.matches("DAT.*"))
            return TERRAIN;
        else if(part.matches("COL.*"))
            return PROPERTY;
        else if(part.matches("LAN.*"))
            return UNIT;
        return -1;
    }

    /**
     * This function checks the validity of the type section
     * @param part The text to test
     * @return The index representing the object code
     */
    public static byte checkType(String part){
        if(part.matches("GRA.*"))
            return TERRAIN;
        return -1;
    }

    /**
     * This function checks the validity of the file section
     * @param part The text to test
     * @return The index representing the object code
     */
    public static byte checkFile(String part){
        if(part.matches("FIL.*"))
            return TERRAIN;
        else if(part.matches("TAG"))
            return PROPERTY;
        return -1;
    }

}
