package com.client.graphic.tools;

import com.jslix.state.ScreenSkeleton;
import com.jslix.tools.ImgLibrary;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.Image;
import org.newdawn.slick.Graphics;

/**
 * MovingImage
 * 
 * A simple remix of MovingPix, it moves images around the Canvas in a
 * smooth motion.
 *
 * @author Crecen
 */
public class MovingImage implements ScreenSkeleton{

    protected double scalex;
    protected double scaley;
    private int origx;
    private int origy;
    private int cursx;
    private int cursy;

    protected double posx;
    protected double posy;
    protected double fposx;
    protected double fposy;
    protected double speed;
    protected int shadeOff;
    protected Color shadow;
    protected double opacity;

    protected ImgLibrary imgRef;
    protected String logoTxt;

    public MovingImage(int locx, int locy, double speed){
        posx = locx;
        fposx = locx;
        posy = locy;
        fposy = locy;
        this.speed = speed;
        shadeOff = 0;
        imgRef = new ImgLibrary();
        logoTxt = "";
        opacity = 1.0;
        scalex = 1;
        scaley = 1;
        origx = -1;
        origy = -1;
    }

    /**
     * This allows you to position and stretch an image to a set
     * screen size
     * @param scrsx Emulated screen width
     * @param scrsy Emulated screen height
     */
    public void setOrigScreen(int scrX, int scrY){
        origx = scrX;
        origy = scrY;
    }

    public void setOpacity(double opacity){
        if(opacity >= 0 && opacity <= 1)
            this.opacity = opacity;
    }

    public void setImage(String imgPath){
        setImage(imgPath, 0, 0);
    }

    public void setImage(Image img){
        setImage(img, 0, 0);
    }

    public void setImage(String imgPath, int sizex, int sizey){
        if(sizex*sizey > 0)
            imgRef.setImageSize(sizex, sizey);
        imgRef.addImage(0, imgPath);
        cursx = 0;
    }

    public void setImage(Image img, int sizex, int sizey){
        if(sizex*sizey > 0)
            imgRef.setImageSize(sizex, sizey);
        imgRef.addImage(0, img);
        cursx = 0;
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

    public void update(int width, int height, int sysTime, int mouseScroll) {
        renderSpeed();
        if(cursx != width || cursy != height){
            cursx = width;
            cursy = height;
            if(origx <= 0)  origx = width;
            if(origy <= 0)  origy = height;
            scalex = (double)cursx/origx;
            scaley = (double)cursy/origy;
            imgRef.setImageSize((int)((double)imgRef.getX(0)*scalex),
                    (int)((double)imgRef.getY(0)*scaley));
            imgRef.addImage(1, imgRef.getImage(0));
            if(shadow != null){
                imgRef.setPixelBlend(shadow);
                imgRef.addImage(2, imgRef.getImage(1));
            }
        }
    }

    public void render(Graphics g) {
        if(imgRef.length() > 1){
            if(shadeOff != 0 && shadow != null)
                if(opacity < 1){
                    imgRef.getSlickImage(1).setAlpha((float)opacity);
                    imgRef.getSlickImage(2).setAlpha((float)opacity);
                }
                g.drawImage(imgRef.getSlickImage(2),
                        (int)((posx+shadeOff)*scalex),
                        (int)((posy+shadeOff)*scaley));
            if(shadeOff == 0 && shadow != null)
                g.drawImage(imgRef.getSlickImage(2),
                        (int)(posx*scalex), (int)(posy*scaley));
            else
                g.drawImage(imgRef.getSlickImage(1),
                        (int)(posx*scalex), (int)(posy*scaley));

        }else if(!logoTxt.matches(""))
            g.drawString(logoTxt,
                    (int)(posx*scalex), (int)(posy*scaley));
    }

    public void render(Graphics2D g, Component dthis){
        if(imgRef.length() > 1){
            if(opacity < 1)
                g.setComposite(AlphaComposite.getInstance(
                        AlphaComposite.SRC_OVER, (float)opacity));
            if(shadeOff != 0 && shadow != null)
                g.drawImage(imgRef.getImage(2), 
                        (int)((posx+shadeOff)*scalex),
                        (int)((posy+shadeOff)*scaley), dthis);
            if(shadeOff == 0 && shadow != null)
                g.drawImage(imgRef.getImage(2), 
                        (int)(posx*scalex), (int)(posy*scaley), dthis);
            else
                g.drawImage(imgRef.getImage(1), 
                        (int)(posx*scalex), (int)(posy*scaley), dthis);
            if(opacity < 1)
                g.setComposite(AlphaComposite.SrcOver);
        }else if(!logoTxt.matches(""))
            g.drawString(logoTxt, (int)(posx*scalex), (int)(posy*scaley));
    }
    
    private void renderSpeed(){
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

    public void init() {}

    public void update(String name, int index, boolean isApplet,
            boolean seethru) {}

    public void update(int timePassed) {}
}
