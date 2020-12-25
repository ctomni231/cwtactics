package com.cwt;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;

import javax.swing.JComponent;
import javax.swing.JFrame;

public class CWTacticsOld extends JComponent implements Runnable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -3712285702105702910L;
	
	private JFrame window;
	private BufferedImage bimg;
	private int sw = 800;
	private int sh = 600;
	
	public static void main(String args[]){
		CWTacticsOld cool = new CWTacticsOld();
		cool.showWindow();
	}
	
	private void init(){
		
	}
	
	private void updateRender(Graphics2D g2, int w, int h) {
		
	}
	
	/////////////////////////////////////
	//The infrastructure stuff under here...
	/////////////////////////////////////

	public CWTacticsOld(){
		window = new JFrame("Basic Screen");
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
		return new Dimension(sw, sh);
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
