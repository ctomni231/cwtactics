package com.cwt.io;

import com.cwt.system.jslix.tools.FileFind;
import com.cwt.system.jslix.tools.FileIndex;
import com.cwt.system.jslix.tools.XML_Writer;

/**
 * OptionHandler.java
 *
 * This class deals with writing and retrieving options from the user.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.07.10
 */
public class OptionHandler extends XML_Writer{

    /** Holds the option XML Reader class */
    private Options options;

    /**
     * This class holds the current options and deals with writing
     * and storing them to the users computer
     * @param path The path to the option file
     * @param filename The name of the option file
     */
    public OptionHandler(String path, String filename){
        super(path, filename);
    }

    /**
     * THis function retrieves the options by the XML parser
     * @return The options data
     */
    public Options getOptions(){
        return options;
    }

    /**
     * This function loads the options from the XML parser. Stores all the
     * key actions and commands
     */
    public void loadOptions(){
        options = new Options(filePath+"/"+filename);

        KeyControl.Keys.UP.setValues(options.sUp,
                options.up);
        KeyControl.Keys.DOWN.setValues(options.sDown,
                options.down);
        KeyControl.Keys.LEFT.setValues(options.sLeft,
                options.left);
        KeyControl.Keys.RIGHT.setValues(options.sRight,
                options.right);
        KeyControl.Keys.SELECT.setValues(options.sSelect,
                options.select);
        KeyControl.Keys.CANCEL.setValues(options.sCancel,
                options.cancel);
    }

    /**
     * This function tests to see if the option file exists
     * @return Whether the option XML exists(true) or not(false)
     */
    public boolean exists(){
        FileFind finder = new FileFind(filePath);
        finder.refactor();
        for(FileIndex index: finder.getAllFiles()){
            if(index.fname.equals(filename))
                return true;
        }
        return false;
    }

    /**
     * This class helps reduce the size of the Main Menu Screen by
     * storing the values of the options XML file for it
     * @param menuHelp The help bar visibility
     * @param color The current menu color
     * @param column The current justify orientation
     */
    public void storeValues(boolean menuHelp, int color, int column){
        addXMLTag("options");
        addXMLTag("normal");
        if(menuHelp)    addAttribute("help", "1", false);
        else            addAttribute("help", "0", false);
        addAttribute("color", ""+color, false);
        addAttribute("column", ""+column, true);
        addXMLTag("java");
        addAttribute("UP", ""+KeyControl.Keys.UP.javaValue(), false);
        addAttribute("DOWN", ""+KeyControl.Keys.DOWN.javaValue(), false);
        addAttribute("LEFT", ""+KeyControl.Keys.LEFT.javaValue(), false);
        addAttribute("RIGHT", ""+KeyControl.Keys.RIGHT.javaValue(), false);
        addAttribute("SELECT", ""+KeyControl.Keys.SELECT.javaValue(), false);
        addAttribute("CANCEL", ""+KeyControl.Keys.CANCEL.javaValue(), true);
        addXMLTag("slick");
        addAttribute("UP", ""+KeyControl.Keys.UP.slickValue(), false);
        addAttribute("DOWN", ""+KeyControl.Keys.DOWN.slickValue(), false);
        addAttribute("LEFT", ""+KeyControl.Keys.LEFT.slickValue(), false);
        addAttribute("RIGHT", ""+KeyControl.Keys.RIGHT.slickValue(), false);
        addAttribute("SELECT", ""+KeyControl.Keys.SELECT.slickValue(), false);
        addAttribute("CANCEL", ""+KeyControl.Keys.CANCEL.slickValue(), true);
        endAllTags();
        writeToFile(true);
    }
}
