package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.input.KeyControl;
import com.jslix.tools.TextImgLibrary;
import java.awt.AlphaComposite;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 *
 * @author Ctomni
 */
public class TitleGUI extends MovingImage {

    private double counter;
    private int time;

    public TitleGUI(int locx, int locy, double speed){
        super(locx, locy, speed);
        counter = 0;
        time = 0;
    }
    
    public void setWords(String alphaPath, String text, int width, int height){
        setImage(getTextImg(alphaPath, text), width, height);
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);      
        time = sysTime;
    }

    @Override
    public void render(Graphics g){
        changeTime();
        imgRef.getSlickImage(1).setAlpha((float)counter);
        g.drawImage(imgRef.getSlickImage(1), (int)(posx*scalex),
                (int)(posy*scaley));
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        changeTime();
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)counter));
        g.drawImage(imgRef.getImage(1), (int)(posx*scalex),
                (int)(posy*scaley), dthis);
        g.setComposite(AlphaComposite.SrcOver);
    }

    public int control(){
        if(KeyControl.isActionClicked()){
            return 0;
        }else if(KeyControl.isCancelClicked()){
            return 1;
        }

        return 0;
    }

    private void changeTime(){
        counter = (((double)time/1000)-.5);
        if(counter > 1 || counter < -1)
            counter = 1;
        if(counter < 0)
            counter *= -1;
    }

    private java.awt.Image getTextImg(String alpha, String text){
        TextImgLibrary txtLib = new TextImgLibrary();
        txtLib.addImage(alpha);
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
        txtLib.setString(text, "", 0, 0, 0, 0);
        return txtLib.getTextImage();
    }
}
