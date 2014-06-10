package com.util.converter;

import java.util.Scanner;

/**
 * PageGrab.java
 * 
 * A simple page meant to grab the relevant parts of the HTML page
 * given to it and to pull out only the data that matters. This is
 * specifically made for the AWBW maps.
 * 
 * @author Carr, Crecen
 * @version 05.03.14
 *
 */

//Map starts at X=155, Y=95
//First tile starts at X=156, Y=96
//So you subtract the image height from the tile height to get real location on the map
//HQ starts at X=156, Y=81
//31 - 16 = 15 so 81 + 15 = 96 (True tile position...)

//I guess this means I need images for this after all, but just for the props

public class PageGrab {
	
	private String[] uniList;
	private String[] propList;
	
	/** This holds all the images used for reference **/
	private ImageGrab imgHold;
	/** This holds the map name **/
	private String mapName;
	/** This holds the map owners **/
	private String mapOwner;
	
	private String[] obj;
	private int[] posx;
	private int[] posy;
	
	//I have to hack this one together to grab all the map data
	//I don't have any choice really
	public String data;
	
	public PageGrab(){
		//The unit literals
		uniList = new String[]{"anti", "apc", "arti", "copt", "boat", "bomb", "carr", "crui",
						"figh", "infa", "land", "tank", "miss", "pipe", "mech", "recn",
						"rock", "stea", "sub"};
		
		//The property literals
		propList = new String[]{"hq", "port", "base", "city", "comt", "lab"};
		
		//This gets all the images for the page
		imgHold = new ImageGrab();
		mapName = "";
		mapOwner = "";
		data = "";
	}
	
	/**
	 * This function was designed to take the HTML from the AWBW page and extract the unit
	 * and property data from the page.
	 * @param html HTML text from the HTML page
	 */
	public String setData(String html){
		String[] split = html.split("<");
		String temp;
		boolean notMapData = true;
		//name = "";
		data = "";
		mapName = "";
		mapOwner = "";
		for(int i = 0; i < split.length; i++){
			System.out.println(split[i]);
			if(split[i].startsWith("td valign=top"))
				notMapData = false;
			if(notMapData)
				continue;
			
			//This is the name of the map
			if(mapName.isEmpty() && split[i].startsWith("b>")){
				mapName = split[i].substring(2);
				data += "Map: " + mapName + "\r\n";
				
			}else if(mapOwner.isEmpty() && split[i].startsWith("a href")){
				mapOwner = split[i].substring(split[i].indexOf(">")+1);
				data += "Owner: " + mapOwner + "\r\n";
			}
			//I'm not going to do a full conversion, because I have to get all the maps
			else if(split[i].startsWith("span style") || split[i].startsWith("img src")){
				data += split[i] + "\r\n";
			}
			
			
			//I have to extract the x, y, and maptype from each span style...
			//It looks like below...
			
			//span style='left:492; top:110; position:absolute; border: 0px; z-index:100;'>
			//img src=http://awbw.amarriner.com:8080/terrain/aw1/neutralairport.gif>
			if(split[i].startsWith("table"))
				notMapData = true;
			
		}
		
		//System.out.println("Owner: "+ mapOwner +" Map: "+ mapName);
		return data;
	}
	
	private String makeReadable(String urlData){
		String data = "";
		for(int i = 0; i < urlData.length(); i++){
			data += urlData.charAt(i);
			if(urlData.charAt(i) == '>')
				data += "\r\n";
		}
		
		return data;
	}

}
