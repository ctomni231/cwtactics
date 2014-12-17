package com.util.converter;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import com.util.converter.tools.FileFind;
import com.util.converter.tools.FileIndex;

public class FixMap {
	
	//load up the map
	//see if it needs to be fixed
	//if any changes need to be made then make them
	public static void main(String args[]){
		FixMap cool;
		if(args.length > 2){
			cool = new FixMap(Integer.parseInt(args[0]), Integer.parseInt(args[1]), true);
		}else if(args.length == 2){
			cool = new FixMap(Integer.parseInt(args[0]), Integer.parseInt(args[1]), false);
		}else if(args.length == 1){
			cool = new FixMap(Integer.parseInt(args[0]), MAXSIZE, false);
		}else{
			cool = new FixMap(START, MAXSIZE, false);
		}
		cool.checkAll();
	}
	
	public static final int START = 1;
	//There is literally no more maps than just 70000
	//However, in this case, we'll only check up to the available (63495)...
	public static final int MAXSIZE = 63495;
	
	private int index;
	private int findex;
	private char[] charmap;
	private char[] newmap;
	
	private FileFind finder;
	private MapSplit imgHold;
	private Scanner scan;
	private String data;
	
	private boolean limit;
	
	public FixMap(){
		this(START, MAXSIZE, false);
	}
	
	public FixMap(int start, int end, boolean limited){
		index = start;
		findex = end;
		
		limit = limited;
		charmap = new char[0];
		newmap = new char[0];
		
		finder = new FileFind();
		imgHold = new MapSplit();
	}
	
	public void checkAll(){
		if(limit){
			finder.changeDirectory("empMap");
			for(FileIndex map: finder.getAllFiles()){
				checkMap(map.fname);
			}
		}else{
			for(int i = index; i < findex+1; i++)
				checkMap(i);
		}
	}
	
	
	private void checkMap(String file){
		data = "";
		try {
			scan = new Scanner(new File(file));
			while(scan.hasNextLine())
				data += scan.nextLine()+"\r\n";
		} catch (FileNotFoundException e) {
		}
		
		check(Integer.parseInt(file.substring(3, file.indexOf('.'))));
	}
	
	private void checkMap(int ind){
		data = "";
		
		try {
			scan = new Scanner(new File("map"+ind+".txt"));
			while(scan.hasNextLine())
				data += scan.nextLine()+"\r\n";
		} catch (FileNotFoundException e) {
		}
		
		check(ind);
	}
		
	private void check(int ind){
		boolean makeMap = false;
		System.out.println(ind);
		charmap = data.toCharArray();
		
		if(charmap.length < 20)
			return;
		
		imgHold.setImage("mapimg/map"+ind+".png");
		newmap = imgHold.getData().toCharArray();
		
		for(int i = 0; i < newmap.length; i++){
			if(newmap[i] == '?'){
				charmap[i] = newmap[i];
				makeMap = true;
			}
		}
		
		if(!makeMap)
			return;
		
		//data = new String(charmap);
		
		//System.out.println(charmap);
		makeFile(ind);
		
	}
	
	private void makeFile(int ind){
		finder.makeDirectories("map");
		finder.createFile("map", "map"+ind+".txt", new String(charmap), false);
	}

}
