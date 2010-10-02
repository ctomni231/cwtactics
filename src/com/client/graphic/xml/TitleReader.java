package com.client.graphic.xml;

import com.jslix.tools.XML_Parser;
import org.xml.sax.Attributes;

/**
 * TitleReader
 *
 * This class reads in and stores the title screen elements
 * 
 * @author Ctomni
 */
public class TitleReader extends XML_Parser{

    private String logoPath;
    private String miniPath;
    private String copyright;
    private String start;
    private String alpha;
    private String arrow;

    private String[] exitData;

    public TitleReader(String file){
        super(file);
    }

    public String getTitleLogoPath(){
        return logoPath;
    }

    public String getMiniLogoPath(){
        return miniPath;
    }

    public String getCopyright(){
        return copyright;
    }

    public String getStartText(){
        return start;
    }

    public String getAlphaPath(){
        return alpha;
    }

    public String getArrowPath(){
        return arrow;
    }

    public String[] getExitData(){
        return exitData;
    }

    @Override
    public void entry(Attributes attributes){
        if(attributes == null)  return;

        if(super.isAheader("menu"))
            menuEntry(attributes);
    }

    private void menuEntry(Attributes attrib){
        if(super.isAheader("logo")){
            logoPath = fillEntry(attrib, "title");
            miniPath = fillEntry(attrib, "mini");
        }else if(super.isAheader("title")){
            copyright = fillEntry(attrib, "copy");
            start = fillEntry(attrib, "start");
            alpha = fillEntry(attrib, "alpha");
            arrow = fillEntry(attrib, "arrow");
        }else if(super.isAheader("screen")){
            screenEntry(attrib);
        }
    }

    private void screenEntry(Attributes attrib){
        if(super.isAheader("exit")){
            exitData = fillEntry(attrib, exitData);
        }
    }

    private String[] fillEntry(Attributes attrib, String[] fillData){
        if(fillData == null)
            fillData = new String[0];

        if(super.getLastHeader().matches("list")){
            String[] temp = fillData;
            fillData = new String[temp.length+1];
            System.arraycopy(temp, 0, fillData, 0, temp.length);
            fillData[fillData.length-1] = fillEntry(attrib, "text");
        }
        return fillData;
    }

    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "";
    }
}
