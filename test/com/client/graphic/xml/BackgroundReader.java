package com.client.graphic.xml;

import com.jslix.tools.XML_Parser;
import org.xml.sax.Attributes;

/**
 * BackgroundReader.java
 *
 * My simple class for reading the XML image files
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.07.10
 */

public class BackgroundReader extends XML_Parser {

    public String[] items;//A list of background items from a file

    /**
     * This class reads a list of images from a pre-created XML file
     * @param file The file path to the XML
     */
    public BackgroundReader(String file){
        super(file);
    }

    /**
     * This function sorts the tags into readable entries for storage of
     * strings
     * @param attributes A current line in the XML file
     */
    @Override
    public void entry(Attributes attributes){
        if(attributes == null)  return;

        if(super.isAheader("background"))
            backgroundEntry(attributes);
    }

    /**
     * This lists all the background entries inside a String array
     * @param attrib A current line in an XML file
     */
    private void backgroundEntry(Attributes attrib){
        if(super.isAheader("image")){
            items = fillEntry(attrib, items);
        }
    }

    /**
     * This function performs the storage of items into an array
     * @param attrib A current line in the XML file
     * @param fillData The array to create and fill with items
     * @return A new array with the attribute within it
     */
    private String[] fillEntry(Attributes attrib, String[] fillData){
        if(fillData == null)
            fillData = new String[0];

        if(super.getLastHeader().equals("image")){
            String[] temp = fillData;
            fillData = new String[temp.length+1];
            System.arraycopy(temp, 0, fillData, 0, temp.length);
            fillData[fillData.length-1] = fillEntry(attrib, "file");
        }
        return fillData;
    }

    /**
     * This function converts a single entry into a String
     * @param attrib The current line in the XML file
     * @param data The tag name data key to extract from
     * @return A String containing the key value
     */
    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "";
    }
}
