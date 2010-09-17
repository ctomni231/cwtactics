package com.client.graphic.tools;

import com.jslix.state.ScreenSkeleton;
import com.jslix.tools.TextImgLibrary;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.ArrayList;
import org.newdawn.slick.Graphics;

/**
 * LogoLibrary
 * 
 * A remix of LogoDraw, this class organizes all elements of MovingImage
 * and classes that extend MovingImage. It then can draw them to the
 * screen in order.
 *
 * @author Crecen
 */
public class LogoLibrary implements ScreenSkeleton {
    
    private ArrayList<MovingImage> logoItems;
    
    public LogoLibrary(){
        logoItems = new ArrayList<MovingImage>();
    }
    
    public void addMovingImg(MovingImage newLogo){
        if(newLogo != null)
            logoItems.add(newLogo);
    }

    public void addPictureLogo(String imgref, int locx, int locy,
            int sizex, int sizey, int speed){
        MovingImage tempLogo = new MovingImage(locx, locy, speed);
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

        MovingImage tempLogo = new MovingImage(locx, locy, speed);
        if(sizex*sizey > 0)
            tempLogo.setImage(tempAlpha.getTextImage(), sizex, sizey);
        logoItems.add(tempLogo);
    }

    public void addFontLogo(String display, int locx, int locy,
            int speed){
        MovingImage tempLogo = new MovingImage(locx, locy, speed);
        tempLogo.setText(display);
        logoItems.add(tempLogo);
    }

    public void addScrollFontLogo(String display, int locx, int locy,
            int sizex, int sizey, int moveSpeed, double scrollSpeed){
        ScrollText tempLogo = new ScrollText(locx, locy,
                sizex, sizey, moveSpeed);
        tempLogo.setScrollSpeed(scrollSpeed);
        tempLogo.setText(display);
        logoItems.add(tempLogo);
    }

    public void setFinalPosition(int index, int locx, int locy){
        if(index >= 0 && index < logoItems.size()){
            MovingImage tempLogo = logoItems.get(index);
            tempLogo.setFinalPosition(locx, locy);
            logoItems.set(index, tempLogo);
        }
    }

    public void setOrigScreenSize(int index, int sizex, int sizey){
        if(index >= 0 && index < logoItems.size()){
            MovingImage tempLogo = logoItems.get(index);
            tempLogo.setOrigScreen(sizex, sizey);
            logoItems.set(index, tempLogo);
        }
    }

    public void setShadowOffset(int index, int offset){
        if(index >= 0 && index < logoItems.size()){
            MovingImage tempLogo = logoItems.get(index);
            tempLogo.setShadowOffset(offset);
            logoItems.set(index, tempLogo);
        }
    }

    public void setShadowColor(int index, Color theColor){
        if(index >= 0 && index < logoItems.size()){
            MovingImage tempLogo = logoItems.get(index);
            tempLogo.setShadowColor(theColor);
            logoItems.set(index, tempLogo);
        }
    }

    public void setText(int index, String display){
        if(index >= 0 && index < logoItems.size()){
            MovingImage tempLogo = logoItems.get(index);
            tempLogo.clearText();
            tempLogo.setText(display);
            logoItems.set(index, tempLogo);
        }
    }

    public void render(Graphics g){
        for(MovingImage tempLogo: logoItems)
            tempLogo.render(g);
    }

    public void render(Graphics2D g, Component dthis) {
        for(MovingImage tempLogo: logoItems)
            tempLogo.render(g, dthis);
    }

    public void init() {}

    public void update(int timePassed) {}

    public void update(int width, int height, int sysTime, int mouseScroll){
        for(MovingImage tempLogo: logoItems)
            tempLogo.update(width, height, sysTime, mouseScroll);
    }

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}

}
