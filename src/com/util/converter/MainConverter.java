package com.util.converter;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.AccessControlException;
import java.util.Scanner;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JFrame;

/**
 * MainConverter.java
 * 
 * This class was made to convert AWBW maps into a format that hopefully
 * would be easier to turn into readable maps. This takes the files directly
 * from the web page and attempts to convert them.
 * 
 * @author Carr, Crecen
 * @version 04.29.14
 *
 */
public class MainConverter extends JComponent implements Runnable {
	
	private JFrame window;
	private BufferedImage bimg;
	
	public static void main(String args[]){
		MainConverter cool;
		if(args.length == 2){
			cool = new MainConverter(Integer.parseInt(args[0]), Integer.parseInt(args[1]));
		}else if(args.length == 1){
			cool = new MainConverter(Integer.parseInt(args[0]), MAXSIZE);
		}else{
			cool = new MainConverter(START, MAXSIZE);
		}
		cool.showWindow();
	}
	
	public static final int START = 1;
	//There is literally no more maps than just 70000
	public static final int MAXSIZE = 70000;
	
	private int findex;
	private int index;
	private String basePath;
	private URL url;
	private Scanner scan;
	private String data;
	private ImageIcon img;
	private File tempFile;
	private MapSplit map;
	private PageGrab page;
	
	private String mapData;
	
	public void init(int ind, int find){
		index = ind;
		findex = find;
		basePath = new File("").getAbsolutePath();
		map = new MapSplit();
		page = new PageGrab();
	}
	
	private void openURL(String path){
		try {
			url = new URL(path);
			data = "";
			if(url != null){
				scan = new Scanner(url.openStream());
				while(scan.hasNextLine())
					data += scan.nextLine()+"\n";
			}
			
			//System.out.println(makeReadable(data));
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void updateRender(Graphics2D g, int w, int h){
		g.setColor(Color.WHITE);
		
		if(new File(basePath.replace('\\','/')+"/map"+index+".txt").exists()){
			g.drawString("Skipping map "+index, 10, 10);
			index++;
			return;
		}
		
		if(index < findex)
			g.drawString("Obtaining map "+index, 10, 10);
		
		if(index <= findex){
			mapData = "";
			// Gets the Image file data
			openURL("http://awbw.amarriner.com/maps/C"+index+".png");
			if(!data.isEmpty()){
				//createFile();
				//Convert the data into Image data
				try {
					//Use extra symbols not used to get pipes "?" in Headphone's format
					map.setImage(url);
					//System.out.println(map.getData());
					mapData += map.getData() + "\r\n\r\n";
				} catch (IOException e) {
					e.printStackTrace();
				}//*/
				// Gets the HTML file
				openURL("http://awbw.amarriner.com/prevmaps.php?maps_id="+index);
				if(!data.isEmpty()){
					//createHTML();
					mapData += page.setData(data) + "\r\n";
					createMap();
				}
			}		
			index++;
		}else
			g.drawString("Complete at index "+(index-1)+"!", 20, 10);
	}
	
	public void createMap(){
		createHTMLFile(basePath.replace('\\','/')+"/", "map"+index+".txt", mapData, false);
	}
	
	public void createHTML(){
		createHTMLFile(basePath.replace('\\','/')+"/", "map"+index+".html", data, false);
	}
	
	public boolean createHTMLFile(String path, String filename, String filedata,
            boolean temp){
        File newFile = null;
        if(!path.endsWith("/"))
            path += "/";

        try {
            newFile = new File(path+filename);
            if (newFile.createNewFile())
            	System.out.println("File Created! "+path+filename);
            else{
            	System.out.println("File Exists! "+path+filename);
                //return false;
            }
            if(temp)    newFile.deleteOnExit();

        } catch (IOException e) {
        	System.err.println("File IOException! "+path+filename);
            return false;
        } catch(AccessControlException ex){
        	System.err.println("Applet Active, can't Access! "+path+filename);
            return false;
        }

        PrintWriter writer;
		try {
			writer = new PrintWriter(newFile, "UTF-8");
			writer.println(filedata);
	        writer.close();
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
        
        return true;
    }
	
	public void createFile(){
		createFile(basePath.replace('\\','/')+"/", "map"+index+".png", data, false);
	}
	
	public boolean createFile(String path, String filename, String filedata,
            boolean temp){
        File newFile = null;
        if(!path.endsWith("/"))
            path += "/";

        try {
            newFile = new File(path+filename);
            if (newFile.createNewFile())
            	System.out.println("File Created! "+path+filename);
            else{
            	System.out.println("File Exists! "+path+filename);
                //return false;
            }
            if(temp)    newFile.deleteOnExit();

        } catch (IOException e) {
        	System.err.println("File IOException! "+path+filename);
            return false;
        } catch(AccessControlException ex){
        	System.err.println("Applet Active, can't Access! "+path+filename);
            return false;
        }

        try {
			ImageIO.write(ImageIO.read(url), "png", newFile);
		} catch (IOException e) {
			e.printStackTrace();
		}
        
        return true;
    }
	
	/////////////////////////////////////
	//The infrastructure stuff under here...
	/////////////////////////////////////
	
	public MainConverter(int ind, int find){
		window = new JFrame("Advance Wars Extractor");
        window.setBackground(Color.BLACK);
        setBackground(Color.BLACK);
        init(ind, find);
	}
	
	public void showWindow(){
		 Thread looper = new Thread(this);
         looper.start();
		 window.add(this, BorderLayout.CENTER);
		 window.addWindowListener(new WindowAdapter() {
             @Override
              public void windowClosing(WindowEvent e) {
                  window.dispose();
                  System.exit(0);
              }
          });
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
        return new Dimension(800, 600);
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
