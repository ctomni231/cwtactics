package com.client.graphic.xml;

import com.jslix.tools.XML_Parser;
import org.xml.sax.Attributes;

/**
 * TitleReader
 *
 * This class reads in and stores the title screen elements
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.11.10
 * @todo TODO Finish commenting this class
 */

public class TitleReader extends XML_Parser{

    public final String LANG_PATH = "data/lang/Languages";

    private LangControl lang;//Language controller for this class "@"
    public String logoPath;//The filepath to the main logo picture
    public String miniPath;//The filePath to the mini logo picture
    public String copyright;//The text representing the copyright info
    public String question;//The filepath to the question mark picture
    public String start;//The title blinking logo
    public String alpha;//The path to the alphabet text picture
    public String arrow;//The path to the arrow picture
    public String number;//The path to the number text picture
    public String credit;//The path to the credits
    public String unitColor;//The path to the unit colors
    public String propColor;//The path to the property colors

    public String[] startHelp;//Title Help Bar text files
    public String[] exitData;//Data containing exit text and help text
    public String[] mainOption;//The menu option for the main menu
    public String[] mainSelect;//The integer select for the main menu
    public String[] mainText;//The scroll text for the main menu
    public String[] mainHelp;//The help text for the main menu
    public String[] keyOption;//The option text for the keys
    public String[] keyHelp;//The help text for the keys

    public TitleReader(String file){
        super(file);
    }

    @Override
    public void entry(Attributes attributes){
        if(attributes == null)  return;

        if(super.isAheader("menu"))
            menuEntry(attributes);
    }

    private void menuEntry(Attributes attrib){
        titleEntry(attrib);
        if(super.isAheader("logo")){
            logoPath = fillEntry(attrib, "title");
            miniPath = fillEntry(attrib, "mini");
            question = fillEntry(attrib, "help");
        }else if(super.isAheader("title")){
            copyright = fillEntry(attrib, "copy");
            start = fillEntry(attrib, "start");
            alpha = fillEntry(attrib, "alpha");
            arrow = fillEntry(attrib, "arrow");
            number = fillEntry(attrib, "number");
            credit = fillEntry(attrib, "credit");
        }else if(super.isAheader("color")){
            unitColor = fillEntry(attrib, "unit");
            propColor = fillEntry(attrib, "prop");
        }else if(super.isAheader("screen")){
            screenEntry(attrib);
        }
    }

    private void titleEntry(Attributes attrib){
        startHelp = fillEntry(attrib, startHelp, "title", "help");
    }

    private void screenEntry(Attributes attrib){
        if(super.isAheader("exit"))
            exitData = fillEntry(attrib, exitData);
        if(super.isAheader("main")){
            mainOption = fillEntry(attrib, mainOption, "list", "item");
            mainSelect = fillEntry(attrib, mainSelect, "list", "id");
            mainText = fillEntry(attrib, mainText, "list", "text");
            mainHelp = fillEntry(attrib, mainHelp, "list", "help");
        }
        if(super.isAheader("key")){
            keyOption = fillEntry(attrib, keyOption, "list", "text");
            keyHelp = fillEntry(attrib, keyHelp, "list", "help");
        }
    }

    private String[] fillEntry(Attributes attrib, String[] fillData){
        return fillEntry(attrib, fillData, "list", "text");
    }

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

    private String fillEntry(Attributes attrib, String data){
        if(lang == null){
            lang = new LangControl(LANG_PATH);
        }
        return (attrib.getValue(data) != null) ? 
            lang.getText(attrib.getValue(data)) : "";
    }
}