package com.client.input;

import com.jslix.tools.FileFind;
import com.jslix.tools.FileIndex;
import com.jslix.tools.XML_Writer;

/**
 * OptionHandler.java
 *
 * This class deals with writing and retrieving options from the user.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.28.10
 */
public class OptionHandler extends XML_Writer{

    private Options options;

    public OptionHandler(String path, String filename){
        super(path, filename);
    }
    
    public Options getOptions(){
        return options;
    }

    public void loadOptions(){
        options = new Options(filePath+"/"+filename);
    }

    /**
     * This function tests to see if the option file exists
     * @return Whether the option XML exists(true) or not(false)
     */
    public boolean exists(){
        FileFind finder = new FileFind(filePath);
        finder.refactor();
        for(FileIndex index: finder.getAllFiles()){
            if(index.fname.matches(filename))
                return true;
        }
        return false;
    }
}
