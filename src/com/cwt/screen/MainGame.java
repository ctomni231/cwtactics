package com.cwt.screen;

import java.awt.Component;
import java.awt.Graphics2D;

import com.jslix.Screen;
import com.jslix.image.ImgLibrary;

public class MainGame extends Screen {

	private ImgLibrary imgLib;
	
	public MainGame() {
		imgLib = new ImgLibrary();
	}
	
	@Override
	public void init() {
		imgLib.addImage("./image/background/AW1Map.png");
	}

	@Override
	public void update(int timePassed) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void render(Graphics2D g, Component dthis) {
		g.drawImage(imgLib.getImage(0), 0, 0, scrx, scry, dthis);
		//g.drawImage(imgLib.getGIFImage("./image/background/AWDoRBattle.gif"), 0, 0, scrx, scry, dthis);
	}

}
