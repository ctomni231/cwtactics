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
	private ArrayList<LinkedList> cool;
	
	
	public TestBed() {
		imgLib = new ImgLibrary();
		parser = new JSONLibrary();
	}

	@Override
	public void init() {
		imgLib.addImage("cwtargetapp.png");
		imgLib.addImage("image/background/AW2Sturm.png");
		imgLib.addImage("image/menu/BasicAlpha.png");
		imgLib.addAllCapitalLetters(imgLib.getImage(2), "Basic", 6, 5, 0);
		
		
		// Before we do anything else, let's load up that string
		cool = parser.generateList(parser.getJSONMap("credits.json"));
		
		for(int i = 0; i < cool.size(); i++) {
			System.out.println(cool.get(i).toString());
		}
		
		imgLib.setLetters("INCREDIBLE", "Basic", 0, 0, -1);
		imgLib.addImage(imgLib.getTextImage());
		//imgLib.setLetters((String)cool.get(0).get(0), "Basic", 0, 0, -1);
		//imgLib.addImage(imgLib.getTextImage());	
	}

	@Override
	public void update(int timePassed) {
		
	}

	@Override
	public void render(Graphics2D g, Component dthis) {
		//g.drawImage(imgLib.getImage(0), 10, 10, dthis);
		//imgLib.placeImg(g, 0, 20, 20, dthis);
		//imgLib.drawImg(g, 0, 30, 30, -imgLib.getX(0), -imgLib.getY(0), dthis);
		//imgLib.placeCropImg(g, 0, 40, 40, 100, -20, dthis);
		//imgLib.drawCropImg(g, 0, 50, 50, -imgLib.getX(0), -imgLib.getY(0), -100, 20, dthis);
		//imgLib.placeCutImg(g, 1, 60, 60, 0, 0, imgLib.getX(0), imgLib.getY(0), dthis);
		//imgLib.drawCutImg(g, 2, 70, 70, -imgLib.getX(0), -imgLib.getY(0), 15, 0, 15, 17, dthis);
		
		g.drawImage(imgLib.getTextImage(), 10, 10, dthis);
		//g.drawImage(imgLib.getImage(4), 10, 10, dthis);
	}

}
