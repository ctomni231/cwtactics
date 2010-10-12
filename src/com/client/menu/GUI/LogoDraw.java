package com.client.menu.GUI;

import com.client.menu.GUI.tools.MovingPix;
import com.client.menu.GUI.tools.ScrollPix;
import com.jslix.tools.TextImgLibrary;
import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * This class can store logos and anything that extends the
 * MovingLogo class. It then draws these items in order to
 * the screen.
 *
 * @author Crecen
 */
public class LogoDraw {
    private ArrayList<MovingPix> logoItems;

    public LogoDraw(){
        logoItems = new ArrayList<MovingPix>();
    }

    public void addMovingPix(MovingPix newLogo){
        if(newLogo != null)
            logoItems.add(newLogo);
    }

    public void addPictureLogo(String imgref, int locx, int locy,
            int sizex, int sizey, int speed){
        MovingPix tempLogo = new MovingPix(locx, locy, speed);
        tempLogo.setImage(imgref, sizex, sizey);
        logoItems.add(tempLogo);
    }

    public void addPictureTextLogo(String alphaRef, String display,
            int locx, int locy, int sizex, int sizey, int speed){
        TextImgLibrary tempAlpha = new TextImgLibrary();
        tempAlpha.addImage(alphaRef);
        tempAlpha.addAllCapitalLetters(tempAlpha.getImage(0), "", 6, 5, 0);
        tempAlpha.addLetter('-', tempAlpha.getImage(0), "", 6, 5, 29);
        tempAlpha.addLetter('\'', tempAlpha.getImage(0), "", 6, 5, 28);
        tempAlpha.addLetter(',', tempAlpha.getImage(0), "", 6, 5, 27);
        tempAlpha.addLetter('.', tempAlpha.getImage(0), "", 6, 5, 26);
        tempAlpha.setString(display, "", 0, 0, 0, 0);

        MovingPix tempLogo = new MovingPix(locx, locy, speed);
        if(sizex*sizey > 0)
            tempLogo.setImage(tempAlpha.getTextImage(), sizex, sizey);
        logoItems.add(tempLogo);
    }

    public void addFontLogo(String display, int locx, int locy,
            int speed){
        MovingPix tempLogo = new MovingPix(locx, locy, speed);
        tempLogo.setText(display);
        logoItems.add(tempLogo);
    }

    public void addScrollFontLogo(String display, int locx, int locy,
            int sizex, int sizey, int moveSpeed, double scrollSpeed){
        ScrollPix tempLogo = new ScrollPix(locx, locy,
                sizex, sizey, moveSpeed);
        tempLogo.setScrollSpeed(scrollSpeed);
        tempLogo.setText(display);
        logoItems.add(tempLogo);
    }

    public void setFinalPosition(int index, int locx, int locy){
        if(index >= 0 && index < logoItems.size()){
            MovingPix tempLogo = logoItems.get(index);
            tempLogo.setFinalPosition(locx, locy);
            logoItems.set(index, tempLogo);
        }
    }

    public void setShadowOffset(int index, int offset){
        if(index >= 0 && index < logoItems.size()){
            MovingPix tempLogo = logoItems.get(index);
            tempLogo.setShadowOffset(offset);
            logoItems.set(index, tempLogo);
        }
    }

    public void setShadowColor(int index, Color theColor){
        if(index >= 0 && index < logoItems.size()){
            MovingPix tempLogo = logoItems.get(index);
            tempLogo.setShadowColor(theColor);
            logoItems.set(index, tempLogo);
        }
    }

    public void setText(int index, String display){
        if(index >= 0 && index < logoItems.size()){
            MovingPix tempLogo = logoItems.get(index);
            tempLogo.clearText();
            tempLogo.setText(display);
            logoItems.set(index, tempLogo);
        }
    }

    public void render(Graphics g){
        for(MovingPix tempLogo: logoItems)
            tempLogo.render(g);
    }
}
