package com.client.menu.GUI;

import com.client.menu.GUI.tools.PixVertMenu;
import com.client.tools.ImgLibrary;
import com.client.tools.TextImgLibrary;
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
    private double counter;

    public ListDraw(TextImgLibrary tempAlpha, int maxItems, int spacing,
            int locx, int locy, double speed){
        selectBox = new PixVertMenu(locx, locy, spacing, speed);
        items = new PixVertMenu(locx, locy, spacing, speed);
        txtlib = tempAlpha;
        init(maxItems, spacing);
    }

    public void init(int maxItems, int spacing){
        for(int i = 0; i < maxItems; i++){
            selectBox.createNewItem(0, spacing*i, 0);
            selectBox.addBox(i, new Color(Color.darkGray.getRed(),
                Color.darkGray.getGreen(), Color.darkGray.getBlue(),
                200), 200, spacing, false);
            selectBox.createNewItem(0, spacing*i, 0);
            selectBox.addBorder(i, Color.black, 200, 20, false);
            selectBox.createNewItem(0, spacing*i, 0);
            selectBox.addMenuImgPart(txtlib.getColorBox(new java.awt.Color(
                    127, 127, 127, 200), 200, spacing), "", 0);
            selectBox.addMenuImgPart(txtlib.getColorBox(java.awt.Color.white,
                    200, spacing), "", -1);
            selectBox.addMenuPart(i, true);
        }
    }

    public void mouseScroll(int mx, int my){
        selectBox.mouseScroll(mx, my);
    }

    public void mouseSelect(int mx, int my){
        selectBox.mouseSelect(mx, my);
    }

    public void render(Graphics g, int animTime){
        counter = (((double)animTime/1000)-.5);
        if(counter > 1 || counter < -1)
            counter = 1;
        if(counter < 0)
            counter *= -1;
        selectBox.setOpacity(counter);
        selectBox.render(g);
    }

}
