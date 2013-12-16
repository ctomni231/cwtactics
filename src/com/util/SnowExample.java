package com.util;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.util.Random;

import javax.swing.JComponent;
import javax.swing.JFrame;

/**
 * SnowExample.java
 * 
 * I really do not want to spend too much time commenting on this class. It only serves
 * as a place holder to show how snow is rendered on an AW game.
 *  
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.16.13
 */

public class SnowExample extends JComponent implements Runnable{

	private JFrame window;
	private BufferedImage bimg;
	
	public static void main(String args[]){
		SnowExample cool = new SnowExample();
		cool.showWindow();
	}
	
	/** How often the snow is produced */
	public final int FREQUENCY = 500;
	/** The maximum amount of particles allowed */
	public final int MAX_PARTICLE = 100;
	
	/** The random numer generator */
	public Random rand;
	/** The type of snow ball to draw */
	public int[] type;
	/** The x-axis position of the snow ball */
	public int[] posx;
	/** The y-axis position of the snow ball */
	public int[] posy;
	/** The flash of the snow ball */
	public boolean[] flash;
	/** Temporary variable */
	public int temp;
	
	public void init(){
		type = new int[MAX_PARTICLE];
		posx = new int[MAX_PARTICLE];
		posy = new int[MAX_PARTICLE];
		flash = new boolean[MAX_PARTICLE];
		rand = new Random();
		for(int i = 0; i < MAX_PARTICLE; i++)
			type[i] = -1;
	}
	
	public void updateRender(Graphics2D g, int w, int h){
		
		//Create new snow particles
		for(int i = 0; i < MAX_PARTICLE; i++){
			if(type[i] == -1 && rand.nextInt(FREQUENCY) == 0){
				type[i] = rand.nextInt(3);
				posx[i] = (rand.nextInt((w+50)/10)*10) - 50;
				posy[i] = -10;
				flash[i] = rand.nextBoolean();
				break;
			}
		}
		
		//Snow particle updates
		for(int i = 0; i < MAX_PARTICLE; i++){
			if(type[i] == -1)
				continue;
			
			if(type[i] == 2){
				posx[i] += 1;
			}
			posx[i] += 1;
			posy[i] += 4;
			flash[i] = !flash[i];
			
			//Destroy particles
			if(posy[i] > h)
				type[i] = -1;
		}
		
		//Render particles
		g.setColor(Color.WHITE);
		for(int i = 0; i < MAX_PARTICLE; i++){
			if(type[i] == -1)
				continue;
			if(type[i] == 0 && flash[i])
				g.fillOval(posx[i], posy[i], 4, 4);
			else if(type[i] == 1 && flash[i])
				g.fillOval(posx[i], posy[i], 6, 6);
			else if(type[i] == 2 && flash[i])
				g.fillOval(posx[i], posy[i], 8, 8);
		}
	}
	
	/////////////////////////////////////
	//The infrastructure stuff under here...
	/////////////////////////////////////
	
	public SnowExample(){
		 window = new JFrame("Basic Screen");
        window.setBackground(Color.BLACK);
        setBackground(Color.BLACK);
        init();
	}
	
	public void showWindow(){
		 Thread looper = new Thread(this);
         looper.start();
		 window.add(this, BorderLayout.CENTER);
	     window.validate();
	     window.setVisible(true);
	     window.pack();
	}
	
	@Override
    public void paintComponent(Graphics g){
        super.paintComponent(g);
        createGraphics2D((Graphics2D)g, getSize().width, getSize().height);
        //Draws a non-flickering image
        g.drawImage(bimg, 0, 0, this);
    }
	
	private void createGraphics2D(Graphics2D g2, int w, int h) {
        if (bimg == null || bimg.getWidth() != w || bimg.getHeight() != h)
            bimg = (BufferedImage) createImage(w, h);

        g2 = bimg.createGraphics();
        g2.setColor(Color.BLACK);
        g2.fillRect(0, 0, w, h);
        
        updateRender(g2, w, h);
    }
	
	@Override
    public Dimension getPreferredSize(){
        return new Dimension(400, 300);
    }
	
	@Override
	public final void run() {
        try{           
            while(true){
                Thread.sleep(10);
                repaint();
            }
        }catch(Exception e){
            System.err.println(e.getMessage());
            System.exit(0);
        }
    }

}
