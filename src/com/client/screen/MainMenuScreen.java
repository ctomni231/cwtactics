package com.client.screen;

import com.jslix.state.Screen;
import com.jslix.tools.ImgLibrary;
import com.jslix.tools.XML_Writer;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.HashMap;
import org.newdawn.slick.Graphics;

/**
 * The new main menu screen now using JSlix exclusively.
 *
 * @author Crecen
 */
public class MainMenuScreen extends Screen{

    private ImgLibrary imgSort;
    private int cursx;
    private int cursy;
    private XML_Writer writer;

    public MainMenuScreen(){
        cursx = scr_width;
        cursy = scr_height;
        imgSort = new ImgLibrary();
        HashMap<String, String> temp = new HashMap<String, String>();
        temp.put("blah", "1");
        temp.put("some", "2");
        temp.put("fare", "3");
        temp.put("strut", "4");
        temp.put("blue", "5");

        writer = new XML_Writer("", "cool.xml");
        writer.addXMLComment("This is a comment!!!");
        writer.addXMLTag("cool");
        writer.addAttribute("ID", "xml", false);
        writer.addXMLTag("next");
        writer.addXMLTag("week");
        writer.addXMLTag("cool");
        writer.addAttribute("ID", "ready", false);
        writer.addXMLTag("list");
        writer.addAttribute(temp, false);
        writer.endAllTags();
        writer.print();
        writer.writeToFile(true);


    }

    @Override
    public void init() {
        imgSort.addImage("image/menu/background1.png");
        imgSort.setImageSize(cursx, cursy);
        imgSort.addImage(imgSort.getImage(0));
        if(scr_isApplet)
            System.out.println("Applet");
        else
            System.out.println("Frame");
    }

    @Override
    public void update(int timePassed) {
        if(cursx != scr_width || cursy != scr_height){
            cursx = scr_width;
            cursy = scr_height;
            imgSort.setImageSize(cursx, cursy);
            imgSort.addImage(1, imgSort.getImage(0));
        }
        
    }

    @Override
    public void render(Graphics g) {
        g.drawImage(imgSort.getSlickImage(1), 0, 0);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        g.drawImage(imgSort.getImage(1), 0, 0, dthis);

    }



}
