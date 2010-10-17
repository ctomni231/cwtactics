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
 * @todo TODO Finish commenting this class
 */

public class LangControl extends LocaleService{

    public LangControl(String filename){
        super(filename);
    }

    public String getText(String ID){
        if(ID.startsWith("@"))
            return super.get(ID);
        else
            return ID;
    }
}
