package com.cwt.game;

import com.cwt.system.jslix.tools.FileFind;
import com.cwt.system.jslix.tools.FileIndex;

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

	/** Holds whether this screen is an Applet */
    private boolean isApplet;
    /** Holds whether all the outside data is loaded */
    private boolean ready;
    /** Holds the Thread associated with this object */
    private Thread looper;
    
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
    
    private void findObjects(){
    	FileFind fileFinder = new FileFind();
    	if(fileFinder.changeDirectory("image")){
    		fileFinder.refactor();
    		for(FileIndex file: fileFinder.getAllFiles()){
    			System.out.println("Object File:"+file.fpath);
    		}
    	}
    }
	

}
