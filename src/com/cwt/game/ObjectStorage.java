package com.cwt.game;

import com.cwt.game.tools.KeyStore;
import com.cwt.game.tools.ListStore;
import com.cwt.game.tools.RefStore;
import com.engine.EngineApi;
import com.jslix.io.FileFind;
import com.jslix.io.FileIndex;
import com.jslix.parser.XML_Parser;
import com.jslix.parser.XML_Writer;

/**
 * ObjectStorage.java
 *
 * This class looks for images within the file database and stores them
 * within a database.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 4.20.13
 */
public class ObjectStorage implements Runnable{
	
	/** Holds the max object representation fields. */
	public final int MAX_OBJECTS = 11;
	/** Integer representation for the file folder path */
	public final int FILE = 0;	
	/** Integer representation for code type */
	public final int CODE = 1;
	/** Integer representation for the object real name tag */
	public final int NAME = 2;
	/** Integer representation for the object map editor tag */
	public final int BASE = 3;
	/** Integer representation for the object game type */
	public final int TYPE = 4;
	/** Integer representation for the object connection */
	public final int CONNECTION = 5;
	/** Integer representation for the object weather */
	public final int WEATHER = 6;
	/** Integer representation for the object army faction */
	public final int ARMY = 7;
	/** Integer representation for the object overlap type (map editor) */
	public final int OVERLAP = 8;
	/** Integer representation for the object size */
	public final int SIZE = 9;
	/** Integer representation for the object direction */
	public final int DIRECTION = 10;
	
	/** Holds the integer representation for the terrain code */
	public final int TERRAIN = 0;
	/** Holds the integer representation for the property code */
	public final int PROPERTY = 1;
	/** Holds the integer representation for the unit code */
	public final int UNIT = 2;
	/** Holds the integer representation for the cursor code */
	public final int CURSOR = 3;

	/** Holds whether this screen is an Applet */
    private boolean isApplet;
    /** Holds whether all the outside data is loaded */
    private boolean ready;
    /** Holds the Thread associated with this object */
    private Thread looper;
    /** This is used to parse XML documents */
    private XML_Parser mapParse;
    
    /** Holds a list of file paths for each image object */
    private ListStore fileList;
    /** Holds a list of object names and base names for each image object */
    private ListStore nameList;
    /** Holds a list of object tile set types for each image object */
    private ListStore typeList;
    /** Holds a list of terrain connections for each image object */
    private ListStore connectList;
    /** Holds a list of acceptable code base items for each object */
    private RefStore codeList;
    /** Holds a list of acceptable weather items for each object */
    private RefStore weatherList;
    /** Holds a list of army factions for each image object */
    private ListStore armyList;
    /** Holds a list of all object data for each image object */
    protected KeyStore[] objList;
    
    /**
     * This class is responsible for all the object loading and storage of all
     * the map objects. It holds them in the smallest data types possible
     * and is optimized to look for matches and ignoring storage of empty
     * elements.
     */
    public ObjectStorage(){
    	objList = new KeyStore[0];
    	fileList = new ListStore();
    	nameList = new ListStore();
    	typeList = new ListStore();
    	connectList = new ListStore();
    	armyList = new ListStore();
    	codeList = new RefStore();
    	weatherList = new RefStore();
    	
    	mapParse = new XML_Parser();
    	ready = true;
        isApplet = true;
        initRef();
    }
    
    /**
     * This function initializes the references for each category with a reference list
     */
    private void initRef(){
    	//CODE REFERENCES
    	codeList.add(new String[]{"T.*","F.*"}, TERRAIN);//Terrain/Fields
    	codeList.add(new String[]{"P.*","B.*"}, PROPERTY);//Properties/Buildings
    	codeList.add("U.*", UNIT);//Units
    	codeList.add("C.*", CURSOR);//Cursor
    	
    	//WEATHER REFERENCES (https://github.com/ctomni231/cwtactics/tree/master/image#weather)
    	weatherList.add(new String[]{"C","CL.*"}, -1);//Clear [Default]
    	weatherList.add(new String[]{"S","SN.*"}, 0);//Snow
    	weatherList.add(new String[]{"R","RA.*"}, 1);//Rain
    	weatherList.add(new String[]{"D","SA.*"}, 2);//Sand Storm
    	weatherList.add(new String[]{"W","WI.*"}, 3);//Wind Storm (High Winds)
    	weatherList.add(new String[]{"H","HE.*"}, 4);//Heat Wave
    	weatherList.add(new String[]{"T","TH.*"}, 5);//Thunder Storm
    	weatherList.add(new String[]{"A","AC.*"}, 6);//Acid Rain (Radio-activity)
    	weatherList.add(new String[]{"Q","EA.*"}, 7);//Earthquake
    	
    	//ARMY FACTION REFERENCES (https://github.com/ctomni231/cwtactics/tree/master/image#army-factions)
    	armyList.add("GD");//Gray Diamond (Neutral) [Default]
    	armyList.add("OS");//Orange Star
    	armyList.add("BM");//Blue Moon
    	armyList.add("GE");//Green Earth
    	armyList.add("YC");//Yellow Comet
    	armyList.add("BH");//Black Hole
    	armyList.add("CR");//Crimson Ray
    	armyList.add("AV");//Arsenic Vortex
    	armyList.add("SS");//Sepia Sun
    	armyList.add("SF");//Scarlet Flare
    	armyList.add("IN");//Indigo Nebula
    	armyList.add("CS");//Cobalt Storm
    	armyList.add("PC");//Pink Cosmos
    	armyList.add("TG");//Teal Gravity
    	armyList.add("IE");//Indigo Eclipse
    	armyList.add("WN");//White Nova
    	armyList.add("CG");//Cream Galaxy
    	armyList.add("MO");//Magneta Orbit
    	armyList.add("JA");//Jade Asteroid
    }
    
    /**
     * This function sets whether the current game is an Applet. It is used
     * to regulate how items are loaded, and whether new items should be
     * searched.
     * @param set Whether this item is an Applet(T) or not(F)
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
     * This function gets all the game types for each Object stored within
     * @return All the object game types within this storage object
     */
    public String[] getTypeList(){
    	return typeList.getData();
    }
    
    /**
     * This function gets all the army factions for each Object stored within
     * @return All the object army factions within this storage object
     */
    public String[] getArmyList(){
    	return armyList.getData();
    }
    
    /**
     * This function is used to get file names from the KeyStore index list
     * @param index The index where the data is stored
     * @return A file path corresponding to the index
     */
    public String getFile(int index){
    	return fileList.getData(index);
    }
    
    /**
     * This function is used to get game types from the KeyStore index list
     * @param index The index where the data is stored
     * @return A game type corresponding to the index
     */
    public String getType(int index){
    	return typeList.getData(index);
    }
    
    /**
     * This function is used to get terrain connections from the KeyStore index list
     * @param index The index where the data is stored
     * @return A terrain connection corresponding to the index
     */
    public String getConnection(int index){
    	return connectList.getData(index);
    }
    
    /**
     * This function is used to get name abbreviations from the KeyStore index list
     * for the overlap, base, and name attributes
     * @param index The index where the data is stored
     * @return A name abbreviation corresponding to the index
     */
    public String getName(int index){
    	return nameList.getData(index);
    }
    
    /**
     * This function is used to get army factions from the KeyStore index list
     * @param index The index where the data is stored
     * @return A name abbreviation corresponding to the index
     */
    public String getArmy(int index){
    	return armyList.getData(index);
    }
	
	/**
     * This function runs the loading in a separate thread
     */
    //@Override
    public void run() {
        try{
            decodeFiles();
        }catch(Exception e){
            System.err.println(e.toString());
        }
    }

    
    /**
     * This function is used to find and load the objects that will be used
     * for the game. This also loads the game engine that will be used
     * for the map screen.
     */
    private void decodeFiles(){
    	EngineApi.loadEngine();
	    EngineApi.loadDevStuff();
        if(!isApplet)   findObjects();
        loadObjects();
        ready = true;
    }
    
    /**
     * This function searches through your system for objects and
     * organizes them in an XML file so they can be selected.
     */
    private void findObjects(){
    	FileFind fileFinder = new FileFind();
    	XML_Writer writer = new XML_Writer("data","objectlist.xml");   	

    	if(fileFinder.changeDirectory("image")){
    		fileFinder.refactor();
	        writer.addXMLTag("object");
	
	        for(FileIndex file: fileFinder.getAllFiles()){
	            if(!file.isDirectory){
	                writer.addXMLTag("list");
	                writer.addAttribute("file", file.fpath, true);
	            }
	        }
    	}
    	
    	writer.endAllTags();
        //writer.print();
        writer.writeToFile(true);
    }
    
    /**
     * This function loads the objects from the file name list specified.
     */
    private void loadObjects(){
    	String[] entries = new String[0];
    	//This gets all image entries from the XML files specified
    	entries = getEntries(entries, "data/objectlist.xml");
        //This loads all the entries into the database
        entries = loadEntries(entries, "data/objload.xml");
    }
    
    /**
     * This function get all entries from a path specified from an XML file
     * @param entries The array holding all the entries
     * @param path The path to the XML file to be parsed
     * @return A updated list appending all new entries to the list
     */
    private String[] getEntries(String[] entries, String path){
    	mapParse.parse(path);
    	int[] entryLocation = mapParse.getLocation("object list");
        for(int i = 0; i < entryLocation.length; i++)
        	entries = addData(entries, mapParse.getAttribute(entryLocation[i], "file"));
        mapParse.clear();
    	return entries;
    }
    
    /**
     * This function loads all the current entries into the database
     * @param entries The array holding the entries
     * @return A updated list appending all new entries to the list
     */
    private String[] loadEntries(String[] entries, String path){
    	mapParse.parse(path);
    	String[] temp;
    	for(String entry: entries){
    		//System.out.println("DATA: "+entry);
    		temp = parseSplit(splitEntry(entry));   		
    		if(!temp[CODE].isEmpty())
    			parseCategory(temp);
        }
    	mapParse.clear();
    	return entries;
    }
    
    /**
     * This function takes a picture file entry and splits it into categories
     * for storage into the database
     * @param entry The image file path
     * @return The entry split into smaller word sections for database use
     */
    private String[] splitEntry(String entry){
    	String[] split = new String[MAX_OBJECTS];
    	//Splits the letters out of the program
    	String[] chars = entry.split("[A-Za-z0-9-]+");
    	//Splits the characters out of the program
    	String[] temp = entry.split("[_~/.]{1}");
    	
    	//Sorts the name and connection types into categories
    	split[FILE] = entry;
    	for(int i = 0; i < temp.length; i++){
    		if(chars[i].matches("_")){
    			if(chars[i-1].matches("/"))
    				split[TYPE] = temp[i-1];
    			else if(chars[i-1].matches("_"))
    				split[NAME] = temp[i-1];
    		}else if(chars[i].matches("[~.]")){
    			if(chars[i-1].matches("_") && split[NAME] == null)
    				split[NAME] = temp[i-1];
    			else if(chars[i-1].matches("_"))
    				split[ARMY] = temp[i-1];
    			else if(chars[i].matches("[.]") && chars[i-1].matches("~"))
    				split[CONNECTION] = temp[i-1];
    		}			
    	}
    	
    	//Gives default values for the rest of the items
    	for(int i = 0; i < MAX_OBJECTS; i++){
    		if(split[i] == null)
    			split[i] = "";
    	}
    	
    	//Sorts the overlap type into a category
    	temp = split[NAME].split("[-]");
    	if(temp.length > 1){
    		split[NAME] = temp[0];
    		split[OVERLAP] = temp[1];
    	}
    	
    	//Sorts the weather type into a category
    	temp = split[TYPE].split("[-]");
    	if(temp.length > 1){
    		split[TYPE] = temp[0];
    		split[WEATHER] = temp[1];
    	}
    	
    	return split;
    }
    
    /**
     * This function uses an XML file to further categorize the object files
     * @param entries The array holding all the split categories
     * @param path The path to the XML file to be parsed
     * @return A updated list appending all new categories to the entry
     */
    private String[] parseSplit(String[] split){  	  	
    	//This parses the folders and gets the code base for each item
    	int[] entryLocation = mapParse.getLocation("object list");    	
        for(int i = 0; i < entryLocation.length; i++){
        	if(split[FILE].startsWith(mapParse.getAttribute(entryLocation[i], "file")))
        		split[CODE] = mapParse.getAttribute(entryLocation[i], "code");
        }
        
       //This parses the name and gives a base name for the map editor to sort items
        entryLocation = mapParse.getLocation("object edit");
        for(int i = 0; i < entryLocation.length; i++){
        	split[BASE] = split[NAME];
        	if(split[NAME].matches(mapParse.getAttribute(entryLocation[i], "name")))
        		split[BASE] = mapParse.getAttribute(entryLocation[i], "base");
        }
        
        /*//Test to see if everything is running okay
    	for(int i = 0; i < MAX_OBJECTS; i++)
    		System.out.println("S"+i+":"+split[i]);//*/
        
    	return split;
    }
    
    private void parseCategory(String[] split){
    	KeyStore temp = new KeyStore();
    	//File category
    	if(!split[FILE].isEmpty())
    		temp.addData(FILE, fileList.addData(split[FILE]));
    	//Code category
    	if(!split[CODE].isEmpty())
    		temp.addData(CODE, codeList.get(split[CODE]));
    	//Name category
    	if(!split[NAME].isEmpty())
    		temp.addData(NAME, nameList.addData(split[NAME]));
    	//Base category
    	if(!split[BASE].isEmpty())
    		temp.addData(BASE, nameList.addData(split[BASE]));
    	//Type category
    	if(!split[TYPE].isEmpty())
    		temp.addData(TYPE, typeList.addData(split[TYPE]));
    	//Connection category
    	if(!split[CONNECTION].isEmpty())
    		temp.addData(CONNECTION, connectList.addData(split[CONNECTION]));
    	//Weather category
    	if(!split[WEATHER].isEmpty())
    		temp.addData(WEATHER, weatherList.get(split[WEATHER]));
    	//Army Faction category
    	if(!split[ARMY].isEmpty())
    		temp.addData(ARMY, armyList.addData(split[ARMY]));
    	//Overlap category
    	if(!split[OVERLAP].isEmpty())
    		temp.addData(OVERLAP, nameList.addData(split[OVERLAP]));
    	//Size category - Not necessary yet (follows the CODE convention)
    	//Direction category - Not necessary yet (follows the CODE convention)
    	//Color category - Not necessary yet (follows the FILE convention)
    	//Blend category - Not necessary yet (follows the FILE convention)
    	//Random category - Not necessary yet
    	//Animation category - Can be done using image width and height values
    	
    	//Adds a new Object to the object List
    	objList = addData(objList, temp);
    	//System.out.println("Success!! ENTRY="+objList.length);
    }
    
    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private String[] addData(String[] fillData, String data){
        if(fillData == null)
            fillData = new String[0];

        String[] temp = fillData;
        fillData = new String[temp.length+1];
        for(int i = -1; i++ < temp.length-1;)
            fillData[i] = temp[i];
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
        for(int i = -1; i++ < temp.length-1;)
            fillData[i] = temp[i];
        fillData[fillData.length-1] = data;

        return fillData;
    }

}
