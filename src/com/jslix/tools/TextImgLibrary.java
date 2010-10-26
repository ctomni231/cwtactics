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
 * @version 10.25.10
 */

public class TextImgLibrary extends ImgLibrary{
	
    private static final long serialVersionUID = 2452945053572843636L;
	
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

    /**
     * This class is used for creating text from images in a java2D image
     * format. The text is inputted as a String and then the text can be
     * organized into strings, words, or paragraphs. The text is given in
     * a java2D picture representing the text.
     */
    public TextImgLibrary(){
        super();
        bimg = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
    }

    //-------
    //GETTERS
    //-------

    /**
     * This gets the created text as a java2D image
     * @return The java2D image representation of the text
     */
    public Image getTextImage(){
        return bimg;
    }

    /**
     * This gets the Slick2D representation of the created text
     * @param imgName The name of the SLick2D image
     * @return The Slick2D representation of the text
     */
    public org.newdawn.slick.Image getSlickTextImage(String imgName){
        return il.makeSlickImage(bimg, imgName);
    }

    //------
    //ADDERS
    //------

    /**
     * This adds a letter image to the internal ImgLibrary of this class.
     * This letter is used to draw words for string text.
     * @param letter The character this image represents
     * @param img The current image to place into the ImgLibrary
     * @return Whether inputting the image was successful
     */
    public boolean addLetter(char letter, Image img){
        return addImage(""+letter+"", img);
    }

    /**
     * This adds a letter image to the internal ImgLibrary of this class.
     * The letter reference is prefixed by the reference you specify in this
     * format [ref]_[letter]. This letter is used to draw words for string
     * text.
     * @param letter The character this image represents
     * @param img The current image to place into the image library
     * @param ref The name of the reference prefix
     * @return Whether inputting the image was successful
     */
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

    /**
     * This adds a letter image to the internal ImgLibrary of this class
     * for images that include more than one letter, the slice variables
     * are used to splice the images evenly, while start decides the location
     * of the image. The letter reference is prefixed by the reference you
     * specify in this format [ref]_[letter]. These letters are used to draw
     * words for string text.
     * @param letter The character this image represents
     * @param img The current image to place into the image library
     * @param ref The name of the reference prefix
     * @param slicex The number of slices along the x-axis
     * @param slicey The number of slices along the y-axis
     * @param start The location of the image index Left-Right Top-Bottom
     * order starting at 0.
     * @return Whether inputting the image was successful
     */
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

    /**
     * This function adds all the capital letters to the internal ImgLibrary.
     * The letter reference is prefixed by the reference you
     * specify in this format [ref]_[letter]. These letters are used to draw
     * words for string text.
     * @param img The current image to place into the image library
     * @param ref The name of the reference prefix
     * @param slicex The number of slices along the x-axis
     * @param slicey The number of slices along the y-axis
     * @param start The location of the image index Left-Right Top-Bottom
     * order starting at 0.
     * @return Whether inputting the images was successful
     */
    public boolean addAllCapitalLetters(Image img, String ref,
            int slicex, int slicey, int start){
        return addSlicedText(img, ref, slicex, slicey, start, 
                ASCII_CAP, 26);
    }

    /**
     * This function adds all the lower case letters to the internal
     * ImgLibrary. The letter reference is prefixed by the reference you
     * specify in this format [ref]_[letter]. These letters are used to draw
     * words for string text.
     * @param img The current image to place into the image library
     * @param ref The name of the reference prefix
     * @param slicex The number of slices along the x-axis
     * @param slicey The number of slices along the y-axis
     * @param start The location of the image index Left-Right Top-Bottom
     * order starting at 0.
     * @return Whether inputting the images was successful
     */
    public boolean addAllLowerCaseLetters(Image img, String ref,
            int slicex, int slicey, int start){
        return addSlicedText(img, ref, slicex, slicey, start, 
                ASCII_LOW, 26);
    }

    /**
     * This function adds all the numbers to the internal ImgLibrary.
     * The letter reference is prefixed by the reference you
     * specify in this format [ref]_[letter]. These letters are used to draw
     * words for string text.
     * @param img The current image to place into the image library
     * @param ref The name of the reference prefix
     * @param slicex The number of slices along the x-axis
     * @param slicey The number of slices along the y-axis
     * @param start The location of the image index Left-Right Top-Bottom
     * order starting at 0.
     * @return Whether inputting the images was successful
     */
    public boolean addAllNumbers(Image img, String ref,
            int slicex, int slicey, int start){
        return addSlicedText(img, ref, slicex, slicey, start, 
                ASCII_NUMBER, 10);
    }

    //-------
    //SETTERS
    //-------

    /**
     * Uses letters from the letter dictionary to form letters. This
     * will draw letters to an image in the form of a continuous string.
     * This function starts at the beginning of the word.
     * @param word The letters to draw into the image
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     * @return returns the letter it stopped at
     */
    public int setString(String word, String ref,
            int locx, int locy, int limit){
        return setString(word, ref, locx, locy, 0, limit);
    }

    /**
     * Uses letters from the ImgLibrary to form letters. This
     * will draw letters to an image in the form of a continuous string.
     * @param word The letters to draw into the image
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param start Which letter to start reading the word at [0: default]
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     * @return returns the letter it stopped at
     */
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

    /**
     * Uses letters from the ImgLibrary dictionary to form words. Difference
     * from setString() is that words are only cut off at white spaces and
     * dashes. This function starts at the beginning of the word string.
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param start Which letter to start reading the word at
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     * @return returns the letter it stopped at.
     */
    public int setWords(String word, String ref,
            int locx, int locy, int limit){
        return setWords(word, ref, locx, locy, 0, limit, true);
    }

    /**
     * Uses letters from the ImgLibrary to form words. Difference from
     * setString() is that words are only cut off at white spaces and dashes.
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param start Which letter to start reading the word at
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     * @return returns the letter it stopped at.
     */
    public int setWords(String word, String ref,
            int locx, int locy, int start, int limit){
        return setWords(word, ref, locx, locy, start, limit, true);
    }

    /**
     * Uses letters from the ImgLibrary to form mini paragraphs.
     * Mini paragraphs are kept track of extensively in this function as
     * long as the text and limit remains constant.
     * @param linenumber The line of the paragraph to draw
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     */
    public void setParagraphLine(int linenumber, String word,
            String ref, int locx, int locy, int limit){
        setParagraphLine(linenumber, word, ref, locx, locy, limit, true);
    }

    /**
     * Uses letters from the ImgLibrary to form paragraphs.
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param limit The number of pixels text is allowed to go
     * in the X-direction (Numbers below 1: no x-limits)
     * @param spacingy The amount of y-axis spacing to give between each line
     * @param startline The line of the paragraph to start at
     * @param endline The line of the paragraph to end at
     */
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

    //-------
    //PRIVATE
    //-------

    /**
     * This function adds sliced images to the ImgLibrary for referencing
     * @param img The current image to place into the image library
     * @param ref The name of the reference prefix
     * @param slicex The number of slices along the x-axis
     * @param slicey The number of slices along the y-axis
     * @param start The location of the image index Left-Right Top-Bottom
     * order starting at 0.
     * @param ASCII_start The starting point of the ASCII character
     * @param ASCII_limit The amount of ASCII characters in the list
     * @return Whether all characters were added to the list
     */
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

    /**
     * This function sets up the Buffered Image used for changing a String
     * text into an image file
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     */
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

    /**
     * Uses letters from the ImgLibrary to form words. Difference from
     * setString() is that words are only cut off at white spaces and dashes.
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param start Which letter to start reading the word at
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     * @param map Whether it is drawing to the image(T) or not(F)
     * @return returns the letter it stopped at.
     */
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

    /**
     * Uses letters from the ImgLibrary to form mini paragraphs.
     * Mini paragraphs are kept track of extensively in this function as
     * long as the text and limit remains constant.
     * @param linenumber The line of the paragraph to draw
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param limit The number of pixels text is allowed to go in the
     * X-direction (Numbers below 1: no x-limits)
     * @param map Whether it is drawing to the image(T) or not(F)
     */
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

    /**
     * This gets the default spacing for the y-axis for paragraphs using
     * the images in ImgLibrary as a reference
     * @param word The word to draw
     * @param ref The reference text to the letter image
     * @return The amount of spacing for this image
     */
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

    /**
     * This gets the default spacing for the x-axis for words using
     * the images in ImgLibrary as a reference
     * @param ref The reference text to the letter image
     * @return The amount of spacing for these words
     */
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

    /**
     * This function draws a letter to the image map
     * @param g The java2D graphics object
     * @param ref The reference text to the letter image
     * @param locx Starting x-location of the word in the image
     * @param locy Starting y-location of the word in the image
     * @param draw Whether to draw this image to the BufferedImage
     * @return The width of this particular item
     */
    private int drawLetter(Graphics2D g, String ref,
            int locx, int locy, boolean draw){
        if(draw)
            g.drawImage(getImage(getIndex(ref)), locx, locy, this);
        return getX(ref);
    }
}
