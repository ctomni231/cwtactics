package com.jslix.tools;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.awt.image.MemoryImageSource;

/**
 * PixtureMap.java
 *
 * A class made specifically for editing the pixel portion of the images
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 * @todo TODO Finish commenting this class
 */

public class PixtureMap extends ImgLibrary{

    private static final long serialVersionUID = 2452945053572843636L;
	
    //The graphics class used for creating images
    private Graphics2D g;
    //The Image class used to store the creations
    private BufferedImage bimg;
    //The width of the edit image portion
    private int editSizeX;
    //The height of the edit image portion
    private int editSizeY;
    //The transparent color of the image
    private Color transparent;
    //The pixel representation of the grid for editing
    private int[][] editgrid;
    //The current opascity of an update
    private double editOpacity;

    public PixtureMap(){
        super();
        initialize(Color.BLACK);
    }

    //Creates the buffered image to be used with the grid
     public void createImg(int sizex, int sizey){
         if(sizex < 1)  sizex = 1;
         if(sizey < 1)  sizey = 1;
         bimg = new BufferedImage(sizex, sizey, BufferedImage.TYPE_INT_ARGB);
         g = bimg.createGraphics();
         createImgGrid(sizex, sizey);
     }

    /**
     * Creates a blank buffered image, overwrites the other image
     * @param x The width of the image
     * @param y The height of the image
     */
    public void createImgGrid(int x, int y){
        if(x < 1)  x = 1;
        if(y < 1)  y = 1;
        editSizeX = x;
        editSizeY = y;
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
    
    //Draws a picture to the grid and stores the picture within the
    //internal ImgLibrary. Use can use flip, color, and rotate
    //functions before this function.
    public void setImageToGrid(Image img, int locx, int locy){
        int index = length();
        addImage(img);
        setImageToGrid(index, locx, locy);
    }
    //Draws a picture to the pixel grid from the internal ImgLibrary
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

    //Use to rotate the grid 90 degrees clockwise
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

    //Use to flip a grid along its x-axis
    public void flipGridXAxis(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                change[(editSizeX-i-1)+(j*editSizeX)] = editgrid[i][j];
        }
        copyArray(change);
    }

    public void setOpacity(double number){
        if(number >= 0 && number <= 1)
            editOpacity = (1-number);
    }

    //Use to flip a grid along its y-axis
    public void flipGridYAxis(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                change[i+((editSizeY-j-1)*editSizeX)] = editgrid[i][j];
        }
        copyArray(change);
    }

    //Adds a color box to the grid
    public void addColorBoxToGrid(Color theColor,
            int sizex, int sizey, int locx, int locy){
        for(int i = 0; i < sizex; i++){
            for(int j = 0; j < sizey; j++)
                drawPermPixel(theColor.getRGB(),locx+i,locy+j);
        }
    }

    //Merges the grid to the image
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

    //Adds text to the image
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

    //Gets a grid image
    public Image getGridImage(){
        mergeGridToImage();
        return bimg;
    }

    public Image getTextPicture(String text){
        createImg(1,1);
        g.setFont(Font.getFont(Font.DIALOG));
        int width = g.getFontMetrics().stringWidth(text);
        int descent = g.getFontMetrics().getDescent();
        int height = g.getFontMetrics().getHeight()+descent;
        createImg(width, height);
        addTextToGridImage(text, 0, height-descent);
        return getGridImage();
    }

    //Moves pixels upward(-) or downward(+) in a specific row
    public void horizontalPixelMove(int movePixel, int row){
        moveColumnPixels(row, movePixel);
    }

    //Moves pixels upward(-) or downward(+) in all rows
    public void horizontalPixelMove(int movePixel){
        for(int i = 0; i < editSizeY; i++)
            moveColumnPixels(i, movePixel);
    }

    //Moves pixels left(-) or right(+) in a specific column
    public void verticalPixelMove(int movePixel, int column){
        moveRowPixels(column, movePixel);
    }

    //Moves pixels left(-) or right(+) in all columns
    public void verticalPixelMove(int movePixel){
        for(int i = 0; i < editSizeX; i++)
            moveRowPixels(i, movePixel);
    }

    private void initialize(Color theColor){
        editOpacity = 1.0;
        createImage(1, 1);
        editSizeX = 1;
        editSizeY = 1;
        transparent = theColor;
    }
    
    private Image createPixelMapImage(){
        return createImage(new MemoryImageSource(editSizeX, editSizeY,
                getPixels(), 0, editSizeX));
    }
    
    private int[] getPixels(){
        int[] change = new int[editSizeX*editSizeY];
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                if(editgrid[i][j] != transparent.getRGB())
                    change[i+(j*editSizeY)] = editgrid[i][j];
        }
        return change;
    }

    private void copyArray(int[] change){
        for(int i = 0; i < editSizeX; i++){
            for(int j = 0; j < editSizeY; j++)
                 editgrid[i][j] = change[i+(j*editSizeY)];
        }
    }

    private void drawPermPixel(int colorInRGB, int locx, int locy){
        if(locx >= 0 && locx < editSizeX){
            if(locy >= 0 && locy < editSizeY){
                if(colorInRGB != transparent.getRGB())
                    editgrid[locx][locy] = colorInRGB;
            }
        }
    }

     //This private function can move a column of pixels to the
     //right/left according to the number chosen in [movePixels]
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

    //This private function can move a row of pixels to the
    //right/left according to the number chosen in [movePixels]
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
