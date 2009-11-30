package com.client.menu.GUI;

import com.client.logic.input.Controls;
import com.client.logic.status.Status;
import com.client.menu.GUI.tools.MovingPix;
import com.client.menu.GUI.tools.PixAnimate;
import com.client.menu.GUI.tools.PixMenu;
import com.client.menu.logic.Menu;
import com.client.model.Fog;
import com.client.model.Move;
import com.client.model.Range;
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
    private final int DELAY = 25;
    public final int MAX_X = 640;
    public final int MAX_Y = 480;
    public final Color FOG = new Color(150,150,150);
    private int udcntr;
    private int lrcntr;
    private Map map;
    private MapItem[][] drawMap;
    private PixAnimate itemList;
    private double scale;
    private boolean showGrid;

    private int mapsy;
    private int mapsx;
    private int cursorx;
    private int cursory;
    private int realcurx;
    private int realcury;
    private PixMenu cursor;

    public MapDraw(Map theMap, int locx, int locy, double speed){
        super(locx, locy, speed);
        udcntr = 0;
        lrcntr = 0;
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
                temp.addImage(item.imgFileRef.get(0).filename);
                temp.setImageSize((int)(temp.getX(0)*scale),
                        (int)(temp.getY(0)*scale));
                temp.addImage(0, temp.getImage(0));
                temp.setFlipX();
                temp.addImage(1, temp.getImage(0));
                temp.setFlipY();
                temp.addImage(2, temp.getImage(0));
                temp.setFlipX();
                temp.setFlipY();
                temp.addImage(3, temp.getImage(0));
                cursor.setImage(temp.getImage(0),0,0);
                cursor.createNewItem(0, 0, .5);
                cursor.addMenuImgPart(temp.getImage(0), "", 1.0);
                cursor.addMenuPart(0, false);
                cursor.createNewItem((int)(BASE*scale), 0, .5);
                cursor.addMenuImgPart(temp.getImage(1), "", 1.0);
                cursor.addMenuPart(0, false);
                cursor.createNewItem(0, (int)(BASE*scale), .5);
                cursor.addMenuImgPart(temp.getImage(2), "", 1.0);
                cursor.addMenuPart(0, false);
                cursor.createNewItem((int)(BASE*scale), (int)(BASE*scale), .5);
                cursor.addMenuImgPart(temp.getImage(3), "", 1.0);
                cursor.addMenuPart(0, false);

                realcurx = (int)(posx+cursorx*BASE*scale);
                realcury = (int)(posy+cursory*BASE*scale);

                cursor.setFinalPosition(
                        realcurx-(int)(temp.getX(0)/2),
                        realcury-(int)(temp.getY(0)/2));
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
        initCursor();
    }

    public boolean update(int mouseX, int mouseY, int mouseScroll,
            boolean scroll, boolean mouseLock){

        if(Controls.isUpDown())         udcntr++;
        else if(Controls.isDownDown())  udcntr--;
        else                            udcntr = 0;

        if(Controls.isRightDown())      lrcntr++;
        else if(Controls.isLeftDown())  lrcntr--;
        else                            lrcntr = 0;

        if(cursory > 0 && (Controls.isUpClicked() || 
                (scroll && udcntr > DELAY))){
            cursory -= 1;
            speed = 0;
            scroll = false;
        }else if(cursory < mapsy-1 && (Controls.isDownClicked() ||
                (scroll && udcntr < -DELAY))){
            cursory += 1;
            speed = 0;
            scroll = false;
        }
        if(cursorx < mapsx-1 && (Controls.isLeftClicked() || 
                (scroll && lrcntr < -DELAY))){
            cursorx += 1;
            speed = 0;
            scroll = false;
        }else if(cursorx > 0 && (Controls.isRightClicked() ||
                (scroll && lrcntr > DELAY))){
            cursorx -= 1;
            speed = 0;
            scroll = false;
        }

        if(Menu.getList().size() > 0 ){
            System.out.println("MENU APPROACHING: "+Menu.getList().size());
            if(Menu.getList().size() != 0)
                System.out.println("SEL BUTTON:"+ Menu.getSelected().getSheet().getName());
        }

        //Makes the mouse move the cursor
        if(!mouseLock){
            speed = 2;
            if(posx+1 == fposx)     posx++;
            if(posy+1 == fposy)     posy++;
            
            if(realcurx+(int)(BASE*scale) < mouseX && cursorx+1 < mapsx)
                cursorx++;
            else if(realcurx > mouseX && cursorx > 0)
                cursorx--;
            if(realcury+(int)(BASE*scale) < mouseY && cursory+1 < mapsy)
                cursory++;
            else if(realcury > mouseY && cursory > 0)
                cursory--;
        }

        realcurx = (int)(fposx+cursorx*BASE*scale);
        realcury = (int)(fposy+cursory*BASE*scale);
        
        if(realcurx+(BASE*scale) > MAX_X-(BASE*scale))
            fposx -= (BASE*scale/2);
        else if(realcurx < (BASE*scale/2))
            fposx += (BASE*scale/2);
        if(realcury+(BASE*scale) > MAX_Y-(BASE*scale))
            fposy -= (BASE*scale/2);
        else if(realcury < (BASE*scale/2))
            fposy += (BASE*scale/2);


        return scroll;
    }

    public void render(Graphics g, int animTime){
        drawCursor(animTime);

        renderSpeed();
        for(int j = 0; j < mapsy; j++){
            for(int i = 0; i < mapsx; i++){
                if(drawMap[i][j].change)
                    drawMap[i][j] = createNewImage(drawMap[i][j], i, j);
                if(drawMap[i][j].terrain != null)
                    if(Fog.inFog(map.getTile(i, j))){
                        g.drawImage(itemList.getImage(drawMap[i][j].terrain,
                            animTime), (int)(posx+(i*BASE*scale)),
                        (int)(posy+((j-1)*BASE*scale)), FOG);
                    }else{
                        g.drawImage(itemList.getImage(drawMap[i][j].terrain,
                            animTime), (int)(posx+(i*BASE*scale)),
                        (int)(posy+((j-1)*BASE*scale)));
                    }
                if(showGrid){
                    g.setColor(Color.lightGray);
                    g.drawRect((int)(posx+i*BASE*scale),
                        (int)(posy+j*BASE*scale),
                        (int)((BASE+1)*scale),
                        (int)((BASE+1)*scale));
                }
                if(Status.getStatus() == Status.Mode.SHOW_MOVE){
                    if(Move.getTiles().containsKey(map.getTile(i, j))){
                        g.setColor(new Color(0, 0, 255, 100));
                        g.fillRect((int)(posx+i*BASE*scale),
                            (int)(posy+j*BASE*scale), (int)(BASE*scale),
                            (int)(BASE*scale));
                    }
                }
                if(Status.getStatus() == Status.Mode.SHOW_RANGE){
                    if(Range.isIn(map.getTile(i, j))){
                        g.setColor(new Color(255, 0, 0, 100));
                        g.fillRect((int)(posx+i*BASE*scale),
                            (int)(posy+j*BASE*scale), (int)(BASE*scale),
                            (int)(BASE*scale));
                    }
                }
                if(drawMap[i][j].unit != null){
                    if(Fog.isVisible(map.getTile(i,j).getUnit())){
                        g.drawImage(itemList.getImage(drawMap[i][j].unit,
                        animTime), (int)(posx+((i*BASE-(BASE/2))*scale)),
                        (int)(posy+(((j-1)*BASE+(BASE/2))*scale)));
                        if(map.getTile(i, j).getUnit().getHealth() < 100){
                            g.setColor(Color.white);
                            g.drawString(""+map.getTile(i,j).getUnit().
                               getHealth(), (int)(posx+i*BASE*scale+15*scale),
                                (int)(posy+j*BASE*scale+18*scale));
                        }
                    }
                }
            }
        }
        cursor.render(g);
    }

    public int getCursorX(){
        return cursorx;
    }

    public int getCursorY(){
        return cursory;
    }
    
    public void updateMapItem(int x, int y){    	
    	MapItem item = drawMap[x][y];
    	item.unit = null;
        int color = 0;
        if(map.getField()[x][y].getOwner() != null)
            color = map.getField()[x][y].getOwner().getID()+1;
        item.terrain = itemList.getImgPart( map.getField()[x][y].sheet().
                getID().toUpperCase(), color, 0);
        itemList.makeNewImage(item.terrain);
        if( map.getField()[x][y].getUnit() != null){
            color = 0;
            if(map.getField()[x][y].getUnit().getOwner() != null)
                color = map.getField()[x][y].getUnit().getOwner().getID()+1;
            item.unit = itemList.getImgPart( map.getField()[x][y].
                    getUnit().sheet().getID().toUpperCase(), color, 0);
            itemList.makeNewImage(item.unit);
        }
    }

    private void drawCursor(int animTime){
        realcurx = (int)(posx+cursorx*BASE*scale);
        realcury = (int)(posy+cursory*BASE*scale);

        cursor.setFinalPosition(
                realcurx-(int)(cursor.getImage().getWidth()/2),
                realcury-(int)(cursor.getImage().getHeight()/2));
        if(animTime > 750){
            cursor.setItemPosition(0, (int)(2*scale), (int)(2*scale));
            cursor.setItemPosition(1, (int)(-2*scale+BASE*scale),
                    (int)(2*scale));
            cursor.setItemPosition(2, (int)(2*scale),
                    (int)(-2*scale+BASE*scale));
            cursor.setItemPosition(3, (int)(-2*scale+BASE*scale),
                    (int)(-2*scale+BASE*scale));
        }else if(animTime > 0 && animTime < 250){
            cursor.setItemPosition(0, 0, 0);
            cursor.setItemPosition(1, (int)(BASE*scale), 0);
            cursor.setItemPosition(2, 0, (int)(BASE*scale));
            cursor.setItemPosition(3, (int)(BASE*scale), (int)(BASE*scale));
        }
    }

    private MapItem createNewImage(MapItem item, int x, int y){      
        if(item.terrain == null){
            int color = 0;
            if(map.getField()[x][y].getOwner() != null)
                color = map.getField()[x][y].getOwner().getID()+1;
            item.terrain = itemList.getImgPart(map.getField()[x][y].sheet().
                    getID(), color, 0);
            itemList.makeNewImage(item.terrain);
        }        
        if(item.unit == null && map.getField()[x][y].getUnit() != null){
            int color = 0;
            if(map.getField()[x][y].getUnit().getOwner() != null)
                color = map.getField()[x][y].getUnit().getOwner().getID()+1;
            item.unit = itemList.getImgPart(map.getField()[x][y].getUnit().
                    sheet().getID(), color, 0);
            itemList.makeNewImage(item.unit);
        }
        item.change = false;
        return item;
    }
}
