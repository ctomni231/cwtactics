package com.cwt.screen;

import java.awt.Component;
import java.awt.Graphics2D;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Map;

import com.jslix.Screen;
import com.jslix.image.ImgLibrary;
import com.jslix.io.JSONLibrary;

/**
 * A playground for testing the different features of the program
 * 
 * @author Carr, Crecen
 * @version 12.27.20
 */

public class TestBed extends Screen {
	
	private ImgLibrary imgLib;
	private JSONLibrary parser;
	
	
	public TestBed() {
		imgLib = new ImgLibrary();
		parser = new JSONLibrary();
	}

	@Override
	public void init() {
		imgLib.addImage("cwtargetapp.png");
		imgLib.addImage("image/background/AW2Sturm.png");
		imgLib.addImage("image/menu/BasicAlpha.png");
		
		//parser.outputAll("credits.json");
		
		ArrayList<LinkedList> cool = parser.generateList(parser.getJSONMap("credits.json"));
		
		for(int i = 0; i < cool.size(); i++) {
			System.out.println(cool.get(i).toString());
		}
		
		//String[] cool = {"CUSTOM WARS TACTICS CREDITS", "HOSTING"};
		//try {
		//	LinkedList temp = (LinkedList)parser.get(new String[] {"CUSTOM WARS TACTICS CREDITS"});
		//	System.out.println("First bit type:"+temp.getClass().getName());
		//}catch(Exception e){
		//	System.err.println(e);
		//}
		
	}

	@Override
	public void update(int timePassed) {
		
	}

	@Override
	public void render(Graphics2D g, Component dthis) {
		g.drawImage(imgLib.getImage(0), 10, 10, dthis);
		imgLib.placeImg(g, 0, 20, 20, dthis);
		imgLib.drawImg(g, 0, 30, 30, -imgLib.getX(0), -imgLib.getY(0), dthis);
		imgLib.placeCropImg(g, 0, 40, 40, 100, -20, dthis);
		imgLib.drawCropImg(g, 0, 50, 50, -imgLib.getX(0), -imgLib.getY(0), -100, 20, dthis);
		imgLib.placeCutImg(g, 1, 60, 60, 0, 0, imgLib.getX(0), imgLib.getY(0), dthis);
		imgLib.drawCutImg(g, 2, 70, 70, -imgLib.getX(0), -imgLib.getY(0), 15, 0, 15, 17, dthis);
	}

}
