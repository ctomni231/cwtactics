package com.client.state.mini;

import com.system.input.Controls;
import com.cwt.service.StatusController;
import com.client.menu.GUI.ListDraw;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.cwt.system.jslix.tools.TextImgLibrary;
import org.newdawn.slick.Graphics;

/**
 * This mini state deals with creating a menu for the game screen.
 * @author Crecen
 */
public class GameMenuScr {
	
    private final int DELAY = 250;
    private final int MAX_ITEMS = 8;
    public boolean scrSwitch;
    public int column;

    public int scr_sysTime;
    public boolean scr_mouseLock;
    public int scr_mouseScroll;
    public int scr_mouseX;
    public int scr_mouseY;
    public boolean scr_scroll;
    public boolean setLock;
    public int scr_scrollIndex;
    public MapDraw mapScr;

    private ListDraw listScr;
    private int counter;
    private String[] info;
    private String[] infoTxt;
    private int scrX;
    private int scrY;
    private int menuSize;

    //Okay, make a status menu screen. This will just generate a menu.
    public GameMenuScr(TextImgLibrary txtLib, String arrowRef,
            int width, int height){
        scr_scrollIndex = 0;
        counter = 0;
        scrX = width;
        scrY = height;
        listScr = new ListDraw(txtLib, arrowRef, MAX_ITEMS, 30, 30, 30, 0);
    }

    public void update(TextImgLibrary txtLib, int timePassed){
        setLock = false;
        if(scrSwitch){
        	//TODO refactor init method, it needs tooo much time to prepare
            //new menu :(
        	// logic is thousands times faster than the menu draw logic
        	
            long time = System.currentTimeMillis();
        	if(menuSize > 0){
                mapScr.skipAnimation();
                info = new String[Menu.getList().size()];
                infoTxt = new String[Menu.getList().size()];
                for(int i = 0; i < info.length; i++){
                    info[i] = Menu.getList().get(i).getSheet().
                            getName().toUpperCase();
                    infoTxt[i] = Menu.getList().get(i).getSheet()
                            .getID().toUpperCase();
                }
                listScr.update(info, infoTxt, scrX, scrY);
                mapScr.addBox(1, (scrX-listScr.getSizeX())/2,
                        (scrY-listScr.getSizeY())/2,
                        listScr.getSizeX(), listScr.getSizeY());
            }
            scrSwitch = false;
            System.out.println("TIME NEEDED TO BUILD MENU :: "+
                    (System.currentTimeMillis() - time)+" ms");
        }

        scr_scrollIndex = 10;
        if(menuSize > 0){
            //mapScr.drawAllTiles();
            if(!scr_mouseLock){
                scr_scrollIndex = 2;
                listScr.mouseSelect(scr_mouseX, scr_mouseY);
                if(scr_scroll){
                    listScr.mouseScroll(scr_mouseX, scr_mouseY);
                    scr_scroll = false;
                }
            }

            if(scr_mouseScroll != 0){
                setLock = true;
                listScr.changeSelect(scr_mouseScroll);
            }

            if(Controls.isUpDown())
                counter++;
            else if(Controls.isDownDown())
                counter--;
            else
                counter = 0;

            if(Controls.isUpClicked() ||
                    (counter > DELAY && scr_scroll)){
                listScr.changeSelect(-1);
                scr_scroll = false;
            }
            if(Controls.isDownClicked() ||
                    (counter < -DELAY && scr_scroll)){
                listScr.changeSelect(1);
                scr_scroll = false;
            }

            Menu.setPointer(listScr.items.select);
            if(Controls.isActionDown() || Controls.isCancelDown()){
                menuSize = 0;
                mapScr.removeBox(1);
            }
        }else{
            scr_scroll = mapScr.update(scr_mouseX, scr_mouseY,
                    scr_mouseScroll, scr_scroll, scr_mouseLock);
            StatusController.update(timePassed, mapScr);

            if(menuSize == 0 && Menu.getList().size() > 0){
                scrSwitch = true;
                menuSize = Menu.getList().size();
            }
        }
        
        mapScr.update();

        if(mapScr.getColumn() != 0){
            column = mapScr.getColumn();
            mapScr.setColumn(0);
        }
        
    }

    public void render(Graphics g){
        if(menuSize > 0)
            listScr.render(g, scr_sysTime);
    }

    public int getMenuSize(){
        return menuSize;
    }
}
