package com.cwt.map;

import com.cwt.menu.tools.MovingMenu;
import com.cwt.oldgame.PixAnimate;
import com.cwt.tools.KeyControl;
import com.jslix.state.ScreenSkeleton;

import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/*
 * MapDraw.java
 *
 * This draws the map screen for the map editor and versus screen.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.11.11
 */
public class MapDraw extends MovingMenu implements ScreenSkeleton{

    /** Holds the default base value */
    public final int BASE = PixAnimate.BASE;

    /** Default x-axis size for editor maps */
    public final int MAP_X = 30;
    /** Default y-axis size for editor maps */
    public final int MAP_Y = 20;

    /** The current x-axis tile width of the map */
    private int mapsx;
    /** The current y-axis tile height of the map */
    private int mapsy;
    /** The current map drawn to the screen */
    private MapItem[][] drawMap;
    
    /** The current cursor for the map */
    private MapCursor cursor;
    /** Holds the scale of currently drawn tiles */
    private double scale;
    /** The tile x-axis location of the cursor */
    private int cursorx;
    /** The tile y-axis location of the cursor */
    private int cursory;
    /** Holds whether the map grows to screen size */
    private boolean stretch;

    /**
     * This class helps draw the map to the screen using a floating map. It
     * was made to be versatile so it can be used for many screens.
     * @param locx The x-axis location of this map
     * @param locy The y-axis location of this map
     * @param speed How quickly the map moves across the screen
     */
    public MapDraw(int locx, int locy, double speed){
        super(locx, locy, speed);
        mapsx = MAP_X;
        mapsy = MAP_Y;
        drawMap = new MapItem[mapsx][mapsy];
        scale = PixAnimate.getScale();
        cursor = new MapCursor(locx, locy, 0);
        cursorx = 0;
        cursory = 0;
        stretch = false;
        resetMap();
    }

    /**
     * This function updates all the items of the map and the map cursor
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The current time in milliseconds
     * @param mouseScroll The mouse scroll wheel actions
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        super.update(width, height, sysTime, mouseScroll);
        cursor.update(width, height, sysTime, mouseScroll);
        cursor.setFinalPosition((int)(fposx+cursorx*BASE*scale),
                (int)(fposy+cursory*BASE*scale+BASE*scale));

        if(KeyControl.isUpClicked())
            cursory--;
        if(KeyControl.isDownClicked())
            cursory++;
        if(KeyControl.isRightClicked())
            cursorx++;
        if(KeyControl.isLeftClicked())
            cursorx--;

        //Tries to keep cursor inside the screen
        if(cursor.fposx+(int)(BASE*scale) > width-(int)(BASE*scale)/4)
            fposx -= (int)(BASE*scale);
        else if(cursor.fposx < -(int)(BASE*scale)/4)
            fposx += (BASE*scale);
        if(cursor.fposy+(BASE*scale) > height+(int)(BASE*scale)/4)
            fposy -= (BASE*scale);
        else if(cursor.fposy < (int)(BASE*scale)/4)
            fposy += (BASE*scale);
    }

    /**
     * This function draws the cursor according to a map tile position
     * @param tilex The x-axis position of the tile
     * @param tiley The y-axis position of the tile
     */
    public void setCursor(int tilex, int tiley){
        if(tilex >= 0 && tilex < mapsx)
            cursorx = tilex;
        if(tiley >= 0 && tiley < mapsy)
            cursory = tiley;
    }

    /**
     * This function renders the map graphics for Slick2D
     * @param g The Slick2D graphics object
     */
    @Override
    public void render(Graphics g){
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++){
                if(drawMap[i][j].change)
                    createNewImage(drawMap[i][j], i, j);
                if(drawMap[i][j].terrain >= 0){
                    g.drawImage(PixAnimate.getSlickImage(drawMap[i][j].terrain,
                            0, 0), (int)(posx+i*BASE*scale),
                            (int)(posy+(j-1)*BASE*scale));
                }
            }
        }

        cursor.render(g);
    }


    /**
     * This function renders the map graphics for Java2D
     * @param g The Java2D graphics object
     * @param dthis The Component helper for rendering graphics
     */
    @Override
    public void render(Graphics2D g, Component dthis){
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++){
                if(drawMap[i][j].change)
                    createNewImage(drawMap[i][j], i, j);
                if(drawMap[i][j].terrain >= 0){
                    g.drawImage(PixAnimate.getImage(drawMap[i][j].terrain, 
                            0, 0), (int)(posx+i*BASE*scale),
                            (int)(posy+(j-1)*BASE*scale), dthis);
                }
            }
        }

        cursor.render(g, dthis);
    }


    /**
     * This function resets the map graphics
     */
    private void resetMap(){
        deleteItems();
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
        //Sets up the cursor
        cursor.setCursor(0);
    }

    /**
     * This function creates a new tile within the map
     * @param item The new tile graphic information holder
     * @param x The x-axis tile location of this image
     * @param y The y-axis tile location of this image
     * @return The tile graphics image holder associated with this object
     */
    private MapItem createNewImage(MapItem item, int x, int y){
        if(item.terrain < 0){
            item.terrain = 0;
            item.blank = 0;
            item.connect = 0;
        }

        return item;
    }
}
