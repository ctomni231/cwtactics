package com.cwt.map;

import com.cwt.system.jslix.tools.FileFind;
import com.cwt.system.jslix.tools.FileIndex;
import com.cwt.system.jslix.tools.XML_Parser;
import com.cwt.system.jslix.tools.XML_Writer;

/**
 * MapElement.java
 *
 * This class converts XML files into game data. All graphical elements
 * will be compacted into this format within this class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.05.11
 * @todo TODO Work on completing the sorting of terrain data first
 */

public class MapElement implements Runnable{

    public final byte CODE = 0;//Holds the type of object this is
    public final byte NAME = 1;//Holds the name reference to this object
    public final byte BASE = 2;//Holds the object grouping type
    public final byte TYPE = 3;//Holds which game this object belongs to
    public final byte DIRECTION = 4;//Holds the direction of this object
    public final byte ARMY = 5; //Holds which faction this object is part of
    public final byte WEATHER = 6;//Holds the weather type of this object
    public final byte FILE = 7;//Holds where in memory this data is stored
    public final byte TAGS = 8;//Holds the type connection data of the object
    public final byte COLOR = 9;//Holds the object default color information
    public final byte RANDOM = 10;//Holds data for random objects
    public final byte ANIMATE = 11;//Holds data for animations of objects

    public final int MAX_ITEMS = 12;

    private boolean isApplet;
    private boolean ready;
    private Thread looper;

    private int[] tagFill;
    private KeyStore[] dataItems;
    private XML_Parser mapParse;
    private FileStorage fileLib;
    private TagStorage tagLib;
    private ListStore nameLib;
    private ListStore baseLib;
    private ListStore typeLib;
    private ListStore armyLib;
    private DataStore colorLib;
    private DataStore randLib;
    private DataStore animLib;

    public MapElement(){
        mapParse = new XML_Parser();
        fileLib = new FileStorage();
        tagLib = new TagStorage();
        nameLib = new ListStore();
        baseLib = new ListStore();
        typeLib = new ListStore();
        armyLib = new ListStore();
        colorLib = new DataStore();
        randLib = new DataStore();
        animLib = new DataStore();
        ready = false;
        isApplet = true;
    }

    public void setApplet(boolean set){
        isApplet = set;
    }

    public boolean isReady(){
        return ready;
    }

    public void decode(){
        ready = false;
        looper = new Thread(this);
        looper.start();
    }

    private void decodeFiles(){
        //if(!isApplet)   findObjects();
        loadObjects();
        ready = true;
    }

    private int[] addData(int[] fillData, int data){
        if(fillData == null)
            fillData = new int[0];

        int[] temp = fillData;
        fillData = new int[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private KeyStore[] addData(KeyStore[] fillData, KeyStore data){
        if(fillData == null)
            fillData = new KeyStore[0];

        KeyStore[] temp = fillData;
        fillData = new KeyStore[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }

    /**
     * This function searches through your system for backgrounds and
     * organizes them in an XML file so they can be randomly selected.
     */
    private void findObjects(){
        FileFind fileFinder = new FileFind();
        XML_Writer writer = new XML_Writer("data","filelist.xml");
        if(fileFinder.changeDirectory("data/object")){
            //Forces it to only look for pictures
            fileFinder.addAvoidDir(".svn");
            fileFinder.addForceType(".xml");

            fileFinder.refactor();

            writer.addXMLTag("object");

            for(FileIndex file: fileFinder.getAllFiles()){
                if(!file.isDirectory){
                    writer.addXMLTag("list");
                    writer.addAttribute("file", file.fpath, true);
                }
            }

            writer.endAllTags();
            writer.print();
            writer.writeToFile(true);
        }
    }

    private void loadObjects(){
        mapParse.parse("data/filelist.xml");
        int[] entryLocation = mapParse.getLocation("object list");
        String[] entries = new String[entryLocation.length];

        for(int i = 0; i < entryLocation.length; i++)
            entries[i] = mapParse.getAttribute(entryLocation[i], "file");
        
        for(String entry: entries){
            System.out.println("DATA: "+entry);
            parseData(entry);
        }

    }

    private void parseData(String entry){
        mapParse.parse(entry);

        UPPER:for(int i = 0; i < mapParse.size(); i++){
            //This loop checks to see if all tags are valid
            for(int j = 0; j < mapParse.getTags(i).length; j++){
                int temp = (int)CodeStorage.checkAll(
                        j, mapParse.getTags(i)[j]);
                if(CodeStorage.checkAll(j, mapParse.getTags(i)[j]) == -1){
                    if(i == 0){
                        System.out.println(mapParse.getTags(i)[0]+
                            " not recognized");
                        return;
                    }else
                        continue UPPER;
                }

                tagFill = addData(tagFill, temp);
            }

            if(tagFill.length == 4){
                //Check for file data
                if(tagFill[3] == 0)
                    fileLib.addItem(mapParse.getAttribute(i));
                else if(tagFill[3] == 1)
                    tagLib.addItem(mapParse.getAttribute(i));

            }

            tagFill = null;

            
        }

        //Store the code, color, language, and other data
        //Try to find a good way to deal with those attributes

        /*
        int size = mapParse.size();

        for(int i = 0; i < size; i++){
            System.out.print("TAG "+i+":"+mapParse.getTags(i).length+" ");
            for(int j = 0; j < mapParse.getTags(i).length; j++)
                System.out.print(mapParse.getTags(i)[j]+" ");
            System.out.println();
        }//*/
        //Color and Language are separate attributes
    }

    public void run() {
        try{
            decodeFiles();
        }catch(Exception e){
            System.out.println(e.getStackTrace());
        }
    }
}
