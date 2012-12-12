package com.cwt.graphic.tools;

import java.awt.Component;
import java.awt.Graphics2D;

import org.newdawn.slick.Graphics;

import com.cwt.game.ObjectLibrary;
import com.cwt.system.jslix.state.ScreenSkeleton;
import com.engine.EngineBridge;

/*
 * MapField.java
 *
 * This class is made to create a map that directly interacts with
 * the JavaScript bridge. Its sole function is to be able to read,
 * display, and use the JavaScript engine to interact with map
 * functions.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.10.12
 */
public class MapField extends MovingMenu implements ScreenSkeleton{
	
	/** Holds the default base value */
    public final int BASE = ObjectLibrary.BASE;

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
    
    /** Holds the scale of currently drawn tiles */
    private double scale;
    
	public MapField(int locx, int locy, double speed) {
		super(locx, locy, speed);
		mapsx = MAP_X;
        mapsy = MAP_Y;
        drawMap = new MapItem[mapsx][mapsy];
        scale = ObjectLibrary.getScale();
        resetMap();
	}
	
	public void loadMap(String jsonMap){
		EngineBridge.setModule("PERSISTENCE");
		EngineBridge.callFunction("load", EngineBridge.evalExpression(jsonMap));
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
                    g.drawImage(ObjectLibrary.getSlickImage(drawMap[i][j].terrain,
                            0, 0), (int)(posx+i*BASE*scale),
                            (int)(posy+(j-1)*BASE*scale));
                }
            }
        }
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
                    g.drawImage(ObjectLibrary.getImage(drawMap[i][j].terrain, 
                            0, 0), (int)(posx+i*BASE*scale),
                            (int)(posy+(j-1)*BASE*scale), dthis);
                }
            }
        }
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
	
	/**
     * This function resets the map graphics
     */
    private void resetMap(){
        deleteItems();
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
    }
}
