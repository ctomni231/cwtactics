package com.client.graphic;

import com.client.graphic.tools.MovingMenu;
import com.client.input.KeyControl;
import com.jslix.tools.FileFind;
import com.jslix.tools.ImgLibrary;
import com.jslix.tools.MouseHelper;
import com.jslix.tools.TextImgLibrary;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import java.io.FileNotFoundException;
import java.util.Scanner;
import org.newdawn.slick.Graphics;

/**
 * CreditGUI
 *
 * A screen created so you can see the many great creators of this game.
 * Code is given in by a text file.
 *
 * @author Crecen
 */
public class CreditGUI extends MovingMenu{

    private Scanner scanner;
    private FileFind find;
    private String credits;
    private String credPath;
    private String credItem;
    private String curItem;
    private String alpha;
    private MouseHelper help;
    private Color[] dfltColors;
    private Color[] chngColors;
    private int[] colors;
    private Color line;

    public CreditGUI(String alphaPath, String creditPath,
            int locx, int locy, double speed){
        super(locx, locy, speed);
        credits = "";
        help = new MouseHelper();
        help.setScrollIndex(20);
        dfltColors = new Color[]{new Color(128, 128, 128),
        new Color(160, 160, 160)};
        chngColors = new Color[]{new Color(200, 200, 200),
        new Color(255, 255, 255)};
        credPath = creditPath;
        curItem = "";
        alpha = alphaPath;
        setLineColor(Color.DARK_GRAY);
        try {
            scanContents(credPath);
        } catch (FileNotFoundException ex) {
            System.err.println(ex);
        }
    }

    public void start(){
        if(scanner != null)
            scanner.close();
        scanner = new Scanner(credits);
    }

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {      
        help.setMouseControl(sysTime);
        if(help.getScroll())
            super.update(width, height, sysTime, mouseScroll);
        
       
        if(allItems.length == 0){
            start();
            createItem();
        }else if(allItems[allItems.length-1].posy < 450)
            createItem();

        for(int i = 0; i < allItems.length; i++){
            if(allItems[i].posy < -15)
                deleteItem(i);
        }
    }

    public boolean getMenuChange(){
        if(!curItem.matches(credItem)){
            curItem = credItem;
            return true;
        }
        return false;
    }

    public String getHelpText(){
        return curItem;
    }

    @Override
    public void render(Graphics g) {
        for(int i = 0; i < allItems.length; i++){
            allItems[i].speed = speed*scaley;
            if(allItems[i].selectable){
                g.setColor(imgRef.getColor(line));
                g.fillRect(0, (int)(allItems[i].posy*scaley+5),
                        (int)(640*scalex), (int)(7*scaley));
            }
            if(opacity < 1)
                imgResize.getSlickImage(allItems[i].select)
                	.setAlpha((float)opacity);

            g.drawImage(imgResize.getSlickImage(allItems[i].select),
                    (int)(allItems[i].posx*scalex),
                    (int)(allItems[i].posy*scaley));

        }
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        for(int i = 0; i < allItems.length; i++){
            if(allItems[i] == null)
                continue;
            allItems[i].speed = speed*scaley;
            if(allItems[i].selectable){
                g.setColor(line);
                g.fillRect(0, (int)(allItems[i].posy*scaley+5),
                        (int)(640*scalex), (int)(7*scaley));
            }
            if(opacity < 1)
                g.setComposite(AlphaComposite.getInstance(
                                AlphaComposite.SRC_OVER,
                (float)opacity));
            g.drawImage(imgResize.getImage(allItems[i].select),
                    (int)(allItems[i].posx*scalex),
                    (int)(allItems[i].posy*scaley), dthis);
            if(opacity < 1)
                g.setComposite(AlphaComposite.SrcOver);
        }
    }



    private void createItem(){
        if(scanner.hasNextLine())
            credItem = scanner.nextLine();

        if(!credItem.isEmpty()){
            createNewItem(620-imgRef.getX(credItem), 480, speed);
            if(credItem.startsWith("<"))
                addMenuItem(imgRef.getIndex(credItem), true);
            else
                addMenuItem(imgRef.getIndex(credItem), false);

            setItemPosition(allItems.length-1, 0, -500, true);
        }
    }

    public int control(int column){
        if(KeyControl.isActionClicked() ||
                KeyControl.isCancelClicked()){
            column = 1;
            deleteItems();
        }
        return column;
    }

    private void scanContents(String path) throws FileNotFoundException{
        if(credits.isEmpty()){
            find = new FileFind();
            scanner = new Scanner(find.getFile(path));
            while(scanner.hasNextLine()){
                credItem = scanner.nextLine();
                credits += credItem+"\n";
                if(!credItem.isEmpty()){
                    if(credItem.startsWith("<")){
                        imgRef.addImage(credItem,
                            getTextImg(alpha, 
                            credItem.substring(1,
                            credItem.length()-1).toUpperCase(),
                            dfltColors, chngColors));
                    }else
                        imgRef.addImage(credItem,
                            getTextImg(alpha, credItem.toUpperCase()));
                }
            }
        }
        
    }

    private java.awt.Image getTextImg(String alpha, String text){
        return getTextImg(alpha, text, null, null);
    }
    private java.awt.Image getTextImg(String alpha, String text,
            Color[] fromColor, Color[] toColor){
        TextImgLibrary txtLib = new TextImgLibrary();
        txtLib.addImage(alpha);
        txtLib.addImage("image/menu/numbers.png");
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
        
        txtLib.addAllNumbers(txtLib.getImage(1), "", 10, 1, 0);
        txtLib.setString(text, "", 0, 0, 0, 0);
        if(fromColor != null && toColor != null){
            for(int j = 0; j < fromColor.length; j++)
                txtLib.setPixelChange(fromColor[j], toColor[j]);
        }
        txtLib.addImage(text, txtLib.getTextImage());
        return txtLib.getImage(text);
    }

    public void setColorPath(String colorPath){
        ImgLibrary imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
    }

    public void setColor(int index){
        index *= 16;
        resetColor();
        if(index >= 0 && index < colors.length){
            addColor(new Color(160, 160, 160),
                    new Color(colors[index+9+3]));
            addColor(new Color(128, 128, 128),
                    new Color(colors[index+9+4]));
            addColor(new Color(255, 255, 255),
                    new Color(colors[index+9+0]));
            addColor(new Color(200, 200, 200),
                    new Color(colors[index+9+2]));
            setLineColor(new Color(colors[index+9+5]));
            resetScreen();
        }else{
            setLineColor(Color.DARK_GRAY);
            resetScreen();
        }
    }

    private void setLineColor(Color color){
        if(color != null)
            line = imgRef.getColor(color, 127);
    }

}
