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
 * @version 11.30.10
 */

public class TitleReader extends XML_Parser{

    public final String LANG_PATH = "data/lang/Languages";

    private LangControl lang;//Language controller for this class "@"
    public String logoPath;//The filepath to the main logo picture
    public String miniPath;//The filePath to the mini logo picture
    public String picPath;//The filePath to the picture logo
    public String main;//The text about the main menu
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
    public String[] editOption;//The menu option for the main menu
    public String[] editSelect;//The integer select for the main menu
    public String[] editText;//The scroll text for the main menu
    public String[] editHelp;//The help text for the main menu
    public String[] keyOption;//The option text for the keys
    public String[] keyHelp;//The help text for the keys

    /**
     * This class sets up a XML file for the title screen display
     * @param file The file path to the XML file
     */
    public TitleReader(String file){
        super(file);
    }

    /**
     * This function reads all XML lines
     * @param attributes The attributes of the current line
     */
    @Override
    public void entry(Attributes attributes){
        if(attributes == null)  return;

        if(super.isAheader("menu"))
            menuEntry(attributes);
    }

    /**
     * This function gets XML tags referencing the menu
     * @param attrib The attributes of a current line
     */
    private void menuEntry(Attributes attrib){
        titleEntry(attrib);
        if(super.isAheader("logo")){
            logoPath = fillEntry(attrib, "title");
            miniPath = fillEntry(attrib, "mini");
            picPath = fillEntry(attrib, "pic");
            question = fillEntry(attrib, "help");
        }else if(super.isAheader("title")){
            copyright = fillEntry(attrib, "copy");
            start = fillEntry(attrib, "start");
            alpha = fillEntry(attrib, "alpha");
            main = fillEntry(attrib, "main");
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

    /**
     * This function gets XML tags referencing the title screen
     * @param attrib The attributes of a current line
     */
    private void titleEntry(Attributes attrib){
        startHelp = fillEntry(attrib, startHelp, "title", "help");
    }

    /**
     * This function gets XML tags referencing the main menu
     * @param attrib The attributes of a current line
     */
    private void screenEntry(Attributes attrib){
        if(super.isAheader("exit"))
            exitData = fillEntry(attrib, exitData);
        if(super.isAheader("main")){
            mainOption = fillEntry(attrib, mainOption, "list", "item");
            mainSelect = fillEntry(attrib, mainSelect, "list", "id");
            mainText = fillEntry(attrib, mainText, "list", "text");
            mainHelp = fillEntry(attrib, mainHelp, "list", "help");
        }
        if(super.isAheader("edit")){
            editOption = fillEntry(attrib, editOption, "list", "item");
            editSelect = fillEntry(attrib, editSelect, "list", "id");
            editText = fillEntry(attrib, editText, "list", "text");
            editHelp = fillEntry(attrib, editHelp, "list", "help");
        }
        if(super.isAheader("key")){
            keyOption = fillEntry(attrib, keyOption, "list", "text");
            keyHelp = fillEntry(attrib, keyHelp, "list", "help");
        }
    }

    /**
     * This function fills an array with an XML tag value
     * @param attrib The attributes of a current line
     * @param fillData The array to fill up
     * @return An array containing the item
     */
    private String[] fillEntry(Attributes attrib, String[] fillData){
        return fillEntry(attrib, fillData, "list", "text");
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

        if(super.getLastHeader().equals(head)){
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
        if(lang == null){
            lang = new LangControl(LANG_PATH);
        }
        return (attrib.getValue(data) != null) ? 
            lang.getText(attrib.getValue(data)) : "";
    }
}