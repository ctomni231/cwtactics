package com.cwt.game;

import com.cwt.system.jslix.tools.FileFind;
import com.cwt.system.jslix.tools.FileIndex;
import com.cwt.system.jslix.tools.XML_Writer;

/**
 * ObjectStorage.java
 *
 * This class looks for images within the file database and stores them
 * within a database.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.30.12
 */
public class ObjectStorage implements Runnable{
	
	/** Integer representation for terrain objects */
	public final int TERRAIN = 0;
	/** Integer representation for property objects */
	public final int PROPERTY = 1;
	/** Integer representation for unit objects */
	public final int UNIT = 2;
	/** Integer representation for cursor objects */
	public final int CURSOR = 3;

	/** Holds whether this screen is an Applet */
    private boolean isApplet;
    /** Holds whether all the outside data is loaded */
    private boolean ready;
    /** Holds the Thread associated with this object */
    private Thread looper;
    /** Holds the folder paths used to find objects */
    private String[] filePath;
    
    /**
     * This class is responsible for all the object loading and storage of all
     * the map objects. It holds them in the smallest data types possible
     * and is optimized to look for matches and ignoring storage of empty
     * elements.
     */
    public ObjectStorage(){
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
        //loadObjects();
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
