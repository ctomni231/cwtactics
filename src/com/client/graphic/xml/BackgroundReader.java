package com.client.graphic.xml;

import com.jslix.tools.XML_Parser;
import org.xml.sax.Attributes;

/**
 * BackgroundReader.java
 *
 * My simple class for reading the XML image files
 *
 * @author Crecen
 */
public class BackgroundReader extends XML_Parser {

    private String[] items;
    
    //Reads in a background from an XML file
    public BackgroundReader(String file){
        super(file);
    }

    //Returns the background item paths
    public String[] getEntries(){
        return items;
    }

    @Override
    public void entry(Attributes attributes){
        if(attributes == null)  return;

        if(super.isAheader("background"))
            backgroundEntry(attributes);
    }

    //Lists the backgorund entries in an ArrayList
    private void backgroundEntry(Attributes attrib){
        if(super.isAheader("image")){
            items = fillEntry(attrib, items);
        }
    }

    private String[] fillEntry(Attributes attrib, String[] fillData){
        if(fillData == null)
            fillData = new String[0];

        if(super.getLastHeader().matches("image")){
            String[] temp = fillData;
            fillData = new String[temp.length+1];
            System.arraycopy(temp, 0, fillData, 0, temp.length);
            fillData[fillData.length-1] = fillEntry(attrib, "file");
        }
        return fillData;
    }

    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "";
    }
}
