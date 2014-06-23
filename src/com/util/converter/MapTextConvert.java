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
public class MapTextConvert {
	
	public static void main(String args[]){
		MapTextConvert cool = new MapTextConvert();
		cool.convertMap("map10000.txt");
		//cool.getTileLocation();
	}
	
	private Scanner scan;
	private String data;
	private String basePath;
	private PageGrab page;
	
	private String[] armyNew;
	
	public MapTextConvert(){
		basePath = new File("").getAbsolutePath();
		page = new PageGrab();
		data = "";
		
		armyNew = new String[]{"OS", "BM", "GE", "YC", "BH", "CR", "AV", "SS", "SF",
				               "IN", "CS", "PC", "TG", "IE", "WN", "CG", "MO", "JA"};
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
}
