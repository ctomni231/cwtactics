package com.jslix.image;

import java.awt.Image;
import javax.swing.ImageIcon;
import com.jslix.io.FileFind;

/**
 * AnimatedGif.java
 *
 * This class allows you to input Animated GIF images into
 * the JSlix program. It is only made to support one
 * at a time. At the moment, the support is only for
 * Java2D.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.05.13
 */
public class AnimatedGif {

	/** This holds a stored GIF or PNG image in the class */
	private Image stored;
	/** This holds the version of the image that will be displayed to the screen */
	private Image display;
	
	/**
	 * This class takes a filename and converts it into an animated GIF image. It
	 * can be used for regular images, but the main purpose is to handle animated
	 * GIF.
	 * @param filename The path to a PNG or GIF image
	 */
	public AnimatedGif(String filename){
		FileFind finder = new FileFind();
		init(new ImageIcon(finder.getFileURL(filename)).getImage());
	}
	
	/**
	 * This class takes a filename and converts it into an animated GIF image. It
	 * can be used for regular images, but the main purpose is to handle animated
	 * GIF.
	 * @param img A GIF or PNG image
	 */
	public AnimatedGif(Image img){
		init(img);
	}
	
	/**
	 * This function takes an image and resizes it to a new width and height
	 * @param sizex The x-axis width
	 * @param sizey The y-axis height
	 */
	public void resizeImg(int sizex, int sizey){
		if(sizex < 1)
			sizex = 1;
		if(sizey < 1)
			sizey = 1;
		display = stored.getScaledInstance(sizex, sizey, Image.SCALE_DEFAULT);
	}
	
	/**
	 * This function gets the image
	 * @return The resized display image
	 */
	public Image getImage(){
		return display;
	}
	
	/**
	 * This function takes an image and stores it into both the storage and displayable
	 * images.
	 * @param img A GIF or PNG image
	 */
	private void init(Image img){
		stored = img;
		display = img;
	}
	
}
