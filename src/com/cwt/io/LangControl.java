package com.cwt.io;

/**
 * LangControl.java
 *
 * This class regulates XML language conversions
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.29.11
 */

public class LangControl extends LocaleService{

    /**
     * This class acts as a transition class between DictionaryService
     * and LocaleService
     */
    public LangControl(){
        super();
    }

    /**
     * This class acts as a transition class between DictionaryService
     * and LocaleService
     * @param filename The file path of the properties file
     */
    public LangControl(String filename){
        this();
        getBundle(filename);
    }

    /**
     * This splits up the text by white space and gets the ID's for multiple
     * property ID's. Useful for making fill in the blank text applications.
     * @param ID The property ID
     * @return The value from the ID key
     */
    public String getText(String ID){        
        if(ID.split(" ").length < 2)
            return get(ID);

        String temp = "";
        for(String part: ID.split(" "))
            temp += get(part) + " ";

        return temp;
    }

    /**
     * This converts a text properties ID to a string
     * @param ID The property ID
     * @return The value from the ID key
     */
    @Override
    public String get(String ID){
        return ID.startsWith("@") ? super.get(ID) : ID;
    }
}
