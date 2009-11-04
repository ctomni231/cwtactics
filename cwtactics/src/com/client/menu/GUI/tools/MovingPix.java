package com.client.menu.GUI.tools;

import com.client.tools.ImgLibrary;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.Image;

/**
 * This class helps pictures move across the screen smoothly
 * A speed of zero teleports pictures to the next location.
 * @author Crecen
 */
public class MovingPix {
    protected double posx;
    protected double posy;
    protected double fposx;
    protected double fposy;
    protected double speed;
    protected int shadeOff;
    protected Color shadow;

    protected Image logoPic;
    protected String logoTxt;

    public MovingPix(int locx, int locy, double speed){
        posx = locx;
        fposx = locx;
        posy = locy;
        fposy = locy;
        this.speed = speed;
        shadeOff = 0;
        shadow = Color.black;
        logoPic = null;
        logoTxt = "";
    }

    public void setImage(String imgRef){
        setImage(imgRef, 0, 0);
    }
    public void setImage(String imgRef, int sizex, int sizey){
        ImgLibrary logoImg = new ImgLibrary();
        if(sizex*sizey > 0)
            logoImg.setImageSize(sizex, sizey);
        logoImg.addImage(imgRef);
        logoPic = logoImg.getSlickImage(imgRef);
    }

    public void setImage(java.awt.Image awtImage, int sizex, int sizey){
        ImgLibrary logoImg = new ImgLibrary();
        if(sizex*sizey > 0)
            logoImg.setImageSize(sizex, sizey);
        logoImg.addImage(awtImage);
        logoPic = logoImg.getSlickImage(0);
    }

    public void setShadowOffset(int offset){
        shadeOff = offset;
    }

    public void setShadowColor(Color theColor){
        if(theColor != null)
            shadow = theColor;
    }

    public void setText(String display){
        logoTxt = display;
    }

    public void setPosition(int x, int y){
        posx = x;
        posy = y;
    }

    public void setFinalPosition(int x, int y){
        fposx = x;
        fposy = y;
    }

    public void clearText(){
        logoTxt = "";
    }

    public void setSpeed(double thisSpeed){
        if(thisSpeed < 0)
            thisSpeed *= -1;
        speed = thisSpeed;
    }

    protected void renderSpeed(){
        if(posx == fposx && posy == fposy);
        else if(speed == 0){
            posx = fposx;
            posy = fposy;
        }else{
            if(posx < fposx)
                posx += speed;
            else if(posx > fposx)
                posx -= speed;
            if(posy < fposy)
                posy += speed;
            else if(posy > fposy)
                posy -= speed;
        }
    }
    
    public void render(Graphics g){
        renderSpeed();
        if(logoPic != null){
            if(shadeOff != 0)
                g.drawImage(logoPic, (int)posx+shadeOff, (int)posy+shadeOff,
                    shadow);
            g.drawImage(logoPic, (int)posx, (int)posy);
            
        }
        if(!logoTxt.matches(""))
            g.drawString(logoTxt, (int)posx, (int)posy);
    }
}
