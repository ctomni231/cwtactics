package com.cwt.graphic.tools;

import com.cwt.io.KeyControl;
import com.cwt.map.PixAnimate;
import com.cwt.system.jslix.state.ScreenSkeleton;
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
 * @version 12.10.11
 */
public class MapDraw extends MenuItem implements ScreenSkeleton{

    public final int BASE = PixAnimate.BASE;//Holds the default base value

    public final int MAP_X = 30;//Default x-axis size for editor maps
    public final int MAP_Y = 20;//Default y-axis size for editor maps

    private int mapsx;//The current x-axis tile width of the map
    private int mapsy;//The current y-axis tile height of the map
    private MapItem[][] drawMap;//The current map drawn to the screen
    
    private MapCursor cursor;//The current cursor for the map
    private double scale;//Holds the scale of currently drawn tiles
    private int cursorx;//The tile x-axis location of the cursor
    private int cursory;//The tile y-axis location of the cursor

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
        resetMap();
    }
    
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll){
        updatePosition();
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
        if(cursor.fposx+(int)(BASE*scale) > width-(int)(BASE*scale))
            fposx -= (int)(BASE*scale);
        else if(cursor.fposx < (int)(BASE*scale)/2)
            fposx += (BASE*scale);
        if(cursor.fposy+(BASE*scale) > height-(BASE*scale))
            fposy -= (BASE*scale);
        else if(cursor.fposy < BASE*scale)
            fposy += (BASE*scale);
    }

    public void setCursor(int tilex, int tiley){
        if(tilex >= 0 && tilex < mapsx)
            cursorx = tilex;
        if(tiley >= 0 && tiley < mapsy)
            cursory = tiley;
    }

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
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }

        //Sets up the cursor
        cursor.setCursor(0);
        
        //Set up terrain
        //PixAnimate.getTerrain();

    }

    private MapItem createNewImage(MapItem item, int x, int y){
        if(item.terrain < 0){
            item.terrain = 0;
            item.blank = 0;
            item.connect = 0;
        }
        return item;
    }

    public void init() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void update(int timePassed) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void update(String name, int index, boolean isApplet, boolean seethru) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
