package com.client.state.mini;

import com.client.input.Controls;
import com.client.menu.GUI.LogoDraw;
import com.client.menu.GUI.MenuDraw;
import com.client.tools.TextImgLibrary;
import org.newdawn.slick.Graphics;

/**
 * MenuMiniScr
 * The reason for the mini states is so I do not have to create a new
 * state for every window I create. This mini state creates a window
 * for the menu screen
 * @author Crecen
 */
public class MenuMiniScr {
    private final int DELAY = 250;
    private final int MAX_ITEMS = 8;
    public boolean scrSwitch;
    public LogoDraw menuLogo;
    public int column;

    public boolean scr_mouseLock;
    public int scr_mouseScroll;
    public int scr_mouseX;
    public int scr_mouseY;
    public boolean scr_scroll;
    public boolean setLock;
    public int scr_scrollIndex;

    private MenuDraw menuScr;
    private int trackSelect;
    private int start;
    private int menucolumn;
    private int counter;
    private String[] info;
    private String arrow;

    public MenuMiniScr(TextImgLibrary txtLib, String[] data,
            String arrowRef, int menu_clmn){
        trackSelect = -1;
        start = menu_clmn;
        menucolumn = -2;
        scr_scrollIndex = 0;
        counter = 0;
        menuScr = new MenuDraw(MAX_ITEMS, 20, 0, 150, 0);
        info = data;
        arrow = arrowRef;
        init(txtLib);
    }

    private void init(TextImgLibrary txtLib){
        String[] temp = new String[info.length];
        for(int i = 0; i < temp.length; i++)
            temp[i] = info[i].split("#")[0];
        String[] tempText = new String[info.length];
        for(int i = 0; i < tempText.length; i++){
            if(info[i].split("#").length > 2)
                tempText[i] = info[i].split("#")[2];
            else
                tempText[i] = "";
        }
        menuScr.init(temp, tempText, arrow, txtLib);
    }

    public void update(){
        setLock = false;
        if(scrSwitch){
            menuLogo.setText(2, " - ");
            menuLogo.setFinalPosition(0, 145, 0);
            //menuLogo.setFinalPosition(1, 0, 0);
            menuLogo.setFinalPosition(2, 0, 460);
            scrSwitch = false;
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
            menuScr.menu.select = info.length-1;
        else if(menuScr.menu.select >= info.length)
            menuScr.menu.select = 0;

        if(menucolumn == -2){
            menucolumn = start;
            changeJustify();
        }

        if(Controls.isLeftClicked()){
            if(menucolumn < 1) menucolumn++;
            changeJustify();
        }
        if(Controls.isRightClicked()){
            if(menucolumn > -1) menucolumn--;
            changeJustify();
        }

        if(trackSelect != menuScr.menu.select){
            menuLogo.setText(2, menuScr.getText(menuScr.menu.select));
            trackSelect = menuScr.menu.select;
        }

        if(Controls.isActionClicked()){
            column = Integer.parseInt(info[menuScr.menu.select].split("#")[1]);
            trackSelect = -1;
            scrSwitch = true;
        }

        if(Controls.isCancelClicked()){
            column = 0;
            trackSelect = -1;
            scrSwitch = true;
        }
    }
    public void render(Graphics g){
        menuScr.menu.render(g);
    }

    private void changeJustify(){
        if(menucolumn == -1)        menuScr.menu.setJustify(5, 'L');
        else if(menucolumn == 0)    menuScr.menu.setJustify(320, 'C');
        else if(menucolumn == 1)    menuScr.menu.setJustify(635, 'R');
    }
}
