package com.cwt.screen;

import java.awt.Component;
import java.awt.Graphics2D;

import com.jslix.Screen;
import com.jslix.image.ImgLibrary;

/**
 * A playground for testing the different features of the program
 * 
 * @author Carr, Crecen
 * @version 12.27.20
 */

public class TestBed extends Screen {
	
	private ImgLibrary imgLib;
	
	public TestBed() {
		imgLib = new ImgLibrary();
	}

	@Override
	public void init() {
		imgLib.addImage("cwtargetapp.png");
	}

	@Override
	public void update(int timePassed) {
		
	}

	@Override
	public void render(Graphics2D g, Component dthis) {
		g.drawImage(imgLib.getImage(0), 10, 10, dthis);
		imgLib.placeImg(g, 0, 20, 20, dthis);
	}

}
