package com.cwt.screen;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;

import com.jslix.Screen;
import com.jslix.tools.ImgLibrary;

public class BattleScreen extends Screen {
	
	private ImgLibrary imgLib;
	private int sx;
	private int sy;
	
	private int basize;
	
	public BattleScreen() {
		imgLib = new ImgLibrary();
	}

	@Override
	public void init() {
		// TODO Auto-generated method stub
		sx = 0;
		sy = 0;
		basize = 30;
		
		// Add a few images
		imgLib.addImage("image/UnitBaseColors.png");
		
		// Add a bit of terrain
		// The terrain parts
		imgLib.addImage("image/cwt_battle/terrain(C)/CWT_PLIN.png");
		imgLib.setFlipX();
		imgLib.addImage("image/cwt_battle/terrain(C)/CWT_PLIN.png");
	}

	@Override
	public void update(int timePassed) {
		// TODO Auto-generated method stub
		
		if(sx != scr_width || sy != scr_height) {
			imgLib.setImageSize((scr_width/2)-(basize+5), scr_height-((basize+5)*2));	
			imgLib.addImage(1, imgLib.getImage(1));
			
			imgLib.setImageSize((scr_width/2)-(basize+5), scr_height-((basize+5)*2));	
			imgLib.setFlipX();
			imgLib.addImage(2, imgLib.getImage(2));
			
		}
		
	}

	@Override
	public void render(Graphics2D g, Component dthis) {
		//g.drawImage(imgLib.getImage(0), 0, 0, dthis);
		
		g.setColor(Color.BLACK);
        g.fillRect(basize, basize, scr_width-(basize*2), scr_height-(basize*2));
        g.setColor(Color.WHITE);
        g.fillRect(basize+5, basize+5, scr_width-((basize+5)*2), scr_height-((basize+5)*2));
        
        g.drawImage(imgLib.getImage(1), basize+5, basize+5, dthis);
        g.drawImage(imgLib.getImage(2), scr_width/2, basize+5, dthis);
        
        g.setColor(Color.BLACK);
        g.setStroke(new BasicStroke(2f));
        g.drawLine(scr_width/2, basize+2, scr_width/2, scr_height-basize-2);
	}
	

}
