package com.client.graphic.tools;

import com.jslix.tools.MouseHelper;
import com.jslix.tools.PixtureMap;
import java.awt.Component;
import java.awt.Graphics2D;
import java.awt.Image;
import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * ScrollImage
 *
 * This is a remix of ScrollPix, it is used for moving images across the
 * Screen in a smooth motion, has support for Java2D fonts.
 *
 * @author Crecen
 */
public class ScrollImage extends MovingImage {

    private ArrayList<Double> textScroll;
    private double scrollSpeed;
    private int sizex;
    private int sizey;
    private Color textColor;
    private Color boxColor;
    private MouseHelper helper;

    public ScrollImage(int locx, int locy,
            int sizex, int sizey, int moveSpeed){
        super(locx, locy, moveSpeed);
        textScroll = new ArrayList<Double>();
        scrollSpeed = 1.0;
        opacity = 0.3;
        this.sizex = sizex;
        this.sizey = sizey;
        boxColor = new Color(60, 60, 60, 127);
        textColor = new Color(255, 255, 255, 127);
        helper = new MouseHelper();
        
    }

    public void setScrollSpeed(double speed){
        if(speed < 0)
            speed *= -1;
        if(speed != 0)
            scrollSpeed = speed;
    }

    public void setScrollIndex(int speed){
        helper.setScrollIndex(speed);
    }

    public void setBoxColor(java.awt.Color newColor){
        setBoxColor(imgRef.getColor(newColor));
    }
    public void setBoxColor(Color newColor){
        if(newColor != null)
            boxColor = newColor;
    }

    public void setTextColor(java.awt.Color newColor){
        setTextColor(imgRef.getColor(newColor));
    }
    public void setTextColor(Color newColor){
        if(newColor != null)
            textColor = newColor;
    }

    public void setTextImage(String text) {
        setShadowColor(imgRef.getColor(textColor));
        setImage(getTextPicture(text), 0, 0);
        logoTxt = text;
        textScroll.clear();
    }
    
    public String getText(){
    	return logoTxt;
    }

    private Image getTextPicture(String text){
        PixtureMap pixture = new PixtureMap();
        pixture.setOpacity(opacity);
        return pixture.getTextPicture(text);
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        helper.setMouseControl(sysTime);
        super.update(width, height, sysTime, mouseScroll);
    }


    @Override
    public void render(Graphics2D g, Component dthis){
        g.setColor(imgRef.getColor(boxColor));
        g.fillRect((int)(posx*scalex), (int)(posy*scaley), 
                (int)(sizex*scalex), (int)(sizey*scaley));
        if(helper.getScroll())
            scroll(g, (int)posx, (int)posy, sizex, scrollSpeed, dthis);
        else
            scroll(g, (int)posx, (int)posy, sizex, 0, dthis);
    }

    @Override
    public void render(Graphics g){
        g.setColor(boxColor);
        g.fillRect((int)(posx*scalex), (int)(posy*scaley),
                (int)(sizex*scalex), (int)(sizey*scaley));
        if(helper.getScroll())
            scroll(g, (int)posx, (int)posy, sizex, scrollSpeed);
        else
            scroll(g, (int)posx, (int)posy, sizex, 0);
    }

    private void scroll(Graphics g, int px, int py,
            int width, double speed){
        //If he is picky about speed, then make it a double...
        double temp;
        double addmore;

        if(textScroll.isEmpty())
            textScroll.add((double)width);

        for(int i = 0; i < textScroll.size(); i++){
            temp = textScroll.get(i)-speed;
            addmore = scrollImg(g, (int)(px+temp), py);
            if(temp < -addmore)
                textScroll.remove(i);
            else
                textScroll.set(i, temp);

            if(i == textScroll.size()-1){
                if(textScroll.get(i) < width-addmore)
                    textScroll.add((double)width);
            }
        }
    }

    private void scroll(Graphics2D g, int px, int py,
            int width, double speed, Component dthis){
        //If he is picky about speed, then make it a double...
        double temp;
        double addmore;

        if(textScroll.isEmpty())
            textScroll.add((double)width);

        for(int i = 0; i < textScroll.size(); i++){
            temp = textScroll.get(i)-speed;
            addmore = scrollImg(g, (int)(px+temp), py,  dthis);
            if(temp < -addmore)
                textScroll.remove(i);
            else
                textScroll.set(i, temp);

            if(i == textScroll.size()-1){
                if(textScroll.get(i) < width-addmore)
                    textScroll.add((double)width);
            }
        }
    }

    private double scrollImg(Graphics g, int px, int py){
        g.drawImage(imgRef.getSlickImage(1), (int)(px*scalex),
                (int)(py*scaley));
        return imgRef.getOrigX(1);
    }

    private double scrollImg(Graphics2D g, int px, int py,
            Component dthis){
        g.drawImage(imgRef.getImage(1), (int)(px*scalex), (int)(py*scaley),
                dthis);
        return imgRef.getOrigX(1);
    }
}
