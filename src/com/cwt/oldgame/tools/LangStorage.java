package com.cwt.oldgame.tools;

import java.util.HashMap;

import com.cwt.game.tools.RefStore;

/**
 * LangStorage.java
 *
 * This class is just used for getting the Language attribute out of an
 * XML file. The CWT graphic mainframe depends on this class to organize
 * the objects.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.29.11
 */
public class LangStorage {

    /** Holds the language reference */
    public final byte LANG = 0;

    /** Stores references for the language items */
    private RefStore refItems;

    /**
     * This class gets a language path string used for localization from
     * an XML file.
     */
    public LangStorage(){
        refItems = new RefStore();
        refItems.add("P.*", LANG);
    }

    /**
     * This function gets the localization path of the properties file for
     * attributes
     * @param fillData The data where all the language items are stored
     * @return A String to the language path
     */
    public String getItem(HashMap<String, String> fillData) {
        for(String key: fillData.keySet()){
            switch(refItems.get(key)){
                case -1:
                    System.out.println("Language path key '"+key+"' not recognized!");
                    break;
                case LANG:
                    return fillData.get(key);
            }
        }
        return "";
    }
}
