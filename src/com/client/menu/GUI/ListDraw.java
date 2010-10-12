package com.client.menu.GUI;

import com.client.menu.GUI.tools.PixAnimate;
import com.client.menu.GUI.tools.PixVertMenu;
import com.client.menu.logic.Menu;
import com.client.model.Instance;
import com.jslix.tools.ImgLibrary;
import com.jslix.tools.TextImgLibrary;
import java.awt.Image;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 *
 * @author Crecen
 */
public class ListDraw {
    public TextImgLibrary txtlib;
    public PixVertMenu selectBox;
    public PixVertMenu items;
    private int sizex;
    private int sizey;
    private double counter;
    private int space;
    private int maxItem;

    public ListDraw(TextImgLibrary tempAlpha, String arrow, int maxItems,
            int spacing, int locx, int locy, double speed){
        selectBox = new PixVertMenu(locx, locy, spacing, speed);
        items = new PixVertMenu(locx, locy, spacing, speed);
        txtlib = tempAlpha;
        maxItem = maxItems;
        space = spacing;
        init(arrow);
    }

    public void init(String arrowRef){
        txtlib.addImage(arrowRef);
        items.setArrow(txtlib.getSlickImage(arrowRef));
        items.setMaxItems(maxItem);

        for(int i = 0; i < maxItem; i++){
            selectBox.createNewItem(0, space*i, 0);
            selectBox.addBox(i, new Color(Color.darkGray.getRed(),
                Color.darkGray.getGreen(), Color.darkGray.getBlue(),
                200), 250, space, false);
            selectBox.createNewItem(0, space*i, 0);
            selectBox.addMenuImgPart(txtlib.getColorBox(new java.awt.Color(
                    127, 127, 127, 200), 250, space), "", 0);
            selectBox.addMenuImgPart(txtlib.getColorBox(java.awt.Color.white,
                    250, space), "", -1);
            selectBox.addMenuPart(i, true);
            selectBox.createNewItem(0, space*i, 0);
            selectBox.addBorder(i, Color.black, 250, space, false);
        }
    }

    public void update(String[] info, String[] infoTxt, int width, int height){
        items.clearAllVertParts();
        items.clearAllVertParts();
        int player = Instance.getCurPlayer().getID()+1;

        sizex = 250;
        if(maxItem < info.length)
            sizey = space*maxItem;
        else
            sizey = space*info.length;

        selectBox.select = 0;
        items.select = 0;
        for(int i = 0; i < maxItem; i++){
            selectBox.setItemDraw(3*i, (i < info.length));
            selectBox.setItemDraw(3*i+1, (i < info.length));
            selectBox.setItemDraw(3*i+2, (i < info.length));
        }

        for(int i = 0; i < info.length; i++){
            setMenuName(info[i]);
            if(Menu.getType() == Menu.MenuType.PROPERTY_MENU){
                setUnitImage(info[i], infoTxt[i], player);
                items.createNewItem(-10, -5, 0);
                items.addMenuImgPart(txtlib.getImage(info[i]+"_"+player),
                        "", 0.5);
                items.addVertPart(i, false);
                items.createNewItem(30, 15, 0);
                items.addMenuImgPart(txtlib.getImage(info[i]+"_s"), "", 0.5);
                items.addVertPart(i, false);
            }else{
                items.createNewItem(30, 5, 0);
                items.addMenuImgPart(txtlib.getImage(info[i]), "", 0.5);
                items.addVertPart(i, true);
            }   
        }

        setFinalPosition(width, height);
    }

    public int getSizeX(){
        return sizex;
    }

    public int getSizeY(){
        return sizey;
    }

    private void setFinalPosition(int w, int h){
        items.setFinalPosition((int)((w-sizex)/2), (int)((h-sizey)/2));
        selectBox.setFinalPosition((int)((w-sizex)/2), (int)((h-sizey)/2));
    }

    public void mouseScroll(int mx, int my){
        items.mouseScroll(mx, my);      
    }

    public void mouseSelect(int mx, int my){
        if(selectBox.mouseSelect(mx, my))
            items.select = items.getItemMin()+selectBox.select;
        else if(items.mouseSelect(mx, my))
            selectBox.select = items.select-items.getItemMin();
    }

    public void changeSelect(int change){        
        items.select += change;
        selectBox.select = items.select-items.getItemMin();
        if(items.select < 0){
            items.select = items.getMaxSelection();
            selectBox.select = items.getMaxItems();
        }else if(items.select > items.getMaxSelection()){
            items.select = 0;
            selectBox.select = 0;
        }

        if(selectBox.select < 0)
            selectBox.select = 0;
        else if(selectBox.select > items.getMaxSelection())
            selectBox.select = items.getMaxSelection();
        else if(selectBox.select >= items.getMaxItems())
            selectBox.select = items.getMaxItems()-1;
    }

    public void render(Graphics g, int animTime){
        counter = (((double)animTime/1000)-.5);
        if(counter > 1 || counter < -1)
            counter = 1;
        if(counter < 0)
            counter *= -1;
        selectBox.setOpacity(counter);
        selectBox.render(g);
        items.render(g);
    }

    public void setMenuName(String newName){
        if(txtlib.getIndex(newName) < 0){
            ImgLibrary temp = new ImgLibrary();
            temp.addImage(setWordImage(newName, txtlib));
            txtlib.addImage(newName, temp.getImage(0));
            txtlib.setImageSize(temp.getX(0)*3/4, temp.getY(0)*3/4);
            txtlib.addImage(newName+"_s", temp.getImage(0));
        }
    }

    private Image setWordImage(String display, TextImgLibrary tempAlpha){
        tempAlpha.setString(display, "", 0, 0, 0, 0);
        return tempAlpha.getTextImage();
    }

    private void setUnitImage(String name, String group, int player){
        if(txtlib.getIndex(name+"_"+player) < 0){
            ImgLibrary temp = new ImgLibrary();
            PixAnimate.makeNewImage(PixAnimate.getImgPart(group, player, 0));
            temp.setImageSize(40, 40);
            temp.addImage(PixAnimate.getJavaImg(PixAnimate.getImgPart(
                    group, player, 0), 0));
            txtlib.addImage(name+"_"+player, temp.getImage(0));
        }
    }
}
