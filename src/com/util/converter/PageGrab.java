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
	public final String GAMENAME = "AWBW - Advance Wars By Web";

	/** Holds the default tile size for AWBW maps */
	public final int TILESIZE = 16;
	/** The default x-axis start of AWBW maps */
	public final int MAPX = 156;
	/** The default y-axis start of AWBW maps */
	public final int MAPY = 96;
	
	/** This holds all the file name unit literals for AWBW HTML maps*/
	private String[] uniList;
	/** This holds all the CWT conversion for the unit literals */
	private String[] uList;
	/** This holds all the file name property literals for AWBW HTML maps */
	private String[] propList;
	/** This holds all the CWT conversion for the property literals */
	private String[] pList;
	/** This holds all the full names for each faction in the AWBW HTML maps */
	private String[] factionList;
	/** This holds all the abbreviations for each army faction in the AWBW HTML maps */
	private String[] armyList;
	/** This holds how many armies are in the map */
	private boolean[] aList;
	
	/** This holds all the images used for reference */
	private ImageGrab imgHold;
	/** This holds the map name */
	private String mapName;
	/** This holds the map owners */
	private String mapOwner;
	/** This holds the game the the map is from */
	private String mapGame;
	/** This holds the Scanner needed for the maps */
	private Scanner scan;
	
	//I have to hack this one together to grab all the map data
	//I don't have any choice really
	/** Grabs all the data of the map */
	public String data;
	
	public PageGrab(){
		//The unit literals
		uniList = new String[]{"anti", "apc", "arti", "b-copter", "blackboat", "blackbomb",
						"bomber", "carrier", "cruiser", "fighter", "infantry", "lander",
						"md", "mech","megatank", "missile", "neotank", "runner", "recon",
						"rocket", "stealth", "sub", "t-copter", "tank"};
		
		//The CWT unit literals
		uList = new String[]{"AAIR", "APCR", "ARTY", "BCTR", "BKBT", "BKBM",
						"BMBR", "ACAR", "CRUS", "FGHT", "INFT", "LNDR",
						"MDTK", "MECH", "WRTK", "MISS", "NTNK", "PRNR", "RECN",
						"RCKT", "STLH", "SUBM", "TCTR", "TANK"};
		
		//The property literals
		propList = new String[]{"air", "base", "city", "comtower", "hq", "lab", "port", "silo", "seam"}; 
		
		//The CWT property literals
		pList = new String[]{"APRT", "BASE", "CITY", "CMTR", "HQTR", "LABS", "SPRT", "SILO", "PIPS"};
		
		//The full word faction literals
		factionList = new String[]{"orangestar", "bluemoon", "yellowcomet", "greenearth",
								"blackhole", "redfire", "greysky", "browndesert",
								"amberblaze", "jadesun", "cobaltice", "pinkcosmos",
								"tealgalaxy", "purplelightning"};
		
		//The abbreviated army literals
		armyList = new String[]{"os", "bm", "yc", "ge", "bh", "rf", "gs", "bd", "ab", 
							"js", "ci", "pc", "tg", "pl"};
		
		//The amount of players in a session
		resetPlayers();
		
		//This gets all the images for the page
		imgHold = new ImageGrab();
		
		//Makes sure the map name is empty
		mapName = "";
		//Makes sure the map owner is empty
		mapOwner = "";
		//The name of this particular game
		mapGame = GAMENAME;
	}
	
	/**
	 * This function was designed to take the HTML from the AWBW page and extract the unit
	 * and property data from the page.
	 * @param html HTML text from the HTML page
	 */
	public String setData(String html){
		String[] split = html.split("<");
		String data = "";
		boolean notMapData = true;
		
		for(int i = 0; i < split.length; i++){
			//System.out.println(split[i]);
			if(split[i].startsWith("td valign=top"))
				notMapData = false;
			if(notMapData)
				continue;
			
			//This is the name of the map
			if(split[i].startsWith("b>"))
				data += "Map: " + split[i].substring(2) + "\r\n";
			else if(split[i].startsWith("a href"))
				data += "Owner: " + split[i].substring(split[i].indexOf(">")+1) + "\r\n";
			else if(split[i].startsWith("span style") || split[i].startsWith("img src"))
				data += split[i] + "\r\n";
			
			if(split[i].startsWith("table"))
				notMapData = true;
			
		}
		
		//System.out.println("Owner: "+ mapOwner +" Map: "+ mapName);
		return data;
	}
	
	//---------------------------------------------------------------------------------
	//Conversion Section of the Code
	//---------------------------------------------------------------------------------
	/**
	 * Made to get only the map part of the AWBW Text file and convert it into a String
	 * (This calls convertMap() )
	 * @param data The data according to the AWBW Text file
	 * @return A string with just the map portion of the data
	 */
	public String getMap(String data){
		String temp = "";
		for(String map: convertMap(data))
			temp += map += "\n";
		return temp;
	}
	
	/**
	 * Contains the name of the map (but is only correct after
	 * convertMap() is called.)
	 * @return The Map Official Name
	 */
	public String getMapName(){
		return mapName;
	}
	
	/**
	 * Contains the owner of the map (but is only correct after
	 * convertMap() is called.)
	 * @return The Map Official Owner
	 */
	public String getMapOwner(){
		return mapOwner;
	}
	
	/**
	 * Contains the game this map originates from (but is only correct after
	 * convertMap() is called.)
	 * @return The Place where this map originates
	 */
	public String getMapGame(){
		return mapGame;
	}
	
	/**
	 * Contains all the players by army number (but is only correct after
	 * convertMap() is called.)
	 * 
	 * @return All the players in the map
	 */
	public int[] getPlayers(){
		int[] temp = new int[0];
		for(int i = 0; i < aList.length; i++){
			if(aList[i])
				temp = addData(temp, i);
		}
		return temp;
	}
	
	/**
	 * Made to get only the map part of the AWBW Text file and convert it into a String
	 * @param data The data according to the AWBW Text file
	 * @return A list of strings with just the map portion of the data
	 */
	public String[] convertMap(String data){
		String[] map = getHTMLMap(data);
		String[] tiles = getTiles(data);
		String[] temp = new String[0];
		char[] split = new char[0];
		
		//The Map section of the data
		for(int j = 0; j < map.length; j++){
			split = map[j].toCharArray();
			for(int i = 0; i < split.length; i++){
				if(split[i] == '0'){
					
					//Took this out as you'll always need this
					//if(tiles == null)
						//tiles = getTiles(data);
					
					//Then check to see if it equals any tiles
					for(int k = 0; k < tiles.length; k++){
						temp = tiles[k].split(" ");
						if(temp.length < 5)
							continue;
						if(temp[0].matches("PROP") &&
							Integer.parseInt(temp[3]) == i && 
							Integer.parseInt(temp[4]) == j){
							//Just in case changes need to be made to defaults
							//split[i] = temp[1].matches("PIPS") ? 'SEAM' : 'PLIN';
							split[i] = '.';
							break;
						}
					}
				}
			}
			map[j] = new String(split);
		}
		
		//System.out.println("Owner: "+ mapOwner +" Map: "+ mapName +" Players: "+ getPlayers().length);
		
		return map;
	}
	
	/**
	 * This function gets all the object Tiles from an AWBW text map
	 * @param data The text data representing the AWBW text map
	 * @return A list of the tiles in the map 
	 */
	public String[] getTiles(String data){
		//I have to extract the x, y, and maptype from each span style...
		//It looks like below...	
		//span style='left:492; top:110; position:absolute; border: 0px; z-index:100;'>
		//img src=http://awbw.amarriner.com:8080/terrain/aw1/neutralairport.gif>
		
		//What do I need... minimally
		//Unit/Prop [Type, Owner, X, Y]
		
		//Map starts at X=155, Y=95
		//First tile starts at X=156, Y=96
		//So you subtract the image height from the tile height to get real location on the map
		//HQ starts at X=156, Y=81
		//31 - 16 = 15 so 81 + 15 = 96 (True tile position...)
		
		imgHold = new ImageGrab();
		scan = new Scanner(data);
		String temp = "";
		int tmp;
		String[] items = new String[0];
		resetPlayers();
		
		//Then get all the key images
		imgHold.organizeImages(false);
		
		int locx = 0;
		int locy = 0;
		String file = "";
		
		while(scan.hasNextLine()){
			temp = scan.nextLine();
			if(temp.startsWith("span style")){
				tmp = temp.indexOf(";");
				locx = Integer.parseInt(temp.substring(
						temp.indexOf(":")+1, temp.indexOf(";")));
				locy = Integer.parseInt(temp.substring(
						temp.indexOf(":", tmp+1)+1, temp.indexOf(";", tmp+1)));
				
			}else if(temp.startsWith("img src")){
				file = temp.substring(temp.indexOf("1")+2, temp.indexOf(">"));
				locy += (imgHold.getY(file) - TILESIZE);
				
				//Subtract by starting coordinates 
				//Map starts at X=155, Y=95
				//First tile starts at X=156, Y=96
				locx -= MAPX;
				locy -= MAPY;
				
				//Divide by tile size and we should get positions
				locx /= TILESIZE;
				locy /= TILESIZE;
				
				items = addData(items, parseObject(file) + locx +" "+ locy);
			}
		}
		
		//I have to deal with either taking the data and splitting it, or doing it all in
		//one place...
		return items;
	}
	
	/**
	 * This function extracts a map from a file and sets the map Name and Owner
	 * @param data The text file data representing the AWBW text map
	 * @return Just the map section of that data
	 */
	private String[] getHTMLMap(String data){
		scan = new Scanner(data);
		String[] map = new String[0];
		String temp = "";
		while(scan.hasNextLine()){
			temp = scan.nextLine();
			if(temp.isEmpty())
				break;
			map = addData(map, temp);
		}
		
		mapName = "";
		mapOwner = "";
		
		while(scan.hasNextLine()){
			temp = scan.nextLine();
			if(temp.startsWith("Map: "))
				mapName = temp.substring(5);
			else if(temp.startsWith("Owner: "))
				mapOwner = temp.substring(7);
		}
		
		return map;
	}
	
	/**
	 * This is a huge function that parses the objects for their identity. Separates
	 * by the ObjectType TypeID OWNER
	 * @param object A filename representing the AWBW image
	 * @return The identity of the object by Type ID and owner
	 */
	//Get those string literals and line them up to make real statistic objects...
	private String parseObject(String object){
		String temp = "";
		for(int i = 0; i < uniList.length; i++){
			if(i < propList.length && object.matches(".*"+propList[i]+".*")){
				temp += "PROP "+pList[i]+" ";
				break;
			}else if(object.matches(".*"+uniList[i]+".*")){
				temp += "UNIT "+uList[i]+" ";
				break;
			}
		}
		
		for(int i = 0; i < factionList.length; i++){
			if(object.matches(".*"+factionList[i]+".*") || object.startsWith(armyList[i])){
				aList[i] = true;
				temp += i + " ";
				break;
			}
			if(i == factionList.length-1)
				temp += -1 + " ";
		}
		return temp;
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
	 * A simple functions that just resets all the players to 0
	 */
	private void resetPlayers(){
		aList = new boolean[armyList.length];
		for(int i = 0; i < aList.length; i++)
			aList[i] = false;
	}

}
