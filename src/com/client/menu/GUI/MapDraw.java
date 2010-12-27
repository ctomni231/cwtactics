package com.client.menu.GUI;

import com.system.input.Controls;
import com.customwarsTactics.service.StatusController;
import com.client.menu.GUI.tools.MouseBox;
import com.client.menu.GUI.tools.MovingPix;
import com.client.menu.GUI.tools.PixAnimate;
import com.customwarsTactics.logic.mapController.Fog;
import com.client.model.Instance;
import com.customwarsTactics.logic.mapController.Move;
import com.customwarsTactics.logic.mapController.Range;
import com.customwarsTactics.model.mapObjects.Map;

import java.util.ArrayList;
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
    
    private double scale;
    private boolean showGrid;
    private MapArrow arrow;

    private int column;
    private int tilebase;

    private int mapsy;
    private int mapsx;
    private int cursorx;
    private int cursory;
    private int realcurx;
    private int realcury;

    private ArrayList<Integer> shakeX;
    private ArrayList<Integer> shakeY;
    private int shakex;
    private int shakey;

    private boolean mapScr;
    private boolean mapWatch;
    private int mapInd;
    private int smallTile;

    private boolean ready;
    private boolean drawAll;
    private ArrayList<MouseBox> drawBox;

    //TODO connections, menu

    public MapDraw(Map theMap, int locx, int locy, double speed){
        super(locx, locy, speed);
        udcntr = 0;
        lrcntr = 0;
        shakeX = new ArrayList<Integer>();
        shakeY = new ArrayList<Integer>();
        shakex = 0;
        shakey = 0;
        mapScr = true;
        mapWatch = true;
        ready = false;
        mapInd = 4;
        arrow = new MapArrow(theMap, BASE);
        map = theMap;
        mapsx = map.getSizeX();
        mapsy = map.getSizeY();
        showGrid = false;
        tilebase = BASE;
        drawMap = new MapItem[mapsx][mapsy];
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
        scale = PixAnimate.getScale();
        cursorx = 0;
        cursory = 0;
        column = 0;
        drawBox = new ArrayList<MouseBox>();
        addTopBox();
    }

    public void addTopBox(){
        addBox(0, 0, 0, 250, 50);
    }

    public void skipAnimation(){
        arrow.skipAnimation();
    }

    public void addShake(int x, int y){
        shakeX.add(x);
        shakeY.add(y);
    }

    public void addBox(int locx, int locy, int sizex, int sizey){
        MouseBox temp = new MouseBox();
        temp.setData(locx, locy, sizex, sizey);
        drawBox.add(temp);
    }
    public void addBox(int index, int locx, int locy, int sizex, int sizey){
        MouseBox temp = new MouseBox();
        temp.setData(locx, locy, sizex, sizey);
        if(index < drawBox.size())
            drawBox.set(index, temp);
        else
            drawBox.add(temp);
    }
    public void removeBox(int index){
        if(index >= 0 && index < drawBox.size())
            drawBox.remove(index);
    }
    public void clearAllBox(){
        drawBox.clear();
    }

    public void changeType(String type){
        PixAnimate.clearData();
        PixAnimate.addPreferredItem("TERRAIN", type);
        PixAnimate.addPreferredItem("CITY", type);
        PixAnimate.addPreferredItem("UNIT", type);
        PixAnimate.addPreferredItem("ARROW", type);
        PixAnimate.loadData();
        changeScale();
    }

    public void changeType(String code, String type){
        PixAnimate.clearData();
        PixAnimate.addPreferredItem(code, type);
        PixAnimate.loadData();
        if(code.matches("TER.*") || code.matches("FIE.*") ||
            code.matches("PRO.*") || code.matches("CIT.*") ||
            code.matches("UNI.*") || code.matches("ARR.*"))
        changeScale();
    }

    public String[] getTypes(){
        String[] temp = new String[PixAnimate.getTypes().size()];
        for(int i = 0; i < temp.length; i++)
            temp[i] = PixAnimate.getTypes().get(i);
        return temp;
    }

    public void toggleGrid(){
        showGrid = !showGrid;
    }

    public void drawAllTiles(){
        drawAll = true;
    }

    public int getColumn(){
        return column;
    }

    public void setColumn(int index){
        column = index;
    }

    public void changeScale(int tileBase){
        tilebase = tileBase;
        changeScale();
    }

    public void changeScale(){
        PixAnimate.changeScale(tilebase);
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
        scale = PixAnimate.getScale();
        if(PixAnimate.isReady()){
            smallTile = PixAnimate.getDataLocation("PLAIN");
            arrow.setCurPosition(cursorx, cursory);
            arrow.setPosition(posx, posy);
            arrow.setScale(scale);
            arrow.setShake(shakex, shakey);
            arrow.initCursor();
        }
        drawAllTiles();
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

        if(mouseScroll != 0){
            if(mouseScroll < 0)     tilebase += 2;
            else                    tilebase -= 2;
            System.out.println("CURRENT TileBase: "+tilebase);
            changeScale();
        }

        if(!arrow.getMoveActive() && PixAnimate.isReady() != ready){
            changeScale();
            ready = PixAnimate.isReady();
        }

        return scroll;
    }

    public void update(){
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
    }    

    public void render(Graphics g, int animTime){
        if(!PixAnimate.isReady()){
            g.drawString("LOADING...", 0, 460);
            if(PixAnimate.getData().size() == 0)  return;
        }

        arrow.setCurPosition(cursorx, cursory);
        arrow.setPosition(posx, posy);
        arrow.setScale(scale);
        arrow.setShake(shakex, shakey);
        arrow.drawCursor(animTime);
        realcurx = arrow.getRealX();
        realcury = arrow.getRealY();
        renderSpeed();

        setBorder(g);

        for(int j = 0; j < mapsy; j++){
            for(int i = 0; i < mapsx; i++){
              if((i > (-posx-scale*BASE)/(scale*BASE) &&
                  i < (-posx+MAX_X)/(scale*BASE) &&
                  j > (-posy-(scale*BASE*2))/(scale*BASE) &&
                  j < (-posy+MAX_Y)/(scale*BASE))){
                if(drawMap[i][j].change)
                    drawMap[i][j] = createNewImage(drawMap[i][j], i, j);
                //UNCOMMENT TO SEE SPEED IMPROVEMENT
                if(!drawCheck(i,j))  continue;
                if(drawMap[i][j].terrain != null)
                    if(Fog.inFog(map.getTile(i, j))){
                        g.drawImage(PixAnimate.getImage(drawMap[i][j].
                        connect, 500), (int)(posx+shakex+(i*BASE* scale)),
                        (int)(posy+shakey+((j-1)*BASE*scale)), FOG);
                        if(map.getField()[i][j].getOwner() != null)
                           g.drawImage(PixAnimate.getImage(drawMap[i][j].blank,
                           500), (int)(posx+shakex+(i*BASE*scale)),
                           (int)(posy+shakey+((j-1)*BASE*scale)), FOG);                      
                    }else{
                        g.drawImage(PixAnimate.getImage(drawMap[i][j].connect,
                            animTime), (int)(posx+shakex+(i*BASE*scale)),
                        (int)(posy+shakey+((j-1)*BASE*scale)));
                        if(map.getField()[i][j].getOwner() != null)
                            g.drawImage(PixAnimate.getImage(drawMap[i][j].
                            terrain, animTime), (int)(posx+shakex+(i*BASE*
                            scale)), (int)(posy+shakey+((j-1)*BASE*scale)));                     
                    }
                if(showGrid){
                    g.setColor(Color.lightGray);
                    g.drawRect((int)(posx+shakex+i*BASE*scale),
                        (int)(posy+shakey+j*BASE*scale),
                        (int)((BASE+1)*scale),
                        (int)((BASE+1)*scale));
                }
                if(!arrow.getMoveActive() &&
                        StatusController.getStatus() == StatusController.Mode.SHOW_MOVE){
                    if(Move.getTiles().containsKey(map.getTile(i, j))){
                        g.setColor(new Color(0, 0, 255, 100));
                        g.fillRect((int)(posx+shakex+i*BASE*scale),
                            (int)(posy+shakey+j*BASE*scale), (int)(BASE*scale),
                            (int)(BASE*scale));
                    }
                }
                if(StatusController.getStatus() == StatusController.Mode.SHOW_RANGE){
                    if(Range.isIn(map.getTile(i, j))){
                        g.setColor(new Color(255, 0, 0, 100));
                        g.fillRect((int)(posx+shakex+i*BASE*scale),
                            (int)(posy+shakey+j*BASE*scale), (int)(BASE*scale),
                            (int)(BASE*scale));
                    }
                }
                if(drawMap[i][j].unit != null &&
                        map.getTile(i, j).getUnit() != null &&
                        !Fog.inFog(map.getTile(i, j))){
                    if(Fog.isVisible(map.getTile(i,j).getUnit()) &&
                            !(arrow.getMoveActive() && Move.getTargetTile().
                            equals(map.getTile(i, j)))){
                       g.drawImage(PixAnimate.getImage(drawMap[i][j].unit,
                       animTime), (int)(posx+shakex+((i*BASE-(BASE/2))*scale)),
                       (int)(posy+shakey+(((j-1)*BASE+(BASE/2))*scale)));
                        if(map.getTile(i, j).getUnit().getHealth() < 100){
                            g.setColor(Color.white);
                            g.drawString(""+map.getTile(i,j).getUnit().
                               getHealth(), (int)(posx+i*BASE*scale+15*scale),
                                (int)(posy+j*BASE*scale+18*scale));
                        }
                    }
                }
                if(!arrow.getMoveActive() &&
                        StatusController.getStatus() == StatusController.Mode.SHOW_MOVE){
                    arrow.updateArrow(g, i, j);
                }
              }
            }
        }     

        if(drawAll) drawAll = false;

        if(Fog.isProcessFog()){
            drawAllTiles();
        }
        if(arrow.getMoveActive()){
            mapInd = 8;
            renderMoveAnimation(g, animTime);
            drawAllTiles();
        }
        if(shakex != shakey && shakey != 0){
            shakex = 0;
            shakey = 0;
        }
        if(shakeX.size() > 0 && mapScr){
            mapInd = 4;
            shakex = shakeX.remove(0);
            shakey = shakeY.remove(0);
            mapScr = false;
        }

        arrow.render(g);
        arrow.updateCheck();

        

        //Display anything you want to see displayed right here
        //-----------------------------------------------------
        g.setColor(Color.white);
        g.drawString("GOLD: "+Instance.getCurPlayer().
                        getResourceValue(0), 100, 10);

        if(!PixAnimate.isReady())
            g.drawString("LOADING...", 0, 460);

        //END
        //---

        if(!mapScr)    mapControl(animTime);
    }

    private void setBorder(Graphics g){
        g.setColor(Color.black);
        if(posx > 0)
            g.fillRect(0, 0, (int)posx, MAX_Y);
        if(posx+(mapsx*scale*BASE) < MAX_X)
            g.fillRect((int)(posx+(mapsx*scale*BASE)), 0, MAX_X, MAX_Y);
        if(posy > 0)
            g.fillRect(0, 0, MAX_X, (int)posy);
        if(posy+(mapsy*scale*BASE) < MAX_Y)
            g.fillRect(0, (int)(posy+(mapsy*scale*BASE)), MAX_X, MAX_Y);
    }

    private boolean drawCheck(int i, int j){
        if(!arrow.checkPosition())
            return true;
        if(i >= cursorx-1 && i <= cursorx+1 &&
                j >= cursory-1 && j <= cursory+1)
            return true;
        if(!arrow.checkCursor() && i >= cursorx-2 && i <= cursorx+2 &&
                j >= cursory-2 && j <= cursory+2)
            return true;
        if(drawMap[i][j].unit != null)
            return true;
        if(drawMap[i][j].terrain.ind != smallTile)
            return true;
        if(arrow.getMoveActive())
            return true;
        if(StatusController.getStatus() == StatusController.Mode.SHOW_MOVE &&
                Move.getTiles().containsKey(map.getTile(i, j)))
            return true;
        if(StatusController.getStatus() == StatusController.Mode.SHOW_RANGE &&
                Range.isIn(map.getTile(i, j)))
            return true;
        if(drawField(i,j))
            return true;
        return drawAll;
    }

    /**
     * Checks to see if a tile is within a particular field of drawing
     */
    public boolean drawField(int i, int j){
        for(int k = 0; k < drawBox.size(); k++){
            if(drawBox.get(k).getData(0) <= posx+i*BASE*scale &&
               drawBox.get(k).getData(1) <= posy+j*BASE*scale &&
               drawBox.get(k).getData(2) >= posx+i*BASE*scale &&
               drawBox.get(k).getData(3) >= posy+j*BASE*scale)
                return true;
            if(drawBox.get(k).getData(0) <= posx+(i*BASE*scale)+(BASE*scale) &&
               drawBox.get(k).getData(1) <= posy+(j*BASE*scale)+(BASE*scale) &&
               drawBox.get(k).getData(2) >= posx+(i*BASE*scale)+(BASE*scale) &&
               drawBox.get(k).getData(3) >= posy+(j*BASE*scale)+(BASE*scale))
                return true;
        }
        return false;
    }

    public int getCursorX(){
        return cursorx;
    }

    public int getCursorY(){
        return cursory;
    }

    public int getTileBase(){
        return tilebase;
    }

    private MapItem createNewImage(MapItem item, int x, int y){      
        if(item.terrain == null){
            int color = 0;
            if(map.getField()[x][y].getOwner() != null)
                color = map.getField()[x][y].getOwner().getID()+1;
            item.terrain = PixAnimate.getImgPart(map.getField()[x][y].sheet().
                    getID(), color, 0);
            PixAnimate.makeNewImage(item.terrain);
            item.blank = PixAnimate.getImgPart( map.getField()[x][y].sheet().
                getID().toUpperCase(), 0, 0);
            PixAnimate.makeNewImage(item.blank);
            item.connect = PixAnimate.getBuildPart(map.getField()[x][y].
                    sheet().getID().toUpperCase(), color, 0);
            PixAnimate.makeNewImage(item.connect);
        }        
        if(item.unit == null && map.getField()[x][y].getUnit() != null){
            int color = 0;
            if(map.getField()[x][y].getUnit().getOwner() != null)
                color = map.getField()[x][y].getUnit().getOwner().getID()+1;
            item.unit = PixAnimate.getImgPart(map.getField()[x][y].getUnit().
                    sheet().getID(), color, 0);
            PixAnimate.makeNewImage(item.unit);
        }
        item.change = false;
        return item;
    }

    public void updateMapItem(int x, int y){
    	MapItem item = drawMap[x][y];
    	item.unit = null;
        int color = 0;
        if(map.getField()[x][y].getOwner() != null)
            color = map.getField()[x][y].getOwner().getID()+1;
        item.terrain = PixAnimate.getImgPart( map.getField()[x][y].sheet().
                getID().toUpperCase(), color, 0);
        PixAnimate.makeNewImage(item.terrain);
        item.blank = PixAnimate.getImgPart( map.getField()[x][y].sheet().
                getID().toUpperCase(), 0, 0);
        PixAnimate.makeNewImage(item.blank);
        item.connect = PixAnimate.getBuildPart( map.getField()[x][y].sheet().
                getID().toUpperCase(), color, 0);
        PixAnimate.makeNewImage(item.connect);
        if( map.getField()[x][y].getUnit() != null){
            color = 0;
            if(map.getField()[x][y].getUnit().getOwner() != null)
                color = map.getField()[x][y].getUnit().getOwner().getID()+1;
            item.unit = PixAnimate.getImgPart( map.getField()[x][y].
                    getUnit().sheet().getID().toUpperCase(), color, 0);
            PixAnimate.makeNewImage(item.unit);
        }
    }

    public void startMoveAnimation(){
        arrow.startMoveAnimation();
    }

    public boolean isAnimationRunning(){
        return arrow.getMoveActive();
    }

    private void renderMoveAnimation(Graphics g, int animTime){
        //System.out.println("UNIT: ("+unitcurx+","+unitcury+")");
        if(arrow.getUnitCurX() == Move.getWay().get(arrow.getMoveNext()).
                getPosX() && arrow.getUnitCurY() == Move.getWay().get(
                arrow.getMoveNext()).getPosY()){
            arrow.incrMoveNext();
            if(arrow.getMoveNext() == Move.getWay().size()){
                arrow.setMoveActive(false);
                updateMapItem((int)arrow.getUnitCurX(),
                        (int)arrow.getUnitCurY());
                return;
            }
        }else if(mapScr){
            if(arrow.getUnitCurX() < Move.getWay().get(
                    arrow.getMoveNext()).getPosX()){
                arrow.incrUnitCurX(.25);
            }else if(arrow.getUnitCurX() > Move.getWay().get(
                    arrow.getMoveNext()).getPosX()){
                arrow.incrUnitCurX(-.25);
            }else if(arrow.getUnitCurY() < Move.getWay().get(
                    arrow.getMoveNext()).getPosY()){
                arrow.incrUnitCurY(.25);
            }else if(arrow.getUnitCurY() > Move.getWay().get(
                    arrow.getMoveNext()).getPosY()){
                arrow.incrUnitCurY(-.25);
            }
            mapScr = false;
        }

        if(arrow.getUnitCurX() < Move.getWay().get(
                arrow.getMoveNext()).getPosX()){
            g.drawImage(PixAnimate.getImage(arrow.getUnitItem().unit,
                animTime).getFlippedCopy(true, false),
                (int)(posx+shakex+((arrow.getUnitCurX()*BASE-(BASE/2))*scale)),
                    (int)(posy+shakey+(((arrow.getUnitCurY()-1)
                    *BASE+(BASE/2))*scale)));
        }else if(arrow.getUnitCurX() > Move.getWay().get(
                arrow.getMoveNext()).getPosX()){
            g.drawImage(PixAnimate.getImage(arrow.getUnitItem().unit,
                animTime),(int)(posx+shakex+((arrow.getUnitCurX()*
                BASE-(BASE/2))*scale)), (int)(posy+shakey+(((
                arrow.getUnitCurY()-1)*BASE+(BASE/2))*scale)));
        }else if(arrow.getUnitCurY() < Move.getWay().get(
                arrow.getMoveNext()).getPosY()){
            g.drawImage(PixAnimate.getImage(arrow.getUnitItem().terrain,
                animTime), (int)(posx+shakex+((arrow.getUnitCurX()
                *BASE-(BASE/2))*scale)), (int)(posy+shakey+(((
                arrow.getUnitCurY()-1)*BASE+(BASE/2))*scale)));
        }else if(arrow.getUnitCurY() > Move.getWay().get(
                arrow.getMoveNext()).getPosY()){
            g.drawImage(PixAnimate.getImage(arrow.getUnitItem().blank,
                animTime), (int)(posx+shakex+((arrow.getUnitCurX()
                *BASE-(BASE/2))*scale)), (int)(posy+shakey+(((
                arrow.getUnitCurY()-1)*BASE+(BASE/2))*scale)));
        }
    }

    private void mapControl(int animTime){
        for(int i = 0; i < mapInd; i++){
            if(animTime > (1000/mapInd)*i && animTime < (1000/mapInd)*(i+1)){
                if(mapWatch && animTime > ((1000/mapInd)*
                        (i+1))-(1000/(2*mapInd))){
                    mapScr = true;
                    mapWatch = false;
                }else if(!mapWatch && animTime <= ((1000/mapInd)*(i+1))-
                        (1000/(2*mapInd))){
                    mapScr = true;
                    mapWatch = true;
                }
            }
        }
    }
}