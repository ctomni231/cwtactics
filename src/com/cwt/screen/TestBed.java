package com.cwt.screen;

import java.awt.Color;
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
	private boolean onthefly;
	
	
	public TestBed() {
		imgLib = new ImgLibrary();
		parser = new JSONLibrary();
		onthefly = true;
	}

	@Override
	public void init() {
		imgLib.addImage("cwtargetapp.png");
		imgLib.addImage("image/background/AW2Sturm.png");
		imgLib.addImage("image/menu/BasicCombine.png");
		imgLib.addTextInfo(2, 9, 5, 0, imgLib.ASCII_COMBINE);
		//imgLib.addAllCapitalLetters(imgLib.getImage(2), "Basic", 6, 5, 0);
		
		
		// Before we do anything else, let's load up that string
		cool = parser.generateList(parser.getJSONMap("credits.json"));
		
		for(int i = 0; i < cool.size(); i++) {
			System.out.println(cool.get(i).toString());
		}
		
		int[] temp = imgLib.getTextDim(2, "INCREDIBLE");
		System.out.println("("+temp[0]+","+temp[1]+")");
		
		imgLib.addTextImage(2, "INCREDIBLE 01234");
		
		
		
		//imgLib.setLetters("INCREDIBLE", "Basic", 0, 0, -1);
		//imgLib.addImage(imgLib.getTextImage());
	}

	@Override
	public void update(int timePassed) {
		
		if(onthefly) {
			imgLib.addTextImage(2, (String)cool.get(0).get(0));
			onthefly = false;
		}
		
		
	}

	@Override
	public void render(Graphics2D g, Component dthis) {
		g.drawImage(imgLib.getImage(0), 10, 110, dthis);
		imgLib.placeImg(g, 0, 20, 120, dthis);
		imgLib.drawImg(g, 0, 30, 130, -imgLib.getX(0), -imgLib.getY(0), dthis);
		imgLib.placeCropImg(g, 0, 40, 140, 100, -20, dthis);
		imgLib.drawCropImg(g, 0, 50, 150, -imgLib.getX(0), -imgLib.getY(0), -100, 20, dthis);
		imgLib.placeCutImg(g, 1, 60, 160, 0, 0, imgLib.getX(0), imgLib.getY(0), dthis);
		imgLib.drawCutImg(g, 2, 70, 170, -imgLib.getX(0), -imgLib.getY(0), 15, 0, 15, 17, dthis);
		
		g.drawImage(imgLib.getImage(3), 10, 10, dthis);
		g.drawImage(imgLib.getImage(4), 10, 30, dthis);
	}

}
