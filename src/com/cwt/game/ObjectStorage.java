package com.cwt.game;

import com.cwt.system.jslix.tools.FileFind;
import com.cwt.system.jslix.tools.FileIndex;
import com.cwt.system.jslix.tools.XML_Parser;
import com.cwt.system.jslix.tools.XML_Writer;

/**
 * ObjectStorage.java
 *
 * This class looks for images within the file database and stores them
 * within a database.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.10.12
 */
public class ObjectStorage implements Runnable{
	
	/** Holds the max object representation fields. */
	public final int MAX_OBJECTS = 10;
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
	/** Integer representation for the object army faction */
	public final int ARMY = 5;
	/** Integer representation for the object weather */
	public final int WEATHER = 6;
	/** Integer representation for the object size */
	public final int SIZE = 7;
	/** Integer representation for the object direction */
	public final int DIRECTION = 8;
	/** Integer representation for the object connection */
	public final int CONNECTION = 9;

	/** Holds whether this screen is an Applet */
    private boolean isApplet;
    /** Holds whether all the outside data is loaded */
    private boolean ready;
    /** Holds the Thread associated with this object */
    private Thread looper;
    /** This is used to parse XML documents */
    private XML_Parser mapParse;
    /** Holds the folder paths used to find objects */
    private String[][] objectPath;
    
    /**
     * This class is responsible for all the object loading and storage of all
     * the map objects. It holds them in the smallest data types possible
     * and is optimized to look for matches and ignoring storage of empty
     * elements.
     */
    public ObjectStorage(){
    	mapParse = new XML_Parser();
        objectPath = new String[MAX_OBJECTS][];
    	ready = true;
        isApplet = true;
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
     * This function runs the loading in a separate thread
     */
    @Override
    public void run() {
        try{
            decodeFiles();
        }catch(Exception e){
            System.err.println(e.toString());
        }
    }

    
    /**
     * This function is used to find and load the objects that will be used
     * for the game. 
     */
    private void decodeFiles(){
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
        entries = loadEntries(entries);
    }
    
    /**
     * This function get all entries from a path specified from an XML file
     * @param path The path to the XML file to be parsed
     * @param entries The array holding the entries
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
    private String[] loadEntries(String[] entries){
    	String[] temp;
    	for(String entry: entries){
    		System.out.println("DATA: "+entry);
    		temp = splitEntry(entry);
    		for(int i = 0; i < MAX_OBJECTS; i++)
    			objectPath[i] = addData(objectPath[i], temp[i]);    			
            //parseData(entry);
        }
    	return entries;
    }
    
    /**
     * This function takes a picture file entry and split it into sections
     * for storage into the database
     * @param entry The image file path
     * @return The entry split into smaller word sections for database use
     */
    private String[] splitEntry(String entry){
    	String[] split = new String[MAX_OBJECTS];
    	//Splits the letters out of the program
    	String[] chars = entry.split("[A-Za-z0-9]+");
    	//Splits the characters out of the program
    	String[] temp = entry.split("[_~/.]{1}");
    	
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
    	
    	for(int i = 0; i < MAX_OBJECTS; i++){
    		if(split[i] == null)
    			split[i] = "";
    		//System.out.println("S"+i+":"+split[i]);
    	}
    	
    	return split;
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

}
