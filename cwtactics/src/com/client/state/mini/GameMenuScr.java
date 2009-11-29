package com.client.state.mini;

import com.client.logic.input.Controls;
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

    private MenuDraw menuScr;
    private int counter;
    private String[] info;
    private String arrow;
    private int scrX;
    private int scrY;
    private int menuSize;

    public GameMenuScr(TextImgLibrary txtLib, String[] data, String arrowRef,
            int width, int height){
        scr_scrollIndex = 0;
        counter = 0;
        info = data;
        arrow = arrowRef;
        scrX = width;
        scrY = height;
        init(txtLib, scrX, scrY, new String[0]);
    }

    private void init(TextImgLibrary txtLib, int width, int height,
            String[] menuItems){
        menuScr = new MenuDraw(MAX_ITEMS, 20, 0, 0, 0);
        menuScr.setIndex(1); //Makes menu draw differently
        String[] temp = new String[0];
        if(menuItems.length > 0){
            temp = new String[(info.length+menuItems.length)];
            for(int i = 0; i < info.length; i++)
                temp[i] = info[i].split("#")[0];
            for(int i = 0; i < menuItems.length; i++)
                temp[(i+info.length)] = menuItems[i];
        }else{
            temp = new String[info.length];
            for(int i = 0; i < temp.length; i++)
                temp[i] = info[i].split("#")[0];
        }
        menuSize = temp.length;
        menuScr.init(temp, new String[0], arrow, txtLib);
        menuScr.menu.setFinalPosition((int)((width-menuScr.getSizeX())/2),
                (int)((height-menuScr.getSizeY())/2));
    }

    public void update(TextImgLibrary txtLib){
    	
        setLock = false;
        
        if(scrSwitch){
        	//TODO refactor init method, it needs tooo much time to prepare new menu :(
        	// logic is thousands times faster than the menu draw logic
        	
            long time = System.currentTimeMillis();
        	if(Menu.getList().size() > 0){
                String[] temp = new String[Menu.getList().size()];
                for(int i = 0; i < temp.length; i++)
                    temp[i] = Menu.getList().get(i).getSheet().getName().toUpperCase();
                init(txtLib, scrX, scrY, temp);
            }
            scrSwitch = false;
            System.out.println("TIME NEEDED TO BUILD MENU :: "+(System.currentTimeMillis() - time)+" ms");
        }
        
        
        scr_scrollIndex = 10;
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

        if(Controls.isActionClicked()){
            if(menuScr.menu.select >= info.length){
                Menu.setPointer(menuScr.menu.select-info.length);
                column = 0;
            }else if(info[menuScr.menu.select].split("#").length > 1)
                column = Integer.parseInt(info[
                        menuScr.menu.select].split("#")[1]);
            else
                column = 0;
            scrSwitch = true;
        }

        if(Controls.isCancelClicked()){
            column = 0;
            scrSwitch = true;
        }
    }

    public void render(Graphics g){
        menuScr.menu.render(g);
    }
}
