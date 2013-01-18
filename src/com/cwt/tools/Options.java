package com.cwt.tools;

import com.jslix.parser.XML_Parser;

import org.xml.sax.Attributes;

/**
 * Options.java
 *
 * This class deals with retrieving options from the XML File.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.29.10
 */
public class Options extends XML_Parser{

    /** Holds the help bar visible value */
    public int help;
    /** Holds the starting menu color */
    public int color;
    /** Holds the starting menu column */
    public int column;

    /** Holds the java key for up */
    public int up;
    /** Holds the java key for down */
    public int down;
    /** Holds the java key for left */
    public int left;
    /** Holds the java key for right */
    public int right;
    /** Holds the java key for select */
    public int select;
    /** Holds the java key for cancel */
    public int cancel;

    /** Holds the Slick key for up */
    public int sUp;
    /** Holds the Slick key for down */
    public int sDown;
    /** Holds the Slick key for left */
    public int sLeft;
    /** Holds the Slick key for right */
    public int sRight;
    /** Holds the Slick key for select */
    public int sSelect;
    /** Holds the Slick key for Cancel */
    public int sCancel;

    /**
     * This class gets a group of options set by the user when the
     * user exits cleanly. It is used for storing key configurations
     * mainly, and was expanded to store other settings
     * @param filename The path to the options file
     */
    public Options(String filename){
         super(filename);
    }

    /**
     * This function sorts the tags into readable entries for storage of
     * strings
     * @param attributes A current line in the XML file
     */
    @Override
    public void entry(Attributes attributes){
         if(attributes == null)  return;

         if(super.isAheader("options"))
             optionEntry(attributes);

    }

    /**
     * This function gathers all tags that have to do with setting the options
     * @param attrib A current line in the XML file
     */
    private void optionEntry(Attributes attrib){
        if(super.isAheader("normal"))
            normalEntry(attrib);
        if(super.isAheader("java"))
             javaEntry(attrib);
         if(super.isAheader("slick"))
             slickEntry(attrib);
    }

    /**
     * This function handles all the generic tags that have to do with
     * the options such as menu orientation and color
     * @param attrib A current line in the XML file
     */
    private void normalEntry(Attributes attrib){
        help = Integer.parseInt(fillEntry(attrib, "help"));
        color = Integer.parseInt(fillEntry(attrib, "color"));
        column = Integer.parseInt(fillEntry(attrib, "column"));
    }

    /**
     * This function handles gathering all the stored information for
     * java2D keys
     * @param attrib A current line in the XML file
     */
    private void javaEntry(Attributes attrib){
        up = Integer.parseInt(fillEntry(attrib, "UP"));
        down = Integer.parseInt(fillEntry(attrib, "DOWN"));
        left = Integer.parseInt(fillEntry(attrib, "LEFT"));
        right = Integer.parseInt(fillEntry(attrib, "RIGHT"));
        select = Integer.parseInt(fillEntry(attrib, "SELECT"));
        cancel = Integer.parseInt(fillEntry(attrib, "CANCEL"));
    }

    /**
     * This function handles gathering all the stored information for
     * the Slick2D keys
     * @param attrib A current line in the XML file
     */
    private void slickEntry(Attributes attrib){
        sUp = Integer.parseInt(fillEntry(attrib, "UP"));
        sDown = Integer.parseInt(fillEntry(attrib, "DOWN"));
        sLeft = Integer.parseInt(fillEntry(attrib, "LEFT"));
        sRight = Integer.parseInt(fillEntry(attrib, "RIGHT"));
        sSelect = Integer.parseInt(fillEntry(attrib, "SELECT"));
        sCancel = Integer.parseInt(fillEntry(attrib, "CANCEL"));
    }

    /**
     * This function takes an XML tag and gives you its value
     * @param attrib The attributes of a current XML line
     * @param data The key tag
     * @return The value of the key tag
     */
    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "0";
    }
}
