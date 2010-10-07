package com.client.graphic.xml;

import com.jslix.tools.LocaleService;

/**
 * LangControl.java
 *
 * This class regulates xml language conversions
 * 
 * @author Ctomni
 */
public class LangControl extends LocaleService{

    public LangControl(String filename){
        super(filename);
    }

    @Override
    public String getText(String ID){
        if(ID.startsWith("@"))
            return super.getText(ID);
        else
            return ID;
    }
}
