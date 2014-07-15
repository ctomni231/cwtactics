package com.util.converter;

import com.util.converter.tools.FileFind;
import com.util.converter.tools.FileIndex;
import com.util.converter.tools.ImgLibrary;

/**
 * ImageGrab.java
 * 
 * Produced just to grab relevant images for scanning from AWBW.
 * 
 * @author Carr, Crecen
 * @version 05.01.14
 */
public class ImageGrab extends ImgLibrary{

	/** This holds the path to the image files **/
	public final String PATH = "refimg";
	
	/** Used to find all the files within a folder **/
	private FileFind finder;
	/** Holds the text literals for finding terrain **/
	private String[] terList;
	/** Holds the text literals for finding units & properties **/
	private String[] uniList;
	/** Holds a list of files used with the program **/
	private String[] fileList;
	
	ImageGrab(){
		super();
	}
	
	/**
	 * This class pulls all the images from image and sorts the
	 * important ones into the key.
	 * @param terImg Either searches for terrain (T) or non-terrain (F) images
	 */
	public void organizeImages(boolean terImg){
		//The unit & property literals
		uniList = new String[]{"anti", "apc", "arti", "copt", "boat", "bomb", "carr", "crui",
				"figh", "infa", "land", "tank", "miss", "pipe", "mech", "recon", "ship",
				"rock", "stea", "sub", "port", "base", "city", "comt", "lab", "hq", "seam"};
		//The terrain literals
		terList = new String[]{"plai", "wood", "rive", "reef", "sea", "road", 
				"brid", "moun", "shoa", "pip"};
		//Initialize the String, just in case
		fileList = new String[0];
		
		finder = new FileFind();
		if(!finder.exists(PATH)){
			System.err.println("Key Images failed to load.");
			return;
		}
		
		finder.changeDirectory(PATH);
		for(FileIndex index : finder.getAllFiles()){
			//Have to get a batch of images for each type you need into the key database...
			for(String regex: terImg ? terList : uniList){
				if(index.fname.matches(".*"+regex+".*")){
					this.addImage(index.fpath);
					this.addReference(index.fname, this.length()-1);
					fileList = addData(fileList, index.fpath);
					break;
				}
			}
		}
	}
	
	/**
	 * This function just returns the list of the files used
	 * @return Gets a File List of all the matching files
	 */
	public String[] getFileList(){
		return fileList;
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
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}