package com.system.reader;

import com.system.data.Database;
import com.system.input.XML_Parser;
import org.xml.sax.Attributes;

/**
 * This class was made to allow the menu system to be able to become language
 * friendly, and also to export all menu items to an external state.
 * @author Crecen
 */
public class MenuReader extends XML_Parser{

    private String bgPrefix;
    private String bgSuffix;
    private String bgRef;
    private int bgItems;

    private String logoTitle;
    private String logoMini;
    private int menuJustify;

    private String ID;
    private String alphaRef;
    private String arrowRef;
    private String unitColor;
    private String propColor;
    private String[] titleData;
    private String[] menuData;
    private String[] exitData;

    public MenuReader(String file){
        super(file);
    }

    @Override
    public void entry(Attributes attributes){
        if(attributes == null)  return;

        if(super.isAheader("screen"))
            screenEntry(attributes);
        if(super.isAheader("background"))
            backgroundEntry(attributes);
        if(super.isAheader("logo"))
            logoEntry(attributes);
    }

    public String getID(){
        return ID;
    }
    public String getAlpha(){
        return alphaRef;
    }
    public String getArrow(){
        return arrowRef;
    }
    public String getBGPrefix(){
        return bgPrefix;
    }
    public String getBGSuffix(){
        return bgSuffix;
    }
    public String getUserBGRef(){
        return bgRef;
    }
    public int noOfBGItems(){
        return bgItems;
    }
    public String getTitleLogo(){
        return logoTitle;
    }
    public String getMiniLogo(){
        return logoMini;
    }
    public String getUnitColorRef(){
        return unitColor;
    }
    public String getPropColorRef(){
        return propColor;
    }
    public int getMenuJustify(){
        return menuJustify;
    }
    public String[] getTitleData(){
        return (titleData == null) ? new String[0] : titleData;
    }
    public String[] getExitData(){
        return (exitData == null) ? new String[0] : exitData;
    }
    public String[] getMenuData(){
        return (menuData == null) ? new String[0] : menuData;
    }

    private void backgroundEntry(Attributes attrib){
        if(super.isAheader("prefix"))
            bgPrefix = fillEntry(attrib, "file");
        if(super.isAheader("suffix"))
            bgSuffix = fillEntry(attrib, "file");
        if(super.isAheader("user"))
            bgRef = fillEntry(attrib, "ref");
        if(super.isAheader("items"))
            bgItems = Integer.valueOf(fillEntry(attrib, "index"));
        if(super.isAheader("justify"))
            menuJustify = Integer.valueOf(fillEntry(attrib, "index"));
    }

    private void logoEntry(Attributes attrib){
        if(super.isAheader("title")){
            logoTitle = fillEntry(attrib, "file");
        }
        if(super.isAheader("mini")){
            logoMini = fillEntry(attrib, "file");
        }
    }

    private void screenEntry(Attributes attrib){
        ID = (attrib.getValue("ID") != null) ? attrib.getValue("ID") : "";
        if(super.isAheader("alpha"))
            alphaRef = fillEntry(attrib, "file");
        if(super.isAheader("arrow"))
            arrowRef = fillEntry(attrib, "file");
        if(super.isAheader("unit"))
            unitColor = fillEntry(attrib, "file");
        if(super.isAheader("prop"))
            propColor = fillEntry(attrib, "file");
        if(super.isAheader("logo")){
            logoTitle = fillEntry(attrib, "titleRef");
            logoMini = fillEntry(attrib, "logoRef");
        }
        if(super.isAheader("title"))
            titleData = fillEntry(attrib, titleData);
        if(super.isAheader("main"))
            menuData = fillEntry(attrib, menuData);
        if(super.isAheader("exit"))
            exitData = fillEntry(attrib, exitData);
    }

    private String[] fillEntry(Attributes attrib, String[] fillData){
        if(fillData == null)
            fillData = new String[0];

        if(super.getLastHeader().matches("list")){
            String[] temp = fillData;
            fillData = new String[temp.length+1];
            for(int i = 0; i < temp.length; i++)
                fillData[i] = temp[i];
            fillData[fillData.length-1] = fillEntry(
                    attrib, Database.getLanguage());
        }
        return fillData;
    }

    private String fillEntry(Attributes attrib, String data){
        return (attrib.getValue(data) != null) ? attrib.getValue(data) : "";
    }

}
