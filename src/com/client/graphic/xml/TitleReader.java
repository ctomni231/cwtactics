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

    public final String LANG_PATH = "data/lang/Languages";

    private LangControl lang;//Language controller for this class "@"
    private String logoPath;//The filepath to the main logo picture
    private String miniPath;//The filePath to the mini logo picture
    private String copyright;//The text representing the copyright info
    private String question;//The filepath to the question mark picture
    private String start;//The title blinking logo
    private String alpha;//The path to the alphabet text picture
    private String arrow;//The path to the arrow picture
    private String unitColor;//The path to the unit colors
    private String propColor;//The path to the property colors

    private String[] startHelp;//Title Help Bar text files
    private String[] exitData;//Data conaining exit text and help text
    private String[] mainOption;//The menu option for the main menu
    private String[] mainSelect;//The integer select for the main menu
    private String[] mainText;//The scroll text for the main menu
    private String[] mainHelp;//The help text for the main menu

    public TitleReader(String file){
        super(file);
    }

    public String getUnitColors(){
        return unitColor;
    }

    public String getPropColors(){
        return propColor;
    }

    public String[] getMainOption(){
        return mainOption;
    }

    public String[] getMainSelect(){
        return mainSelect;
    }

    public String[] getMainText(){
        return mainText;
    }

    public String[] getMainHelp(){
        return mainHelp;
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

    public String getQuestion(){
        return question;
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

    public String[] getStartHelp(){
        return startHelp;
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
