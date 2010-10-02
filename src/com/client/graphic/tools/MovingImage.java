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

    protected double scalex;//Controls the scale width of an Image
    protected double scaley;//Controls the scale height of an Image
    private int origx;//The original width of the screen
    private int origy;//The original height of the screen
    private int cursx;//The current scale width of an Image
    private int cursy;//The current scale height of an Image

    protected double posx;//The current x-axis position of an image
    protected double posy;//The current y-axis position of an image
    protected double fposx;//Where this image will move to in x-axis
    protected double fposy;//Where this image will move to in y-axis
    protected double speed;//How quickly the object will move
    protected int shadeOff;//How far off the shade is from the image
    protected Color shadow;//What color to put in the shadow of the image
    protected double opacity;//How much color you can see through an image

    protected ImgLibrary imgRef;//The stored displayed Images
    protected String logoTxt;//Almost obsolete, text based display
    protected boolean active;//This controls if image resizing is active

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
        active = true;
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

    //Sets an opacity for this image
    public void setOpacity(double opacity){
        if(opacity >= 0 && opacity <= 1)
            this.opacity = opacity;
    }

    //Sets a new image based on the filepath
    public void setImage(String imgPath){
        setImage(imgPath, 0, 0);
    }

    //Sets a new image based on a current image
    public void setImage(Image img){
        setImage(img, 0, 0);
    }

    //Sets a new resizable image based on filepath
    public void setImage(String imgPath, int sizex, int sizey){
        if(sizex*sizey > 0)
            imgRef.setImageSize(sizex, sizey);
        if(active)
            imgRef.addImage(0, imgPath);
        else
            imgRef.addImage(imgPath);
        cursx = 0;
    }

    //Sets a new resizable image based on a current image
    public void setImage(Image img, int sizex, int sizey){
        if(sizex*sizey > 0)
            imgRef.setImageSize(sizex, sizey);
        if(active)
            imgRef.addImage(0, img);
        else
            imgRef.addImage(img);
        cursx = 0;
    }

    //Sets a whole new offset for the shadow
    public void setShadowOffset(int offset){
        shadeOff = offset;
    }

    //Sets a whole new color for the shadow
    public void setShadowColor(Color theColor){
        if(theColor != null)
            shadow = theColor;
    }

    //Sets new text for the display
    public void setText(String display){
        logoTxt = display;
    }

    //Forces the image into this position
    public void setPosition(int x, int y){
        posx = x;
        posy = y;
    }

    //Glides the image into a position specified
    public void setFinalPosition(int x, int y){
        fposx = x;
        fposy = y;
    }

    //Clears all stored text
    public void clearText(){
        logoTxt = "";
    }

    //Sets the speed in which the menu will glide
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
            if(active){
                imgRef.setImageSize((int)((double)imgRef.getX(0)*scalex),
                    (int)((double)imgRef.getY(0)*scaley));
                imgRef.addImage(1, imgRef.getImage(0));
                if(shadow != null){
                    imgRef.setPixelBlend(shadow);
                    imgRef.addImage(2, imgRef.getImage(1));
                }
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

    //This controls the gliding of the images
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
