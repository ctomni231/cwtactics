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
 * CreditGUI.java
 *
 * A screen created so you can see the many great creators of this game.
 * Credit text is given in by a text file.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.15.10
 */

public class CreditGUI extends MovingMenu{

    private Scanner scanner;//The scanner used for reading from strings/files
    private FileFind find;//Used for finding a file
    private String credits;//This holds the scannable credit item
    private String credPath;//This holds the path to the credit file
    private String credItem;//This holds the temporary name in the list
    private String curItem;//This keeps track of name changes in the list
    private String alpha;//The path to the alpha letters
    private String numbers;//The path to the numbers text
    private MouseHelper help;//This controls the scrolling speed of the text
    private Color[] dfltColors;//Default colors for the letters
    private Color[] chngColors;//Colors to change the letters to
    private int[] colors;//Integer repersentation of the multiple colors
    private Color line;//The color of the background line on a credit subject

    /**
     * This class displays a list of credits from a text file
     * @param alphaPath The path to the alphabet pictures
     * @param numberPath The path to the number picture
     * @param creditPath The path to the credit list
     * @param locx The x-axis location of the credit list
     * @param locy The y-axis location of the credit list
     * @param speed How fast the credits will move in an upward direction
     */
    public CreditGUI(String alphaPath, String numberPath, String creditPath,
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
        numbers = numberPath;
        setLineColor(Color.DARK_GRAY);
        try {
            scanContents(credPath);
        } catch (FileNotFoundException ex) {
            System.err.println(ex);
        }
    }

    /**
     * This function starts the credits from the beginning once they
     * are loaded in.
     */
    public void start(){
        if(scanner != null)
            scanner.close();
        scanner = new Scanner(credits);
    }

    /**
     * This function updates the movement of the credits
     * @param width The current window width
     * @param height The current window height
     * @param sysTime The system time in milliseconds
     * @param mouseScroll Tells you information about the mouse scroll wheel
     */
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

    /**
     * This function changes each time a new item appears on the credit menu
     * @return Whether a new item appeared
     */
    public boolean getMenuChange(){
        if(!curItem.matches(credItem)){
            curItem = credItem;
            return true;
        }
        return false;
    }

    /**
     * This function returns what shows on the help bar
     * @return The current name on the credit list
     */
    public String getHelpText(){
        return curItem;
    }

    /**
     * This renders the credit list to the screen
     * @param g Graphics object for Slick
     */
    @Override
    public void render(Graphics g) {
        for(int i = 0; i < allItems.length; i++){
            allItems[i].speed = speed*scaley;
            if(allItems[i].selectable){
                g.setColor(imgRef.getColor(line));
                g.fillRect(0, (int)((allItems[i].posy+5)*scaley),
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

    /**
     * This renders the credit list to the Screen
     * @param g Graphics object for Java2D
     * @param dthis Component object for Java2D
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        for(int i = 0; i < allItems.length; i++){
            if(allItems[i] == null)
                continue;
            allItems[i].speed = speed*scaley;
            if(allItems[i].selectable){
                g.setColor(line);
                g.fillRect(0, (int)((allItems[i].posy+5)*scaley),
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

    /**
     * This function creates a new list item for the credit menu
     */
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

    /**
     * This function deals with all the keyboard and mouse actions for this
     * screen. It also deals with how this screen interacts with other
     * screens.
     * @param column The current column this screen is on
     * @return A new column to change to
     */
    public int control(int column){
        if(KeyControl.isActionClicked() ||
                KeyControl.isCancelClicked()){
            column = 1;
            deleteItems();
        }
        return column;
    }

    /**
     * This function scans the contents of the text file.
     * @param path Where the text file is located
     * @throws FileNotFoundException The exception if the file isn't found
     */
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

    /**
     * This function turns a String into a picture
     * @param alpha The path to the alpha file
     * @param text The text to convert into a picture
     * @return An image representing the text
     */
    private java.awt.Image getTextImg(String alpha, String text){
        return getTextImg(alpha, text, null, null);
    }

    /**
     * This function turns a String into a picture
     * @param alpha The path to the alpha file
     * @param text The text to convert into a picture
     * @param fromColor A list of default colors
     * @param toColor A list of recolor values
     * @return An image representing the text
     */
    private java.awt.Image getTextImg(String alpha, String text,
            Color[] fromColor, Color[] toColor){
        TextImgLibrary txtLib = new TextImgLibrary();
        txtLib.addImage(alpha);
        txtLib.addImage(numbers);
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

    /**
     * This function gets a list of color changes for menu items
     * @param colorPath The path to the color list
     */
    public void setColorPath(String colorPath){
        ImgLibrary imgLib = new ImgLibrary();
        imgLib.addImage(colorPath);
        colors = imgLib.getPixels(0);
    }

    /**
     * This function changes the color based on the menu colors
     * @param index Which index of colors to use for this menu
     */
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

    /**
     * This function sets the background line color
     * @param color The color to change the background line
     */
    private void setLineColor(Color color){
        if(color != null)
            line = imgRef.getColor(color, 127);
    }
}