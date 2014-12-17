package com.util.converter;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

/**
 * MapTextConvert.java
 * 
 * This was made to convert the download text maps into a format in which
 * I can convert to JSON. Regardless, each map will have to be textually
 * redone in order to get it in the correct format. 
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 06.22.14
 */

//Next step, go through the list and get the items to display properly...
public class MapTextConvert {
	
	public static void main(String args[]){
		MapTextConvert cool = new MapTextConvert();
		cool.convertMap("map43.txt");
	}
	
	private Scanner scan;
	private String data;
	private String basePath;
	private PageGrab page;
	
	private String[] armyNew;
	private String[] uList;
	private int[] fuelNew;
	private int[] ammoNew;
	
	public MapTextConvert(){
		basePath = new File("").getAbsolutePath();
		page = new PageGrab();
		data = "";
		
		armyNew = new String[]{"OS", "BM", "GE", "YC", "BH", "CR", "AV", "SS", "SF",
				               "IN", "CS", "PC", "TG", "IE", "WN", "CG", "MO", "JA"};
		
		//The CWT unit literals
		uList = new String[]{"AAIR", "APCR", "ARTY", "BCTR", "BKBT", "BKBM",
							 "BMBR", "ACAR", "CRUS", "FGTR", "INFT", "LNDR",
							 "MDTK", "MECH", "WRTK", "MISS", "NTNK", "PRNR", 
							 "RECN", "RCKT", "STLH", "SUBM", "TCTR", "TANK", "BSHP"};
		
		fuelNew = new int[]{60, 70, 50, 99, 60, 45,
							99, 99, 99, 99, 99, 99,
							50, 70, 70, 50, 99, 99,
							80, 50, 60, 60, 99, 70, 99, 99};
		
		ammoNew = new int[]{9, 0, 6, 6, 0, 0, 
							9, 9, 9, 9, 0, 0, 
							8, 3, 3, 6, 9, 9, 
							0, 6, 6, 6, 0, 9, 9, 0};
		
	}
	
	public void getMap(String filename){
		data = "";
		try {
			scan = new Scanner(new File(basePath.replace('\\','/')+"/"+filename));
			while(scan.hasNextLine())
				data += scan.nextLine()+"\n";
		} catch (FileNotFoundException e) {
			data = "";
		}	
	}
	
	
	public void getTileLocation(){
		for(String temp: page.convertMap(data))
			System.out.println(temp);
		for(String temp: page.getTiles(data))
			System.out.println(temp);
		
	}
	
	public void convertMap(String filename){
		getMap(filename);
		String map = page.getMap(data);
		String[] tiles = page.getTiles(data);
		String tempMap = "";
		String temp = "";
		
		//Get the first segment of the map
		scan = new Scanner(MapConverter.convert(page.getMapName(), map, page.getMapOwner()));
		while(scan.hasNextLine()){
			temp = scan.nextLine();
			tempMap += temp + "\r\n";
			if(temp.matches(".*\"mpw\":.*"))
				break;
			if(temp.matches(".*\"credits\":.*"))
				tempMap += printGame();
		}
		
		//Get the amount of players
		tempMap += printPlayer();
		
		if(page.getPlayers().length != 0)
			tempMap += printArmy();
		
		tempMap += "\r\n";
		tempMap += printProperty(page.getTiles(data));
		
		tempMap += "\r\n";
		tempMap += printUnits(page.getTiles(data));
		
		tempMap += "\r\n";
		tempMap += "\t\"dyev\" : [],\r\n";
		
		tempMap += "\r\n";
		tempMap += "\t\"rules\" : []\r\n";
		
		tempMap += "\r\n";
		tempMap += "}";
			
		System.out.println(tempMap);
	}
	
	private String printArmy(){
		String temp = "\t\"army\": [ ";
		int[] players = page.getPlayers();
		for(int i = 0; i < players.length; i++){
			if(i != 0)
				temp += ", ";
			//Drop in a newline every... eh... 6 armies
			if(i%6 == 5)
				temp += "\r\n\t\t";
			//Gets the player ID of the army in the 
			temp += "\""+armyNew[players[i]]+"\"";
		}
		temp += " ],\r\n";
		
		return temp;
	}
	
	/**
	 * Prints the game this map came from
	 * @return The game this map came from
	 */
	private String printGame(){
		return "\t\"game\": \"" + page.getMapGame() + "\",\r\n";
	}
	
	/**
	 * Prints how many players are in the map
	 * @return The number of players in the map
	 */
	private String printPlayer(){
		return "\t\"player\": " + page.getPlayers().length + ",\r\n";
	}
	
	/**
	 * This prints all the properties inside the map in sequential order
	 * @param tiles The tile representation of all the properties
	 * @return A list of all the properties
	 */
	private String printProperty(String[] tiles){
		String temp = "\t\"prps\": [\r\n";
		String[] split;
		int[] players = page.getPlayers();
		int count = 0;
		for(int i = 0; i < tiles.length; i++){
			split = tiles[i].split(" ");
			if(split.length > 4){
				if(split[0].matches("PROP")){
					if(count != 0)
						temp += ",\r\n";
					for(int j = 0; j < players.length; j++){
						if(split[2].matches(""+players[j])){
							split[2] = ""+j;
							break;
						}
					}
					temp += "\t[ "+count+", "+split[3]+", "+split[4]+", \""+split[1]+
						"\", " + split[2] + " ]";
					count++;
				}
			}
		}
		temp += "\r\n\t],\r\n";
		return temp;
	}
	
	/**
	 * This prints all the properties inside the map in sequential order
	 * @param tiles The tile representation of all the properties
	 * @return A list of all the properties
	 */
	private String printUnits(String[] tiles){
		String temp = "\t\"units\": [\r\n";
		String[] split;
		int[] players = page.getPlayers();
		int count = 0;
		int army = 0;
		for(int i = 0; i < tiles.length; i++){
			split = tiles[i].split(" ");
			if(split.length > 4){
				if(split[0].matches("UNIT")){
					if(count != 0)
						temp += ",\r\n";
					for(int j = 0; j < uList.length; j++){
						if(uList[j].matches(split[1])){
							army = j;
							break;
						}
						if(j == uList.length-1)
							army = j;
					}
					for(int j = 0; j < players.length; j++){
						if(split[2].matches(""+players[j])){
							split[2] = ""+j;
							break;
						}
					}
					temp += "\t[ "+count+", \""+split[1]+"\", "+split[3]+", "+split[4]+
							", 99, "+ammoNew[army]+", "+fuelNew[army]+", -1, "+
							split[2] +" ]";
					count++;
				}
			}
		}
		temp += "\r\n\t],\r\n";
		return temp;
	}
}
