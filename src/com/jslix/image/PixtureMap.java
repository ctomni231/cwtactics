package com.jslix.image;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.MemoryImageSource;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;


/**
 * PixtureMap.java
 *
 * A class made specifically for editing the pixel portion of the images
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.20.11
 */

public class PixtureMap extends ImgLibrary{

    private static final long serialVersionUID = 2452945053572843636L;
    
    /** The default font type */
    public final String FONT = "DIALOG";
	
    /** The graphics class used for creating images */
    private Graphics2D g;
    /** The Image class used to store the creations */
    private BufferedImage bimg;
    /** The width of the edit image portion */
    private int editSizeX;
    /** The height of the edit image portion */
    private int editSizeY;
    /** The transparent color of the image */
    private Color transparent;
    /** The pixel representation of the grid for editing */
    private int[][] editgrid;
    /** The current opacity of an update */
    private double editOpacity;

    /**
     * This class is used specifically for altering pixels within a
     * created image. You can perform operation on pixel images that
     * are extended above the ImgLibrary class with this class.
     */
    public PixtureMap(){
        super();
        initialize(Color.BLACK);
    }

    /**
     * This function creates the buffered image to be used with the grid
     * @param sizex The width of the buffered image
     * @param sizey The height of the buffered image
     */
     public void createImg(int sizex, int sizey){
         editSizeX = (sizex < 1) ? 1 : sizex;
         editSizeY = (sizey < 1) ? 1 : sizey;
         bimg = new BufferedImage(editSizeX, editSizeY,
                 BufferedImage.TYPE_INT_ARGB);
         g = bimg.createGraphics();
         clearGrid();
     }

    /**
     * Clears the grid
     */
    public void clearGrid(){
        editgrid = new int[editSizeX][editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                editgrid[i][j] = transparent.getRGB();
        }
    }

    /**
     * This function draws a picture to the grid and stores the picture
     * within the internal ImgLibrary. Use can use flip, color, and rotate
     * functions before this function.
     * @param img The image to be stored to the internal ImgLibrary
     * @param locx The pixel x-axis location of this image
     * @param locy The pixel y-axis location of this image
     */
    public void setImageToGrid(Image img, int locx, int locy){
        addImage(img);
        setImageToGrid(length(), locx, locy);
    }

    /**
     * This function draws a picture to the grid and stores the picture
     * within the internal ImgLibrary. Use can use flip, color, and rotate
     * functions before this function.
     * @param index The image contained within the internal ImgLibrary to use
     * @param locx The pixel x-axis location of this image
     * @param locy The pixel y-axis location of this image
     */
    public void setImageToGrid(int index, int locx, int locy){
        int[] tempGrid = new int[getPixels(index).length];
        System.arraycopy(getPixels(index), 0, tempGrid, 0, tempGrid.length);
        
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++){
                if(((tempGrid[i+j*editSizeX] >> 24) & 0xff) < 200)
                    tempGrid[i+j*editSizeX] = transparent.getRGB();
                drawPermPixel(tempGrid[i+j*editSizeX],locx+i,locy+j);
            }
        }
    }

    /**
     * This function rotates the editing grid 90 degrees clockwise
     */
    public void rotateGrid(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeY; i++){
            for(int j = 0; j < editSizeX; j++)
                change[i+(j*editSizeY)] = editgrid[i][j];
        }

        int temp = editSizeY;
        editSizeY = editSizeX;
        editSizeX = temp;
        copyArray(change);
    }

    /**
     * This function flips the editing grid along the x-axis
     */
    public void flipGridXAxis(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                change[(editSizeX-i-1)+(j*editSizeX)] = editgrid[i][j];
        }
        copyArray(change);
    }

    /**
     * This function is used to set the opacity of the editing grid images
     * @param number The opacity from (0-1)
     */
    public void setOpacity(double number){
        if(number >= 0 && number <= 1)
            editOpacity = (1-number);
    }

    /**
     * This function flips the editing grid along the y-axis
     */
    public void flipGridYAxis(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                change[i+((editSizeY-j-1)*editSizeX)] = editgrid[i][j];
        }
        copyArray(change);
    }

    /**
     * This function adds a colored box to the editing grid
     * @param theColor The color of the rectangle
     * @param sizex The width of the rectangle
     * @param sizey The height of the rectangle
     * @param locx The x-axis location in the editing grid
     * @param locy The y-axis location in the editing grid
     */
    public void addColorBoxToGrid(Color theColor,
            int sizex, int sizey, int locx, int locy){
        for(int i = 0; i < sizex; i++){
            for(int j = 0; j < sizey; j++)
                drawPermPixel(theColor.getRGB(),locx+i,locy+j);
        }
    }

    /**
     * This turns the editing grid into a image for display
     */
    public void mergeGridToImage(){
        if(bimg == null)
            createImg(editSizeX, editSizeY);

        if(editOpacity < 1)
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)editOpacity));
        g.drawImage(createPixelMapImage(), 0, 0, this);
        if(editOpacity < 1)
            g.setComposite(AlphaComposite.SrcOver);
        clearGrid();
    }

    /**
     * This adds Java2D font text to an editing grid
     * @param text The String text to add to the editing grid
     * @param locx The x-axis location of the item in the editing grid
     * @param locy The y-axis location of the item in the editing grid
     */
    public void addTextToGridImage(String text, int locx, int locy){
        mergeGridToImage();
        if(editOpacity < 1)
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)editOpacity));
        g.setColor(Color.WHITE);
        g.drawString(text, locx, locy);
        if(editOpacity < 1)
            g.setComposite(AlphaComposite.SrcOver);
    }

    /**
     * This function turns an editing grid into a java2D picture
     * @return An image representing the editing grid
     */
    public Image getGridImage(){
        mergeGridToImage();
        return bimg;
    }

    /**
     * This function creates an exact image enclosing the java2D font text
     * within it
     * @param text The string to turn into an image
     * @param font The font-type-size to use with this image
     * @return A java2D image representing the font text
     */
    public Image getTextPicture(String text, String font){
        createImg(1,1);
        g.setFont(Font.decode(font));
        int width = g.getFontMetrics().stringWidth(text);
        int descent = g.getFontMetrics().getDescent();
        int height = g.getFontMetrics().getHeight()+descent;
        createImg(width, height);
        addTextToGridImage(text, 0, height-descent);
        return getGridImage();
    }

    /**
     * This function creates an exact image enclosing the java2D font text
     * within it
     * @param text The string to turn into an image
     * @return A java2D image representing the font text
     */
    public Image getTextPicture(String text){
        return getTextPicture(text, FONT);
    }

    /**
     * This function moves pixels left/right
     * @param movePixel moves pixels [(+)to the right/(-)to the left]
     * @param row the Y-Row chosen
     */
    public void horizontalPixelMove(int movePixel, int row){
        moveColumnPixels(row, movePixel);
    }

    /**
     * This function moves pixels in all rows left/right
     * @param movePixel moves pixels [(+)to the right/(-)to the left]
     */
    public void horizontalPixelMove(int movePixel){
        for(int i = 0; i < editSizeY; i++)
            moveColumnPixels(i, movePixel);
    }

    /**
     * This function moves pixels left/right
     * @param movePixel moves pixels [(+)upwards/(-)downwards]
     * @param column the X-Column chosen
     */
    public void verticalPixelMove(int movePixel, int column){
        moveRowPixels(column, movePixel);
    }

    /**
     * This function moves pixels in all columns left/right
     * @param movePixel moves pixels [(+)upwards/(-)downwards]
     */
    public void verticalPixelMove(int movePixel){
        for(int i = 0; i < editSizeX; i++)
            moveRowPixels(i, movePixel);
    }

    /**
     * This function will save an image onto the computer that
     * matches the data within the PixtureMap.
     * @param prefix The picture name of the object
     * @param suffix The image format (jpg, bmp, gif, png are supported)
     */
    public void outSourceImage(String prefix, String suffix){
        if(suffix.matches(".*png") || suffix.matches(".*gif") ||
           suffix.matches(".*jpg") || suffix.matches(".*bmp")){
            //Hopefully, this draws the images correctly
            bimg = new BufferedImage(editSizeX, editSizeY,
                BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2 = bimg.createGraphics();
            g2.drawImage(createPixelMapImage(), 0, 0, this);

            //This draws the image to a file
            File outputfile = new File(prefix+"."+suffix);
            try {
                ImageIO.write(bimg, suffix, outputfile);
            } catch (IOException ex) {
                System.err.println(ex);
            }
        }
    }

    /**
     * This function initializes all the PixtureMap items
     * @param theColor The color of the editing grid
     */
    private void initialize(Color theColor){
        editOpacity = 1.0;
        createImage(1, 1);
        editSizeX = 1;
        editSizeY = 1;
        transparent = theColor;
    }

    /**
     * The most important function in the entire class. Makes
     * the mumble jumble of pixels into an image.
     * @return A pixtureMap completed image
     */
    private Image createPixelMapImage(){
        return createImage(new MemoryImageSource(editSizeX, editSizeY,
                getPixels(), 0, editSizeX));
    }

    /**
     * This function gets all the pixels within the editing grid
     * @return An array of editing grid pixels
     */
    private int[] getPixels(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                if(editgrid[i][j] != transparent.getRGB())
                    change[i+(j*editSizeY)] = editgrid[i][j];
        }
        return change;
    }

    /**
     * This function stores the pixel input into the editing grid
     * @param change The pixels to input into the image
     */
    private void copyArray(int[] change){
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                 editgrid[i][j] = change[i+(j*editSizeY)];
        }
    }

    /**
     * This private function fills in all the necessary variables to
     * create a transparent PixtureMap.
     * @param colorInRGB The color to be inserted
     * @param locx The x-axis position
     * @param locy The y-axis position
     */
    private void drawPermPixel(int colorInRGB, int locx, int locy){
        if(locx >= 0 && locx < editSizeX){
            if(locy >= 0 && locy < editSizeY){
                if(colorInRGB != transparent.getRGB())
                    editgrid[locx][locy] = colorInRGB;
            }
        }
    }

    /**
     * This private function can move a column of pixels to the
     * right/left according to the number chosen
     * @param column The x-axis column chosen
     * @param movePixels number of pixels to move the y-axis row
     */
    private void moveRowPixels(int column, int movePixels){
        if(column >= editSizeX || column < 0)
            return;

        int[] temp = new int[editSizeY];
        int cool = 0;

        for(int i = 0; i < editSizeY; i++){
            cool = i + movePixels;

            if(cool >= editSizeY)
                temp[i] = editgrid[column][cool-editSizeY];
            else if(cool < 0)
                temp[i] = editgrid[column][cool+editSizeY];
            else
                temp[i] = editgrid[column][cool];
        }
        System.arraycopy(temp, 0, editgrid[column], 0, editSizeY);
    }

    /**
     * This private function can move a row of pixels to the
     * right/left according to the number chosen
     * @param row The y-axis row chosen
     * @param movePixels number of pixels to move the x-axis column
     */
    private void moveColumnPixels(int row, int movePixels){
        if(row >= editSizeY || row < 0)
            return;

        int[] temp = new int[editSizeX];
        int cool = 0;

        for(int i = 0; i < editSizeX; i++){
            cool = i + movePixels;

            if(cool >= editSizeX)
                temp[i] = editgrid[cool-editSizeX][row];
            else if(cool < 0)
                temp[i] = editgrid[cool+editSizeX][row];
            else
                temp[i] = editgrid[cool][row];
        }

        for(int i = 0; i < editSizeX; i++)
            editgrid[i][row] = temp[i];
    }
}
