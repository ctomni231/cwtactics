package com.util;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;
import java.util.Random;

import javax.swing.JComponent;
import javax.swing.JFrame;

/**
 * RainExample.java
 * 
 * I really do not want to spend too much time commenting on this class. It only serves
 * as a place holder to show how rain is rendered on an AW game.
 *  
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.16.13
 */

public class RainExample extends JComponent implements Runnable{

	private JFrame window;
	private BufferedImage bimg;
	
	public static void main(String args[]){
		RainExample cool = new RainExample();
		cool.showWindow();
	}
	
	/** How often the snow is produced */
	public final int FREQUENCY = 50;
	/** The maximum amount of particles allowed */
	public final int MAX_PARTICLE = 100;
	
	/** The random number generator */
	public Random rand;
	/** The type of rain drop to draw */
	public int[] type;
	/** The x-axis position of the rain drop */
	public double[] posx;
	/** The y-axis position of the rain drop */
	public double[] posy;
	/** The flash of the rain drop */
	public boolean[] flash;
	/** Temporary variable */
	public int temp;
	
	public void init(){
		type = new int[MAX_PARTICLE];
		posx = new double[MAX_PARTICLE];
		posy = new double[MAX_PARTICLE];
		flash = new boolean[MAX_PARTICLE];
		rand = new Random();
		for(int i = 0; i < MAX_PARTICLE; i++)
			type[i] = -1;
	}
	
	public void updateRender(Graphics2D g, int w, int h){
		
		//Create new rain particles
		for(int i = 0; i < MAX_PARTICLE; i++){
			if(type[i] == -1 && rand.nextInt(FREQUENCY) == 0){
				type[i] = rand.nextInt(2);
				posx[i] = (rand.nextInt((w+100)/10)*10) - 100;
				posy[i] = -10;
				flash[i] = rand.nextBoolean();
				break;
			}
		}
		
		//Rain particle updates
		for(int i = 0; i < MAX_PARTICLE; i++){
			if(type[i] == -1)
				continue;
			
			posx[i] += 2;
			posy[i] += 8;
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
				g.drawLine((int)posx[i], (int)posy[i], (int)(posx[i]+4), (int)(posy[i]+12));
			else if(type[i] == 1 && flash[i])
				g.drawLine((int)posx[i], (int)posy[i], (int)(posx[i]+3), (int)(posy[i]+8));
		}
	}
	
	/////////////////////////////////////
	//The infrastructure stuff under here...
	/////////////////////////////////////
	
	public RainExample(){
		 window = new JFrame("Rain Example");
        window.setBackground(Color.BLACK);
        setBackground(Color.BLACK);
        init();
	}
	
	public void showWindow(){
		 Thread looper = new Thread(this);
         looper.start();
         window.addWindowListener(new WindowAdapter() {
             @Override
              public void windowClosing(WindowEvent e) {
                  window.dispose();
                  System.exit(0);
              }
          });
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
