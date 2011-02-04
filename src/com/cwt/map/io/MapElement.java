package com.cwt.map.io;

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
 * @version 01.31.11
 */

public class MapElement implements Runnable{

    public static final byte CODE = 0;//Holds the type of object this is
    public static final byte DATA = 1;//Holds the object naming attributes
    public static final byte GRAPHIC = 2;//Holds the object type attributes
    public static final byte FILE = 3;//Holds the object memory location
    public static final byte TAGS = 4;//Holds the object type connection data
    public static final byte RANDOM = 5;//Holds data for random objects
    public static final byte COLOR = 6;//Holds the object default colors

    private boolean isApplet;//Holds whether this screen is an applet
    private boolean ready;//Holds whether all the outside data is loaded
    private Thread looper;//Holds the Thread associated with this object

    private int[] tagFill;//This stores all the tag elements used
    private KeyStore[] dataItems;//This is the main storage area for objects
    private KeyStore item;//This temporarily assists the main storage area
    private XML_Parser mapParse;//This is used to parse XML documents
    private FileStorage fileLib;//This stores all the file XML tag information
    private GraphicStorage picLib;//This stores graphic XML tag information
    private DataStorage dataLib;//This stores all the data XML tag information
    private ColorStorage colorLib;//This stores the color XML tag information
    private TagStorage tagLib;//This stores the tag XML tag information
    private LangStorage langLib;//This stores the language XML tag information
    private DataStore randLib;//This stores the random object list
    private DataStore animLib;//This stores the animation object list

    private int tagTrack;//This keeps track of the animation list
    private int dataTrack;//This keeps track of the random object list

    /**
     * This class is responsible for all the object loading and storage of all
     * the map objects. It holds them in the smallest data types possible
     * and is optimized to look for matches and ignoring storage of empty
     * elements.
     */
    public MapElement(){
        mapParse = new XML_Parser();
        fileLib = new FileStorage();
        tagLib = new TagStorage();
        picLib = new GraphicStorage();
        dataLib = new DataStorage();
        colorLib = new ColorStorage();
        langLib = new LangStorage();
        randLib = new DataStore();
        animLib = new DataStore();
        tagTrack = 0;
        dataTrack = 0;
        ready = true;
        isApplet = true;
    }

    /**
     * This function sets whether the current game is an Applet. It is used
     * to regulate how items are loaded, and whether new items should be
     * searched.
     * @param set Whether this item is an applet(T) or not(F)
     */
    public void setApplet(boolean set){
        isApplet = set;
    }

    /**
     * This function gives you information about whether all the objects
     * are loaded into memory
     * @return Whether all objects are loaded(T) or not(F)
     */
    public boolean isReady(){
        return ready;
    }

    /**
     * This function is used to set a new Thread in where to decode all
     * the object files. The process is done separately so the user can
     * still navigate the game while objects are loading into the system.
     */
    public void decode(){
        ready = false;
        looper = new Thread(this);
        looper.start();
    }

    /**
     * This function is used to find and load the objects that will be used
     * for the game. 
     */
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

    /**
     * This function loads the objects from the file name list specified.
     */
    private void loadObjects(){
        mapParse.parse("data/filelist.xml");
        int[] entryLocation = mapParse.getLocation("object list");
        String[] entries = new String[entryLocation.length];

        for(int i = 0; i < entryLocation.length; i++)
            entries[i] = mapParse.getAttribute(entryLocation[i], "file");
        
        for(String entry: entries){
            log("DATA: "+entry);
            parseData(entry);
        }

    }

    /**
     * THis file searches and parses each XML file in the file list and turns
     * it into a list of storage. The process is optimized to take up the
     * least memory possible to store objects
     * @param entry The XML file to parse
     */
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
                            animLib.addNewLayer();
                        }                       
                }
            }

            else if(tagFill.length == 2){
                switch(tagFill[1]){
                    case 0:
                        //Check for basic data
                        if(dataTrack != fileLib.size()){
                            temp = dataLib.addItem(mapParse.getAttribute(i));
                            for(int j = dataTrack; j < fileLib.size(); j++){
                                dataItems[j].addData(DATA, temp);
                                dataItems[j].addData(COLOR,
                                    colorLib.addItem());
                                dataItems[j].addData(CODE, CodeStorage.
                                    checkAll(CODE, mapParse.getTags(i)[CODE]));
                            }
                            dataTrack = fileLib.size();
                        }
                        break;
                    case 1:
                        //Check for color data
                        colorLib.addItem(mapParse.getAttribute(i));
                        break;
                    case 2:
                        //Check for language data
                        dataLib.setLanguage(langLib.getItem(
                                mapParse.getAttribute(i)));
                        break;
                }
            }

            tagFill = null;            
        }

        //FOR QUICK TESTING PURPOSES
        /*
        for(int i = 0; i < dataItems.length; i++){
            int[] temp = dataItems[i].getData();
            for(int j = 0; j < temp.length; j++){
                System.out.print(temp[j]+",");
            }
            System.out.println();
        }//*/

        //UNCOMMENT TO SEE LOADING ICON
        //while(true){}

        //UNCOMMENT TO SEE ALL THE XML TAGS
        /*
        int size = mapParse.size();

        for(int i = 0; i < size; i++){
            System.out.print("TAG "+i+":"+mapParse.getTags(i).length+" ");
            for(int j = 0; j < mapParse.getTags(i).length; j++)
                System.out.print(mapParse.getTags(i)[j]+" ");
            System.out.println();
        }//*/
    }

    /**
     * This function runs the loading in a separate thread
     */
    public void run() {
        try{
            decodeFiles();
        }catch(Exception e){
            warn(e.toString());
        }
    }
}
