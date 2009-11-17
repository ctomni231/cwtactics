package com.client.menu.GUI;

import com.client.logic.input.Controls;
import com.client.menu.GUI.tools.MovingPix;
import com.client.menu.GUI.tools.PixAnimate;
import com.client.menu.GUI.tools.PixMenu;
import com.client.model.loading.ImgData;
import com.client.model.object.Map;
import com.client.tools.ImgLibrary;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * This class is used to draw Map Elements to the screen.
 * @author Crecen
 */
public class MapDraw extends MovingPix{
    private final int BASE = 32;
    public final int MAX_X = 640;
    public final int MAX_Y = 480;
    private Map map;
    private MapItem[][] drawMap;
    private PixAnimate itemList;
    private double scale;
    private boolean showGrid;

    private int mapsy;
    private int mapsx;
    public int cursorx;
    public int cursory;
    private int realcurx;
    private int realcury;
    private PixMenu cursor;

    public MapDraw(Map theMap, int locx, int locy, double speed){
        super(locx, locy, speed);
        map = theMap;
        mapsx = map.getSizeX();
        mapsy = map.getSizeY();
        showGrid = false;
        itemList = new PixAnimate();
        itemList.addBuildingChange("resources/image/plugin/PlayerBuilding.png");
        itemList.addUnitChange("resources/image/plugin/PlayerUnit.png");
        itemList.loadData();
        drawMap = new MapItem[mapsx][mapsy];
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
        scale = itemList.getScale();
        cursorx = 0;
        cursory = 0;
        initCursor();
    }

    public void initCursor(){
        cursor = new PixMenu((int)posx+cursorx, (int)posy+cursory, 0);
        for(ImgData item: itemList.getData()){
            if(item.code == item.CURSOR){
                ImgLibrary temp = new ImgLibrary();
                //temp.setImageSize(item.imgFileRef.get(0).sizex,
                //        item.imgFileRef.get(0).sizey);
                temp.addImage(item.imgFileRef.get(0).filename);
                temp.setFlipX();
                temp.addImage(2, temp.getImage(0));
                temp.setFlipY();
                temp.addImage(3, temp.getImage(0));
                temp.setFlipX();
                temp.setFlipY();
                temp.addImage(4, temp.getImage(0));
                cursor.setImage(temp.getImage(0),0,0);
                cursor.createNewItem(0, 0, 0);
                cursor.addMenuImgPart(temp.getImage(0), "", 1.0);
                cursor.addMenuPart(0, false);
                cursor.createNewItem(BASE, 0, 0);
                cursor.addMenuImgPart(temp.getImage(1), "", 1.0);
                cursor.addMenuPart(0, false);
                cursor.createNewItem(0, BASE, 0);
                cursor.addMenuImgPart(temp.getImage(2), "", 1.0);
                cursor.addMenuPart(0, false);
                cursor.createNewItem(BASE, BASE, 0);
                cursor.addMenuImgPart(temp.getImage(3), "", 1.0);
                cursor.addMenuPart(0, false);

                realcurx = (int)(posx+cursorx*BASE*scale);
                realcury = (int)(posy+cursory*BASE*scale);

                cursor.setFinalPosition(
                        realcurx-(int)(cursor.getImage().getWidth()*scale/2),
                        realcury-(int)(cursor.getImage().getHeight()*scale/2));
                break;
            }
        }
    }

    public void toggleGrid(){
        showGrid = !showGrid;
    }

    public void changeScale(int tileBase){
        itemList.changeScale(tileBase);
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
        scale = itemList.getScale();
    }

    public void update(){
        if(Controls.isUpClicked())
            cursory -= 1;
        if(Controls.isDownClicked())
            cursory += 1;
        if(Controls.isLeftClicked())
            cursorx += 1;
        if(Controls.isRightClicked())
            cursorx -= 1;
        if(Controls.isActionClicked())
            toggleGrid();

        if(realcurx+(int)(BASE*scale) > MAX_X-(int)(BASE*scale))
            fposx -= (int)(BASE*scale);
        else if(realcurx < (int)(BASE*scale)/2)
            fposx += (BASE*scale);
        if(realcury+(BASE*scale) > MAX_Y-(BASE*scale))
            fposy -= (BASE*scale);
        else if(realcury < BASE*scale)
            fposy += (BASE*scale);
    }

    public void render(Graphics g, int animTime){
        realcurx = (int)(posx+cursorx*BASE*scale);
        realcury = (int)(posy+cursory*BASE*scale);

        cursor.setFinalPosition(
                realcurx-(int)(cursor.getImage().getWidth()*scale/2),
                realcury-(int)(cursor.getImage().getHeight()*scale/2));

        renderSpeed();
        for(int j = 0; j < mapsy; j++){
            for(int i = 0; i < mapsx; i++){
                if(drawMap[i][j].change)
                    drawMap[i][j] = createNewImage(drawMap[i][j], i, j);
                if(drawMap[i][j].terrain != null)
                    g.drawImage(itemList.getImage(drawMap[i][j].terrain,
                            animTime), 
                        (int)(posx+(i*BASE*scale)),
                        (int)(posy+((j-1)*BASE*scale)));
                if(showGrid){
                    g.setColor(Color.lightGray);
                    g.drawRect((int)(posx+i*BASE*scale),
                        (int)(posy+j*BASE*scale),
                        (int)((BASE+1)*scale),
                        (int)((BASE+1)*scale));
                }
                if(drawMap[i][j].unit != null)
                    g.drawImage(itemList.getImage(drawMap[i][j].unit,
                            animTime),
                        (int)(posx+((i*BASE-(BASE/2))*scale)),
                        (int)(posy+(((j-1)*BASE+(BASE/2))
                        *scale)));
            }
        }
        cursor.render(g);
    }

    private MapItem createNewImage(MapItem item, int x, int y){
        if(item.terrain == null){
            item.terrain = itemList.getImgPart(
               map.getField()[x][y].sheet().getName().toUpperCase(),
               0, 0);
            itemList.makeNewImage(item.terrain);
        }
        if(item.unit == null && map.getField()[x][y].getUnit() != null){
            item.unit = itemList.getImgPart(
               map.getField()[x][y].getUnit().sheet().getName().toUpperCase(),
               0, 0);
            itemList.makeNewImage(item.unit);
        }
        item.change = false;
        return item;
    }
}
