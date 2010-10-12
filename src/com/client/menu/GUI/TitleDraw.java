package com.client.menu.GUI;

import com.jslix.tools.TextImgLibrary;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.Image;

/**
 * Draws Title Screen elements
 * @author Crecen
 */
public class TitleDraw {
    private Image titleImg;
    private double counter;

    public TitleDraw(){
        counter = 0;
    }

    public void setWords(String display, TextImgLibrary tempAlpha){
        tempAlpha.setString(display, "", 0, 0, 0, 0);
        titleImg = tempAlpha.getSlickTextImage(display);
    }

    public void setImageSize(int sizex, int sizey){
        if(titleImg != null)
            titleImg = titleImg.getScaledCopy(sizex, sizey);
    }

    public Image getImage(){
        return titleImg;
    }

    public void render(Graphics g, int animTime, int locx, int locy){
        if(titleImg != null){
            counter = (((double)animTime/1000)-.5);
            if(counter > 1 || counter < -1)
                counter = 1;
            if(counter < 0)
                counter *= -1;
            titleImg.setAlpha((float)counter);
            g.drawImage(titleImg, locx, locy);
        }
    }
}
