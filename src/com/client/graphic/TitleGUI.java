package com.client.graphic;

import com.client.graphic.tools.MovingImage;
import com.client.input.KeyControl;
import com.jslix.tools.LocaleService;
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
    private boolean help;

    public TitleGUI(int locx, int locy, double speed){
        super(locx, locy, speed);
        counter = 0;
        time = 0;
        help = false;
    }
    
    public void setWords(String alphaPath, String text, int width, int height){
        setImage(getTextImg(alphaPath, text), width, height);
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);      
        time = sysTime;
        changeTime();
    }

    @Override
    public void render(Graphics g){
        imgRef.getSlickImage(1).setAlpha((float)counter);
        if(imgRef.length() > 1)
            imgRef.getSlickImage(2).setAlpha((float)counter);
        super.render(g);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,
                (float)counter));
        super.render(g, dthis);
        g.setComposite(AlphaComposite.SrcOver);
    }

    public int control(int column){
        if(KeyControl.isUpClicked() ||
                KeyControl.isDownClicked() ||
                KeyControl.isRightClicked() ||
                KeyControl.isLeftClicked())
            help = !help;

        if(KeyControl.isActionClicked()){
            if(KeyControl.getMouseY() < 20*scaley)
                help = !help;
            else
                return 0;
        }else if(KeyControl.isCancelClicked()){
            return -1;
        }
        return column;
    }

    public boolean getHelp(){
        return help;
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
