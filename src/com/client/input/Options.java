package com.client.input;

import com.jslix.tools.XML_Parser;
import org.xml.sax.Attributes;

/**
 * Options.java
 *
 * This class deals with retrieving options from the XML File.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.28.10
 */
public class Options extends XML_Parser{

    public int help;
    public int color;
    public int column;

    public int up;
    public int down;
    public int left;
    public int right;
    public int select;
    public int cancel;

    public int sUp;
    public int sDown;
    public int sLeft;
    public int sRight;
    public int sSelect;
    public int sCancel;

    public Options(String filename){
         super(filename);
    }


    @Override
    public void entry(Attributes attributes){
         if(attributes == null)  return;

         if(super.isAheader("options"))
             optionEntry(attributes);

    }

    private void optionEntry(Attributes attrib){
        if(super.isAheader("normal"))
            normalEntry(attrib);
        if(super.isAheader("java"))
             javaEntry(attrib);
         if(super.isAheader("slick"))
             slickEntry(attrib);
    }

    private void normalEntry(Attributes attrib){
        help = Integer.parseInt(fillEntry(attrib, "help"));
        color = Integer.parseInt(fillEntry(attrib, "color"));
        column = Integer.parseInt(fillEntry(attrib, "column"));
    }

    private void javaEntry(Attributes attrib){
        up = Integer.parseInt(fillEntry(attrib, "UP"));
        down = Integer.parseInt(fillEntry(attrib, "DOWN"));
        left = Integer.parseInt(fillEntry(attrib, "LEFT"));
        right = Integer.parseInt(fillEntry(attrib, "RIGHT"));
        select = Integer.parseInt(fillEntry(attrib, "SELECT"));
        cancel = Integer.parseInt(fillEntry(attrib, "CANCEL"));
    }

    private void slickEntry(Attributes attrib){
        sUp = Integer.parseInt(fillEntry(attrib, "UP"));
        sDown = Integer.parseInt(fillEntry(attrib, "DOWN"));
        sLeft = Integer.parseInt(fillEntry(attrib, "LEFT"));
        sRight = Integer.parseInt(fillEntry(attrib, "RIGHT"));
        sSelect = Integer.parseInt(fillEntry(attrib, "SELECT"));
        sCancel = Integer.parseInt(fillEntry(attrib, "CANCEL"));
    }

    /**
     * This function fills an array with an XML tag value
     * @param attrib The attributes of a current line
     * @param fillData The array to fill up
     * @param head The XML tag value
     * @param value The XML tag value
     * @return An array containing the item
     */
    private String[] fillEntry(Attributes attrib, String[] fillData,
            String head, String value){
        if(fillData == null)
            fillData = new String[0];

        if(super.getLastHeader().matches(head)){
            String[] temp = fillData;
            fillData = new String[temp.length+1];
            System.arraycopy(temp, 0, fillData, 0, temp.length);
            fillData[fillData.length-1] = fillEntry(attrib, value);
        }
        return fillData;
    }

    /**
     * This function takes an XML tag and gives you its value
     * @param attrib The attributes of a current XML line
     * @param data The key tag
     * @return The value of the key tag
     */
    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "-1";
    }
}
