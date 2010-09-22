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
        }
    }

    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "";
    }
}
