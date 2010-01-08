package com.client.state.mini;

import com.client.logic.input.Controls;
import com.client.logic.status.Status;
import com.client.menu.GUI.MapDraw;
import com.client.menu.GUI.MenuDraw;
import com.client.menu.logic.Menu;
import com.client.tools.TextImgLibrary;
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

    public boolean scr_mouseLock;
    public int scr_mouseScroll;
    public int scr_mouseX;
    public int scr_mouseY;
    public boolean scr_scroll;
    public boolean setLock;
    public int scr_scrollIndex;
    public MapDraw mapScr;

    private MenuDraw menuScr;
    private int counter;
    private String[] info;
    private String arrow;
    private int scrX;
    private int scrY;
    private int menuSize;

    //Okay, make a status menu screen. This will just generate a menu.
    public GameMenuScr(TextImgLibrary txtLib, String arrowRef,
            int width, int height){
        scr_scrollIndex = 0;
        counter = 0;
        arrow = arrowRef;
        scrX = width;
        scrY = height;
        init(txtLib, scrX, scrY, new String[0]);
    }

    private void init(TextImgLibrary txtLib, int width, int height,
            String[] menuItems){
        menuScr = new MenuDraw(MAX_ITEMS, 20, 0, 0, 0);
        menuScr.setIndex(1); //Makes menu draw differently
        info = menuItems;
        menuScr.init(info, new String[0], arrow, txtLib);
        menuScr.menu.setFinalPosition((int)((width-menuScr.getSizeX())/2),
                (int)((height-menuScr.getSizeY())/2));
    }

    public void update(TextImgLibrary txtLib, int timePassed){
        setLock = false;
        if(scrSwitch){
        	//TODO refactor init method, it needs tooo much time to prepare new menu :(
        	// logic is thousands times faster than the menu draw logic
        	
            long time = System.currentTimeMillis();
        	if(menuSize > 0){
                mapScr.skipAnimation();
                info = new String[Menu.getList().size()];
                for(int i = 0; i < info.length; i++)
                    info[i] = Menu.getList().get(i).getSheet().
                            getName().toUpperCase();
                init(txtLib, scrX, scrY, info);
                //menuScr.update(info, txtLib);
            }
            scrSwitch = false;
            System.out.println("TIME NEEDED TO BUILD MENU :: "+(System.currentTimeMillis() - time)+" ms");
        }

        scr_scrollIndex = 10;
        if(menuSize > 0){
            
            if(!scr_mouseLock){
                scr_scrollIndex = 2;
                menuScr.menu.mouseSelect(scr_mouseX, scr_mouseY);
                if(scr_scroll){
                    menuScr.menu.mouseScroll(scr_mouseX, scr_mouseY);
                    scr_scroll = false;
                }
            }

            if(scr_mouseScroll != 0){
                setLock = true;
                menuScr.menu.select += scr_mouseScroll;
            }

            if(Controls.isUpDown())
                counter++;
            else if(Controls.isDownDown())
                counter--;
            else
                counter = 0;

            if(Controls.isUpClicked() ||
                    (counter > DELAY && scr_scroll)){
                menuScr.menu.select--;
                scr_scroll = false;
            }
            if(Controls.isDownClicked() ||
                    (counter < -DELAY && scr_scroll)){
                menuScr.menu.select++;
                scr_scroll = false;
            }

            if(menuScr.menu.select < 0)
                menuScr.menu.select = menuSize-1;
            else if(menuScr.menu.select >= menuSize)
                menuScr.menu.select = 0;

            Menu.setPointer(menuScr.menu.select);
            if(Controls.isActionDown() || Controls.isCancelDown())
                menuSize = 0;
        }else{
            scr_scroll = mapScr.update(scr_mouseX, scr_mouseY,
                    scr_mouseScroll, scr_scroll, scr_mouseLock);
            Status.update(timePassed, mapScr);

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
            menuScr.menu.render(g);
    }

    public int getMenuSize(){
        return menuSize;
    }
}
