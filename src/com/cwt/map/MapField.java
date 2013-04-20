package com.cwt.map;

import java.awt.Component;
import java.awt.Graphics2D;

import org.newdawn.slick.Graphics;

import com.cwt.game.ObjectLibrary;
import com.cwt.menu.tools.MovingMenu;
import com.cwt.tools.XML_Reader;
import com.engine.EngineApi;
import com.jslix.state.ScreenSkeleton;
import com.jslix.tools.RomanNumeral;

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
 * @version 4.20.13
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
        scale = ObjectLibrary.getScale();
        drawMap = new MapItem[mapsx][mapsy];
        resetMap();
	}
	
	public void loadMap(){
		while( EngineApi.hasNextAction() ){
		    EngineApi.flushNextAction();
		}
		
		mapsx = EngineApi.getModelObject().getPropertyAsInteger("mapWidth");
	    mapsy = EngineApi.getModelObject().getPropertyAsInteger("mapHeight");
	    
	    Object[] temp = EngineApi.getModelObject().getPropertyAsArray("map");
	    System.out.println("TEMP STRING LENGTH:"+temp.length);
	    System.out.println("MAP SIZE: ("+mapsx+","+mapsy+")");
		
		drawMap = new MapItem[mapsx][mapsy];
		resetMap();
		for(int i = 0; i < mapsx; i++){
           for(int j = 0; j < mapsy; j++){
            	drawMap[i][j].terrain = ObjectLibrary.getTerrainIndex("PLIN");
           }    
        }
	}
	
	
	//TODO: Use model.map to load the map and get all the data
	//TODO: Also make sure to finish off terrain connections and unit animations
	//TODO: Finish up the CO images, and start to update the Graphics todo list
	public void loadMapFromEngine(){
		while( EngineApi.hasNextAction() ){
		    EngineApi.flushNextAction();
		}
		
	    mapsx = EngineApi.getModelObject().getPropertyAsInteger("mapWidth");
	    mapsy = EngineApi.getModelObject().getPropertyAsInteger("mapHeight");
	    
		//System.out.println("Length: "+EngineBridge.getPropertyAsArray("map").length);
		//System.out.println(EngineBridge.getProperty("map"));
		//System.out.println("("+mapsx+","+mapsy+")");
		drawMap = new MapItem[mapsx][mapsy];
		resetMap();
		for(int i = 0; i < mapsx; i++){
           for(int j = 0; j < mapsy; j++){
            	drawMap[i][j].terrain = ObjectLibrary.getTerrainIndex("PLIN");
           }    
        }	
	}
	
	public void loadAMap(String filename){
		XML_Reader.parse(filename);
		mapsx = Integer.valueOf(XML_Reader.getJSONAttribute("mapWidth", 0));
		mapsy = Integer.valueOf(XML_Reader.getJSONAttribute("mapHeight", 0));
		int terrFill = ObjectLibrary.getTerrainIndex(XML_Reader.getJSONAttribute("filler", 0));
		String terrTemp = "";
		drawMap = new MapItem[mapsx][mapsy];
		resetMap();
		for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++){
            	terrTemp = XML_Reader.getJSONAttribute(
            	    			"data "+RomanNumeral.convert(i)+" "+RomanNumeral.convert(j), 0);
            	drawMap[i][j].terrain = (terrTemp.length() > 0) ? 
            	    			ObjectLibrary.getTerrainIndex(terrTemp) : terrFill;
            }
		}
		XML_Reader.clear();
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
                	drawMap[i][j] = createNewImage(drawMap[i][j], i, j);
                if(drawMap[i][j].connect >= 0){
                    g.drawImage(ObjectLibrary.getSlickImage(drawMap[i][j].connect,
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
                    drawMap[i][j] = createNewImage(drawMap[i][j], i, j);
                if(drawMap[i][j].connect >= 0){
                    g.drawImage(ObjectLibrary.getImage(drawMap[i][j].connect, 
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
    	item.connect = item.terrain;
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
