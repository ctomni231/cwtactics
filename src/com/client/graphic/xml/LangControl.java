package com.client.graphic.xml;

import cwt_repo_tapsi.service.languageSupport.DictionaryService;

/**
 * LangControl.java
 *
 * This class regulates xml language conversions
 * 
 * @author Ctomni
 */
public class LangControl extends DictionaryService{

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
