package com.client.graphic.tools;

import java.awt.Component;
import java.awt.Graphics2D;
import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * ScrollText
 *
 * This is a remix of ScrollPix, it is used for moving text across the
 * Screen in a smooth motion.
 *
 * @author Crecen
 */
public class ScrollText extends MovingImage{

    private ArrayList<Double> textScroll;
    private double scrollSpeed;
    private int sizex;
    private int sizey;
    private Color textColor;
    private Color boxColor;

    public ScrollText(int locx, int locy,
            int sizex, int sizey, double moveSpeed){
        super(locx, locy, moveSpeed);
        textScroll = new ArrayList<Double>();
        scrollSpeed = 1.0;
        this.sizex = sizex;
        this.sizey = sizey;
        boxColor = new Color(60, 60, 60, 127);
        textColor = new Color(255, 255, 255, 127);
    }

    public void setScrollSpeed(double speed){
        if(speed < 0)
            speed *= -1;
        if(speed != 0)
            scrollSpeed = speed;
    }

    public void setBoxColor(Color newColor){
        if(newColor != null)
            boxColor = newColor;
    }

    public void setTextColor(Color newColor){
        if(newColor != null)
            textColor = newColor;
    }

    @Override
    public void clearText(){
        super.clearText();
        textScroll.clear();
    }

    @Override
    public void render(Graphics2D g, Component dthis){
        g.setColor(imgRef.getColor(boxColor));
        g.fillRect((int)(posx*scalex), (int)(posy*scaley), sizex, sizey);
        g.setColor(imgRef.getColor(textColor));
        if(logoTxt != null && !logoTxt.matches(""))
            scroll(g, (int)(posx*scalex), (int)(posy*scaley), sizex,
                    sizey, scrollSpeed);
    }

    @Override
    public void render(Graphics g){
        g.setColor(boxColor);
        g.fillRect((int)(posx*scalex), (int)(posy*scaley),
                sizex, sizey);
        g.setColor(textColor);
        if(logoTxt != null && !logoTxt.matches(""))
            scroll(g, (int)(posx*scalex), (int)(posy*scaley), 
                    sizex, scrollSpeed);
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
            addmore = scrollText(g, (int)(px+temp), py);
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
            int width, int height, double speed){
        //If he is picky about speed, then make it a double...
        double temp;
        double addmore;

        if(textScroll.isEmpty())
            textScroll.add((double)width);

        for(int i = 0; i < textScroll.size(); i++){
            temp = textScroll.get(i)-speed;
            addmore = scrollText(g, (int)(px+temp), py, height);
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

    private double scrollText(Graphics g, int px, int py){
        g.drawString(logoTxt, px, py);
        return g.getFont().getWidth(logoTxt);
    }

    private double scrollText(Graphics2D g, int px, int py, int height){
        g.drawString(logoTxt, px, py+height);
        return g.getFontMetrics().stringWidth(logoTxt);
    }
}
