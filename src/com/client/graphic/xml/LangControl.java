package com.client.graphic.xml;

import com.jslix.tools.LocaleService;
//import cwt_repo_tapsi.service.languageSupport.DictionaryService;

/**
 * LangControl.java
 *
 * This class regulates xml language conversions
 * 
 * @author Crecen
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
