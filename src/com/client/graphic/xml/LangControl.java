package com.client.graphic.xml;

import com.jslix.tools.LocaleService;
//import cwt_repo_tapsi.service.languageSupport.DictionaryService;

/**
 * LangControl.java
 *
 * This class regulates xml language conversions
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.11.10
 */

public class LangControl extends LocaleService{

    /**
     * This class acts as a transition class between DictionaryService
     * and LocaleService
     * @param filename The file path of the properties file
     */
    public LangControl(String filename){
        super(filename);
    }

    /**
     * This converts a text properties ID to a string
     * @param ID The property ID
     * @return The value from the ID key
     */
    public String getText(String ID){
        if(ID.startsWith("@"))
            return super.get(ID);
        else
            return ID;
    }
}
