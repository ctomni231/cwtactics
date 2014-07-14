package com.util.converter;

import java.awt.Image;
import java.io.IOException;
import java.net.URL;

import javax.imageio.ImageIO;

/**
 * MapSplit.java
 * 
 * This takes a map and splits it into pieces. Follows it up by
 * checking it against the existing types of tiles. Finally, it
 * takes that data and converts it to the proper text representation.
 * 
 * @author Carr, Crecen
 * @version 05.01.14
 *
 */	
public class MapSplit {
	
	/** This holds the tile size for all tiles in the map **/
	private final int TILE = 16;
	
	/** This holds the map width **/
	private int mapWidth;
	/** This holds the map height **/
	private int mapHeight;
	/** Stores the mapData in Headphone's map format **/
	private String mapData;
	/** Holds all the images needed for the map **/
	private ImageGrab imgHold;
	
	public MapSplit(){
		mapWidth = 0;
		mapHeight = 0;
	}
	
	/**
	 * This function takes in a url pointing to an image file within AWBW directory of image
	 * files. This specifically looks for a map image file.
	 * @param url The URL pointing to the image
	 * @throws IOException This is called if the image can't be found.
	 */
	public void setImage(URL url) throws IOException{
		setImage(ImageIO.read(url));
	}
	
	/**
	 * This function takes in a url pointing to an image file within AWBW directory of image
	 * files. This specifically looks for a map image file.
	 * @param map The image containing a map to be read into the system
	 */
	public void setImage(Image map){
		getMap(map);
	}
	
	/**
	 * This gets the map data associated with a specific map
	 * @return The mapData for the map...
	 */
	public String getData(){
		return mapData;
	}
	
	/**
	 * This gets the map image and sets up the function
	 * for getting all the key images
	 * @param map The image containing the map
	 */
	private void getMap(Image map){
		imgHold = new ImageGrab();
		
		//An empty String for the mapData
		mapData = "";
		
		//Add the map image twice on purpose
		imgHold.addImage(map);
		imgHold.addImage(map);
		
		//Then get all the key images
		imgHold.organizeImages(true);
		
		//Cut them all to the proper size and position
		for(int i = 2; i < imgHold.length(); i++){
			imgHold.addImage(i, imgHold.getImage(i, 0, imgHold.getOrigY(i)-TILE, TILE/2, TILE/4));
		}
		
		//Store the width and height of the map
		mapWidth = imgHold.getOrigX(0);
		mapHeight = imgHold.getOrigY(0);
		
		for(int j = 0; j < mapHeight/TILE; j++){
			for(int i = 0; i < mapWidth/TILE; i++){
				imgHold.addImage(1, imgHold.getImage(0, i*TILE, j*TILE, TILE/2, TILE/4));
				for(int k = 2; k < imgHold.length(); k++){
					//Get the matching String Literal for the item and place it
					//in the String, then continue...
					if(match(imgHold.getPixels(1), imgHold.getPixels(k))){
						for(String key: imgHold.getFileList()){
							//The huge switch statement
							if(imgHold.getIndex(key) == k){
								//System.out.println(key);
								if(key.matches(".*pla.*"))
									mapData += ".";
								else if(key.matches(".*woo.*"))
									mapData += "@";
								else if(key.matches(".*mou.*"))
									mapData += "^";
								else if(key.matches(".*ree.*"))
									mapData += "%";
								else if(key.matches(".*riv.*"))
									mapData += "~";
								else if(key.matches(".*roa.*"))
									mapData += "=";
								else if(key.matches(".*sho.*"))
									mapData += "<";
								else if(key.matches(".*sea.*"))
									mapData += ",";
								else if(key.matches(".*bri.*"))
									mapData += "[";
								else if(key.matches(".*pip.*"))
									mapData += "?";
								break;
							}
						}
						break;
					}
					//Get the null '0' character and put it into the string...
					if(k == imgHold.length()-1)
						mapData += "0";
				}
			}
			//Add a newline to the String...
			mapData += "\r\n";
		}
	}
	
	/**
	 * This checks to see if two pixel arrays match entirely
	 * @param mapPix The first tile array
	 * @param tilePix The second tile array
	 * @return Whether the tile arrays match (T) or not (F)
	 */
	private boolean match(int[] mapPix, int[] tilePix){
		for(int i = 0; i < mapPix.length; i++){
			if(mapPix[i] != tilePix[i])
				return false;
		}
		return true;
	}
}
