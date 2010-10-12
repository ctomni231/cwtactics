package com.client.menu.GUI;

import com.client.menu.GUI.tools.PixAnimate;
import com.client.menu.GUI.tools.PixMenu;
import com.client.model.Instance;
import com.client.model.Move;
import com.client.model.object.Game;
import com.client.model.object.Map;
import com.client.model.object.Tile;
import com.jslix.tools.ImgLibrary;
import com.system.data.ImgData;
import com.system.log.Logger;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 *
 * @author Crecen
 */
public class MapArrow {
    private int BASE;
    private double scale;

    private PixMenu cursor;
    private int realcurx;
    private int realcury;
    private int cursorx;
    private int cursory;
    private int checkcurx;
    private int checkcury;
    private double posx;
    private double posy;
    private double checkposx;
    private double checkposy;
    private int shakex;
    private int shakey;
    private boolean moveActive;
    private int moveNext;
    private double unitcurx;
    private double unitcury;
    private MapItem unitTemp;
    private Map map;

    private MapItem[] drawArrow;


    public MapArrow(Map theMap, int base){
        BASE = base;
        map = theMap;
        scale = 1.0;
        realcurx = 0;
        realcury = 0;
        cursorx = 0;
        cursory = 0;
        checkcurx = 0;
        checkcury = 0;
        posx = 0;
        posy = 0;
        checkposx = 0;
        checkposy = 0;
        shakex = 0;
        shakey = 0;
        unitTemp = new MapItem();
        unitcurx = 0;
        unitcury = 0;
        moveActive = false;
        drawArrow = new MapItem[10];
    }

    public void setScale(double newScale){
        scale = newScale;
    }
    public void setCurPosition(int x, int y){
        cursorx = x;
        cursory = y;
    }
    public void setPosition(double x, double y){
        posx = x;
        posy = y;
    }

    public boolean checkPosition(){
        return (posx == checkposx && posy == checkposy);
    }

    public boolean checkCursor(){
        return (cursorx == checkcurx && cursory == checkcury);
    }

    public void updateCheck(){
        if(!checkPosition()){
            checkposx = posx;
            checkposy = posy;
        }
        if(!checkCursor()){
            checkcurx = cursorx;
            checkcury = cursory;
        }
    }
    public void setShake(int sx, int sy){
        shakex = sx;
        shakey = sy;
    }

    public void setMoveNext(int next){
        moveNext = next;
    }

    public void setMoveActive(boolean active){
        moveActive = active;
    }

    public void incrMoveNext(){
        moveNext++;
    }

    public void incrUnitCurX(double inc){
        unitcurx += inc;
    }

    public void incrUnitCurY(double inc){
        unitcury += inc;
    }

    public int getRealX(){
        return realcurx;
    }

    public int getRealY(){
        return realcury;
    }

    public int getMoveNext(){
        return moveNext;
    }

    public double getUnitCurX(){
        return unitcurx;
    }

    public double getUnitCurY(){
        return unitcury;
    }

    public MapItem getUnitItem(){
        return unitTemp;
    }

    public void skipAnimation(){
        moveActive = false;
    }

    public void initCursor(){
        cursor = new PixMenu((int)posx+cursorx, (int)posy+cursory, 0);
        for(ImgData item: PixAnimate.getData()){
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

                realcurx = (int)(posx*BASE*scale);
                realcury = (int)(posy*BASE*scale);

                cursor.setFinalPosition(
                        realcurx-(int)(temp.getX(0)/2),
                        realcury-(int)(temp.getY(0)/2));
                break;
            }
        }
    }

    public void drawCursor(int animTime){
        if(cursor == null){
            initCursor();
        }
      //  if(1==1) return;
        realcurx = (int)(posx+shakex+cursorx*BASE*scale);
        realcury = (int)(posy+shakey+cursory*BASE*scale);
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

    public void render(Graphics g){
        cursor.render(g);
    }

    public void startMoveAnimation(){
        if(Move.getUnit() == null){ Logger.warn("Unit is missing!"); return; }
        moveActive = true;
        moveNext = 0;
        unitcurx = Move.getStartTile().getPosX();
        unitcury = Move.getStartTile().getPosY();
        int color = 0;
        color = Move.getUnit().getOwner().getID()+1;
        unitTemp.blank = PixAnimate.getImgPart(Move.getUnit().
                sheet().getID(), color, 1);
        if(unitTemp.blank == null)
            unitTemp.blank = PixAnimate.getImgPart(Move.getUnit().
                sheet().getID(), color, 0);
        PixAnimate.makeNewImage(unitTemp.blank);
        unitTemp.terrain = PixAnimate.getImgPart(Move.getUnit().
                sheet().getID(), color, 2);
        if(unitTemp.terrain == null)
            unitTemp.terrain = PixAnimate.getImgPart(Move.getUnit().
                sheet().getID(), color, 0);
        PixAnimate.makeNewImage(unitTemp.terrain);
        unitTemp.unit = PixAnimate.getImgPart(Move.getUnit().
                sheet().getID(), color, 3);
        PixAnimate.makeNewImage(unitTemp.unit);
        if(unitTemp.unit == null)
            unitTemp.unit = PixAnimate.getImgPart(Move.getUnit().
                sheet().getID(), color, 0);
    }

    public boolean getMoveActive(){
        return moveActive;
    }

    public void updateArrow(Graphics g, int x, int y){
        if(Move.inWay(map.getTile(x, y))){
            Tile temp = map.getTile(x, y);
            g.setColor(new Color(0, 0, 0, 100));
            g.fillRect((int)(posx+shakex+x*BASE*scale),
                (int)(posy+shakey+y*BASE*scale), (int)(BASE*scale),
                (int)(BASE*scale));
            int tpos = Move.getWay().indexOf(temp);
            int tdir = 0;
            if(tpos == 0)
                return;
            else if(tpos+1 == Move.getWay().size()){
                if(Move.getWay().get(tpos-1).getPosX() < temp.getPosX())
                    tdir = 2;
                else if(Move.getWay().get(tpos-1).getPosX() > temp.getPosX())
                    tdir = 3;
                else if(Move.getWay().get(tpos-1).getPosY() < temp.getPosY())
                    tdir = 1;
                else if(Move.getWay().get(tpos-1).getPosY() > temp.getPosY())
                    tdir = 0;
            }else{
                if(Move.getWay().get(tpos-1).getPosX() < temp.getPosX()){
                    if(Move.getWay().get(tpos+1).getPosX() > temp.getPosX())
                        tdir = 5;
                    else if(Move.getWay().get(tpos+1).getPosY() <
                            temp.getPosY())
                        tdir = 6;
                    else if(Move.getWay().get(tpos+1).getPosY() >
                            temp.getPosY())
                        tdir = 8;
                }else if(Move.getWay().get(tpos-1).getPosX() > temp.getPosX()){
                    if(Move.getWay().get(tpos+1).getPosX() < temp.getPosX())
                        tdir = 5;
                    else if(Move.getWay().get(tpos+1).getPosY() <
                            temp.getPosY())
                        tdir = 7;
                    else if(Move.getWay().get(tpos+1).getPosY() >
                            temp.getPosY())
                        tdir = 9;
                }else if(Move.getWay().get(tpos-1).getPosY() < temp.getPosY()){
                    if(Move.getWay().get(tpos+1).getPosY() > temp.getPosY())
                        tdir = 4;
                    else if(Move.getWay().get(tpos+1).getPosX() <
                            temp.getPosX())
                        tdir = 6;
                    else if(Move.getWay().get(tpos+1).getPosX() >
                            temp.getPosX())
                        tdir = 7;
                }else if(Move.getWay().get(tpos-1).getPosY() > temp.getPosY()){
                    if(Move.getWay().get(tpos+1).getPosY() < temp.getPosY())
                        tdir = 4;
                    else if(Move.getWay().get(tpos+1).getPosX() <
                            temp.getPosX())
                        tdir = 8;
                    else if(Move.getWay().get(tpos+1).getPosX() >
                            temp.getPosX())
                        tdir = 9;
                }
            }
            g.drawImage(PixAnimate.getImage(getArrow(tdir).blank, 0),
                (int)(posx+shakex+(x*BASE*scale)),
                (int)(posy+shakey+(y*BASE*scale)));
        }

    }

    private MapItem getArrow(int dir){
        drawArrow[dir] = new MapItem();
        int color = 0;
        if(Game.getPlayers() != null)
            color = Instance.getCurPlayer().getID()+1;

        drawArrow[dir].blank = PixAnimate.
                getImgPart("PRAXARROW", color, dir);
        PixAnimate.makeNewImage(drawArrow[dir].blank);
        return drawArrow[dir];
    }
}
