package com.cwt.map;

/**
 * CodeStorage.java
 *
 * This class deals with checking the valid code entries for the objects
 * within the game. The CWT graphic mainframe depends on this class to
 * organize the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.25.11
 */
public class CodeStorage {

    //The valid data for the code section of the XML
    public static final byte TERRAIN = 0;//The Terrain object code
    public static final byte PROPERTY = 1;//The Property object code
    public static final byte UNIT = 2;//The Unit object code
    public static final byte COMMANDER = 3;//The code for Commander objects
    public static final byte CURSOR = 4;//The code for cursor objects
    public static final byte ARROW = 5;//The code for arrow objects
    public static final byte ATTRIBUTE = 6;//The code for attribute objects

    //The valid data for the data section of the XML
    public static final byte DATA = 0;//The Data object code
    public static final byte COLOR = 1;//The Color object code
    public static final byte LANGUAGE = 2;//The Language object code

    //The valid data for the type section of the XML
    public static final byte GRAPHIC = 0;//The Graphic object code

    //The valid data for the file section of the XML
    public static final byte FILE = 0;//The File object code
    public static final byte TAG = 1;//The Tag object code

    private static boolean start = true;//Checks initialization status
    private static RefStore checkCode;//Reference for code
    private static RefStore checkData;//Reference for data
    private static RefStore checkType;//Reference for type
    private static RefStore checkFile;//Reference for file

    /**
     * This function is used to wrap all the function into function
     * layers
     * @param index The layer of the XML file to check
     * @param part The naming part to test
     * @return The index representing the object code
     */
    public static int checkAll(int index, String part){
        if(start)
            initialize();

        switch(index){
            case 0:
                return checkCode.get(part);
            case 1:
                return checkData.get(part);
            case 2:
                return checkType.get(part);
            case 3:
                return checkFile.get(part);
        }
        return -1;
    }

    /**
     * This initializes all the references for the code section
     */
    private static void initialize(){
        //Validity of the code
        checkCode = new RefStore();
        checkCode.add(new String[]{"TER.*","FIE.*"}, TERRAIN);
        checkCode.add(new String[]{"CIT.*","PRO.*"}, PROPERTY);
        checkCode.add("UNI.*", UNIT);
        checkCode.add("CUR.*", CURSOR);
        checkCode.add("ATT.*", ATTRIBUTE);
        checkCode.add("ARR.*", ARROW);
        //Validity of the data
        checkData = new RefStore();
        checkData.add("DAT.*", DATA);
        checkData.add("COL.*", COLOR);
        checkData.add("LAN.*", LANGUAGE);
        //Validity of the type
        checkType = new RefStore();
        checkType.add("GRA.*", GRAPHIC);
        //Validity of the file
        checkFile = new RefStore();
        checkFile.add("FIL.*", FILE);
        checkFile.add("TAG", TAG);
    }
}
