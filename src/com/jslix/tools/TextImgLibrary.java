package com.jslix.tools;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;

/**
 * TextImgLibrary.java
 *
 * Adds the ability to make Images in forms of text paragraphs,
 * words, and lines.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 */

//TODO: Finish commenting this class
public class TextImgLibrary extends ImgLibrary{
    //Capital Letters Position
    private final int ASCII_CAP = 65;
    //Lowercase Letters Position
    private final int ASCII_LOW = 97;
    //Numbers start position
    private final int ASCII_NUMBER = 48;
    //This helps store an textImage
    BufferedImage bimg;
    //Graphic class for the Buffered Image
    Graphics2D g;

    public TextImgLibrary(){
        super();
        bimg = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
    }
    //GETTERS
    public Image getTextImage(){
        return bimg;
    }
    public org.newdawn.slick.Image getSlickTextImage(String imgName){
        return makeSlickImage(bimg, imgName);
    }

    //ADDERS
    //Adds a image to the ImgLibrary referenced by a letter
    public boolean addLetter(char letter, Image img){
        return addImage(""+letter+"", img);
    }
    //Adds a image to the Library referenced by [ref]_[letter]
    public boolean addLetter(char letter, Image img, String ref){
        if(img == null)
            return false;
        if(ref.matches(""))
            addImage(img);
        else
            addImage(ref+"_"+letter, img);
        if(getIndex(""+letter+"") == -1)
            addReference(""+letter+"", length()-1);
        return true;
    }
    //Adds a letter from an image that needs to be splitted
    public boolean addLetter(char letter, Image img, String ref,
            int slicex, int slicey, int start){
        if(slicex*slicey == 0 || start >= slicex*slicey ||
                start < 0 || img == null)
            return false;

        ImgLibrary temp = new ImgLibrary();
        temp.addImage(img);
        double psx = img.getWidth(temp);
        double psy = img.getHeight(temp);
        double sx = psx / (double)slicex;
        double sy = psy / (double)slicey;
        return addLetter(letter, temp.getImage(0, (start%slicex)*(int)sx,
                      (start/slicex)*(int)sy, (int)sx, (int)sy), ref);
    }
    //Helps with adding the most common letters
    public boolean addAllCapitalLetters(Image img, String ref,
            int slicex, int slicey, int start){
        return addSlicedText(img, ref, slicex, slicey, start, 
                ASCII_CAP, 26);
    }   
    public boolean addAllLowerCaseLetters(Image img, String ref,
            int slicex, int slicey, int start){
        return addSlicedText(img, ref, slicex, slicey, start, 
                ASCII_LOW, 26);
    }    
    public boolean addAllNumbers(Image img, String ref,
            int slicex, int slicey, int start){
        return addSlicedText(img, ref, slicex, slicey, start, 
                ASCII_NUMBER, 10);
    }
    
    //SETTERS
    //Draws a basic String, stops at whenever it reaches the pixel limit.
    //limit<1 = limitless
    public int setString(String word, String ref,
            int locx, int locy, int limit){
        return setString(word, ref, locx, locy, 0, limit);
    }
    public int setString(String word, String ref,
            int locx, int locy, int start, int limit){
        if(start > 0 && start < word.length())
            word = word.substring(start);

        int letterMax = word.length();
        int tsx = getDefaultSpacing(ref);
        int scrollX = 0;
        //If no spacing can be found, it quits out.
        if(tsx == 0) return letterMax;
                    
        //Sets up the PixtureMap
        prepareTextImage(word, locx, locy, limit, ref);

        //Draws a string that stops at spaces and dashes at the limit set.
        for(int i = 0; i < letterMax; i++){
            if(limit > 0 && scrollX > limit)
                return i;
            if(getIndex(ref+"_"+word.charAt(i)+"") != -1){
                scrollX += drawLetter(g, ref+"_"+word.charAt(i)+"",
                        locx+scrollX, locy, true);
            }else if(getIndex(""+word.charAt(i)+"") != -1){
                scrollX += drawLetter(g, ""+word.charAt(i)+"",
                        locx+scrollX, locy, true);
            }else
                scrollX += tsx;
        }
        return letterMax;
    }
    //Used for drawing text that stops at spaces and dashes
    //limit<1 = limitless
    public int setWords(String word, String ref,
            int locx, int locy, int limit){
        return setWords(word, ref, locx, locy, 0, limit, true);
    }
    public int setWords(String word, String ref,
            int locx, int locy, int start, int limit){
        return setWords(word, ref, locx, locy, start, limit, true);
    }
    //Used for drawing a textline that stops at spaces and dashes
    public void setParagraphLine(int linenumber, String word,
            String ref, int locx, int locy, int limit){
        setParagraphLine(linenumber, word, ref, locx, locy, limit, true);
    }
    //Used for drawing a group of line that stop at spaces and dashes
    public void setParagraph(String word, String ref, int locx, int locy,
            int limit, int spacingy, int startline, int endline){
        if(startline < 0)
            startline = 0;
        if(endline < startline)
            endline = startline;

        int tsy = getDefaultSpacing(ref, word);
        if(tsy == 0) return;

        int scrollY = tsy + spacingy;
        locy -= (scrollY*startline);
        //Sets up the PixtureMap
        prepareTextImage(word, locx, locy+(endline*scrollY), limit, ref);
        for(int i = startline; i < endline+1; i++)
            setParagraphLine(i, word, ref,
                    locx, (locy+(i*scrollY)), limit, false);

    }

    //PRIVATE
    //Returns false if all text wasn't added
    private boolean addSlicedText(Image img, String ref,
            int slicex, int slicey, int start, int ASCII_start,
            int ASCII_limit){
        for(int i = 0; i < ASCII_limit; i++){
            if(!addLetter((char)(i+ASCII_start), img, ref,
                    slicex, slicey, i+start))
                return false;
        }
        return true;
    }
    //Sets up a Buffered image ready for input
    private void prepareTextImage(String word, int locx,
            int locy, int limit, String ref){
        //Obtains a size for the PixtureMap and stores it
        int psizex = 1;
        int psizey = 1;
        int letterMax = word.length();
        for(int i = 0; i < letterMax; i++){
            if(psizex < getX(ref+"_"+word.charAt(i)+""))
                psizex = getX(ref+"_"+word.charAt(i)+"");
            else if(psizex < getX(""+word.charAt(i)+""))
                psizex = getX(""+word.charAt(i)+"");
            if(psizey < getY(ref+"_"+word.charAt(i)+""))
                psizey = getY(ref+"_"+word.charAt(i)+"");
            else if(psizey < getY(""+word.charAt(i)+""))
                psizey = getY(""+word.charAt(i)+"");
        }
        if(limit > 0){
            bimg = new BufferedImage(limit, locy+psizey,
                    BufferedImage.TYPE_INT_ARGB);
        }else{
            bimg = new BufferedImage(locx+(psizex*letterMax), locy+psizey,
                    BufferedImage.TYPE_INT_ARGB);
        }
        g = bimg.createGraphics();
    }

    private int setWords(String word, String ref,
            int locx, int locy, int start, int limit, boolean map){
        if(start > 0 && start < word.length())
            word = word.substring(start);

        int check = 0;
        int letterMax = word.length();
        int tsx = getDefaultSpacing(ref);
        int scrollX = 0;

        //If no spacing can be found, it quits out.
        if(tsx == 0) return letterMax;

        if(map)
            prepareTextImage(word, locx, locy, limit, ref);

        //Attempts to draw the word for the image
        for(int i = 0; i < letterMax; i++){
            if(limit > 0 && (scrollX > limit || (scrollX+check) > limit))
                return i;
            check = 0;

            if(getIndex(ref+"_"+word.charAt(i)+"") != -1){
                scrollX += drawLetter(g, ref+"_"+word.charAt(i)+"",
                        locx+scrollX, locy, (start >= 0));
            }else if(getIndex(""+word.charAt(i)+"") != -1){
                scrollX += drawLetter(g, ""+word.charAt(i)+"",
                        locx+scrollX, locy, (start >= 0));
            }else
                scrollX += tsx;

            if(word.charAt(i) == ' ' || word.charAt(i) == '-'){
                for(int j = i+1; j < letterMax; j++){
                    if((word.charAt(j) == ' ') || (j == letterMax - 1)
                            ||(word.charAt(j) == '\n')){
                        check = (j - i)*(tsx);
                        break;
                    }
                }
            }

            if(word.charAt(i) == '\n')
                return i+1;
        }

        return letterMax;
    }

    private void setParagraphLine(int linenumber, String word,
            String ref, int locx, int locy, int limit, boolean map){
        int letterMax = word.length();
        int start = 0;
        int position = 0;
        //Sets up the PixtureMap
        if(map)
            prepareTextImage(word, locx, locy, limit, ref);
        do{
            if(linenumber == position){
                start = setWords(word.substring(start),
                        ref, locx, locy, 0, limit, false);
                return;
            }else
                start += setWords(word.substring(start),
                        ref, locx, locy, -1, limit, false);
            if(start > letterMax)
                return;
            position++;
        }while(start != -1);
    }

    private int getDefaultSpacing(String ref, String word){
        int tsy = 0;
        for(int i = 0; i < word.length(); i++){
            if(getY(ref+"_"+word.charAt(i)) > tsy)
                tsy = getY(ref+"_"+word.charAt(i));
            else if(getY(""+word.charAt(i)+"") > tsy)
                tsy = getY(""+word.charAt(i)+"");
        }
        return tsy;
    }

    private int getDefaultSpacing(String ref){
        int tsx = 0;
        //Tries to get default spacing for the letters
        if(getX(ref+"_ ") != 0)
            tsx = getX(ref+"_ ");
        else if(getX(" ") != 0)
            tsx = getX(" ");
        else if(getX(ref+"_A") != 0)
            tsx = getX(ref+"_A");
        else if(getX("A") != 0)
            tsx = getX("A");
        else
            tsx = getX(0);
        return tsx;
    }

    private int drawLetter(Graphics2D g, String ref,
            int locx, int locy, boolean draw){
        if(draw)
            g.drawImage(getImage(getIndex(ref)), locx, locy, this);
        return getX(ref);
    }
}
