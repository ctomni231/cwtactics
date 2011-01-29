package com.cwt.map;

import com.cwt.system.jslix.tools.FileFind;
import com.cwt.system.jslix.tools.FileIndex;
import com.cwt.system.jslix.tools.XML_Parser;
import com.cwt.system.jslix.tools.XML_Writer;
import static com.yasl.logging.Logging.*;

/**
 * MapElement.java
 *
 * This class converts XML files into game data. All graphical elements
 * will be compacted into this format within this class.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.28.11
 * @todo TODO Work on completing the sorting of terrain data first
 */

public class MapElement implements Runnable{

    //public static final byte CODE = 0;//Holds the type of object this is
    //public static final byte NAME = 1;//Holds the name reference to this object
    //public static final byte BASE = 2;//Holds the object grouping type
    //public static final byte TYPE = 3;//Holds which game this object belongs to
    //public static final byte SIZE = 4;//Holds the viewing size on an object
    //public static final byte DIRECTION = 5;//Holds the direction of this object
    //public static final byte ARMY = 6; //Holds the faction of this object
    //public static final byte WEATHER = 7;//Holds the weather of this object
    //public static final byte FILE = 8;//Holds the object memory location
    //public static final byte TAGS = 9;//Holds the object type connection data
    //public static final byte COLOR = 10;//Holds the object default colors
    //public static final byte RANDOM = 11;//Holds data for random objects
    //public static final byte ANIMATE = 12;//Holds object animation data

    public static final byte CODE = 0;
    public static final byte DATA = 1;
    public static final byte GRAPHIC = 2;
    public static final byte FILE = 3;
    public static final byte TAGS = 4;
    public static final byte RANDOM = 5;
    public static final byte COLOR = 6;

    private boolean isApplet;//Holds whether this screen is an applet
    private boolean ready;//Holds whether all the outside data is loaded
    private Thread looper;//Holds the Thread associated with this object

    private int[] tagFill;
    private KeyStore[] dataItems;
    private KeyStore item;
    private XML_Parser mapParse;
    private FileStorage fileLib;
    private GraphicStorage picLib;
    private DataStorage dataLib;
    private ColorStorage colorLib;
    private TagStorage tagLib;
    private ListStore nameLib;
    private ListStore baseLib;
    private ListStore typeLib;
    private ListStore armyLib;
    private DataStore randLib;
    private DataStore animLib;

    private int tagTrack;
    private int dataTrack;

    public MapElement(){
        mapParse = new XML_Parser();
        fileLib = new FileStorage();
        tagLib = new TagStorage();
        picLib = new GraphicStorage();
        dataLib = new DataStorage();
        colorLib = new ColorStorage();
        nameLib = new ListStore();
        baseLib = new ListStore();
        typeLib = new ListStore();
        armyLib = new ListStore();
        randLib = new DataStore();
        animLib = new DataStore();
        tagTrack = 0;
        dataTrack = 0;
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

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
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
     * This class stores the tags within the array in a way that keeps the
     * class from taking up too much memory
     * @param store The data storage class to change
     * @param index The index where this item is to be stored
     * @param data The data of this particular item
     * @return Returns the altered storage class
     */
    private DataStore storeData(DataStore store, int index, int data){
        if(item.checkCode(index)){
            if(item.getData(index) < -1){
                store.addNewLayer();
                store.addData((item.getData(index)*-1) - 2);
                item.replaceData(index, store.addData(data));
            }else
                store.addData(item.getData(index), data);
        }else
            item.addData(index, (data+2)*-1);

        return store;
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
        //loadRef();

        for(int i = 0; i < entryLocation.length; i++)
            entries[i] = mapParse.getAttribute(entryLocation[i], "file");
        
        for(String entry: entries){
            log("DATA: "+entry);
            parseData(entry);
        }

    }

    private void parseData(String entry){
        mapParse.parse(entry);

        for(int temp = 0, i = 0; i < mapParse.size(); i++){
            //This loop checks to see if all tags are valid
            for(int j = 0; j < mapParse.getTags(i).length; j++){
                temp = (int)CodeStorage.checkAll(j, mapParse.getTags(i)[j]);
                if(CodeStorage.checkAll(j, mapParse.getTags(i)[j]) == -1){
                    if(i == 0){
                        warn(mapParse.getTags(i)[0]+" not recognized");
                        return;
                    }else
                        continue;
                }

                tagFill = addData(tagFill, temp);
            }

            if(tagFill.length == 4){
                switch(tagFill[3]){ 
                    case 0:
                        //Check for file data
                        temp = fileLib.addItem(mapParse.getAttribute(i));

                        if(dataItems == null || temp+1 == fileLib.size()){
                            item = new KeyStore();
                            animLib = storeData(animLib, FILE, temp);
                            dataItems = addData(dataItems, item);
                        }else if (temp >= 0){
                            item = dataItems[temp];
                            animLib = storeData(animLib, FILE, temp);
                            dataItems[temp] = item;
                        }
                        break;
                    case 1:
                        //Check for tag data
                        tagLib.addItem(mapParse.getAttribute(i));
                        break;
                }
            }

            else if(tagFill.length == 3){
                switch(tagFill[2]){
                    case 0:
                        //Check for graphic data
                        if(tagTrack != fileLib.size()){
                            temp = tagLib.addItem();
                            for(int j = tagTrack; j < fileLib.size(); j++){
                                dataItems[j].addData(TAGS, temp);
                                dataItems[j].addData(GRAPHIC, picLib.addItem(
                                       mapParse.getAttribute(i)));
                            }
                            
                            temp = picLib.addItem(mapParse.getAttribute(i));
                            for(int j = dataTrack; j < fileLib.size(); j++){
                                if(dataItems[j].getData(GRAPHIC) == temp){
                                    item = dataItems[j];
                                    randLib = storeData(randLib, RANDOM, temp);
                                    dataItems[j] = item;
                                    break;
                                }
                            }
                            dataItems[tagTrack].replaceData(
                                    FILE, animLib.size());
                            tagTrack = fileLib.size();
                        }                       
                }
            }

            else if(tagFill.length == 2){
                switch(tagFill[1]){
                    case 0:
                        //Check for basic data
                        temp = dataLib.addItem(mapParse.getAttribute(i));
                        for(int j = dataTrack; j < fileLib.size(); j++){
                            dataItems[j].addData(DATA, temp);
                            dataItems[j].addData(COLOR, colorLib.addItem());
                        }
                        dataTrack = fileLib.size();
                        break;
                    case 1:
                        //Check for color data
                        colorLib.addItem(mapParse.getAttribute(i));
                        break;
                    case 2:
                        //Check for language data
                }
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
            warn(e.toString());
        }
    }
}
