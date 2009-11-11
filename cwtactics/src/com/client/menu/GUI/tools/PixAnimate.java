package com.client.menu.GUI.tools;

import com.client.model.loading.ImgData;
import com.client.model.loading.ImgDataParser;
import com.client.model.loading.ImgFile;
import com.client.tools.ImgLibrary;
import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import org.newdawn.slick.Graphics;

/**
 * This class makes ImgData worth while by turning its data into
 * animated pictures. All you need to know is the name of the
 * picture and the location, and it'll give an updated animated
 * image in the render function.
 * @author Crecen
 */
public class PixAnimate {
    public int BASE = 32;

    private ImgLibrary storedImg;
    private ArrayList<Integer> buildColors;
    private ArrayList<Integer> unitColors;
    private HashMap<Short, Integer> imgMap;
    private AnimStore[] animParts;

    public PixAnimate(){
        storedImg = new ImgLibrary();
        buildColors = new ArrayList<Integer>();
        unitColors = new ArrayList<Integer>();
        animParts = new AnimStore[0];
        imgMap = new HashMap<Short, Integer>();
        ImgDataParser.init();
    }

    public void addBuildingChange(String filePath){
        buildColors = colorChange(filePath);
    }

    public void addUnitChange(String filePath){
        unitColors = colorChange(filePath);
    }

    public void addPreferredItem(String code, String type){
        ImgDataParser.addForceType(code, type);
    }

    public void loadData(){
        ImgDataParser.decodeFiles();
        
    }

    public void addImgPart(String name, int player, int direction,
            int locx, int locy){
        int nameItem = -1;
        byte[] anim = new byte[0];
        for(int i = 0; i < ImgDataParser.getData().size(); i++){
            ImgData data = ImgDataParser.getData().get(i);
            if(data.group.matches(name) && data.direction == direction){
                nameItem = i;
                anim = new byte[data.animRef.size()];
                for(int j = 0; j < anim.length; j++)
                    anim[j] = data.animRef.get(j);
                break;
            }
        }
        if(nameItem == -1)  return;
        AnimStore item = new AnimStore(nameItem, player, direction,
                anim, locx, locy);
        makeNewImage(nameItem, player, direction);
        AnimStore[] temp = animParts;
        animParts = new AnimStore[temp.length+1];
        for(int i = 0; i < temp.length; i++)
            animParts[i] = temp[i];
        animParts[animParts.length-1] = item;

    }

    //Checks to see if a certain image exists, if not, it adds it to
    //the list of the ImgLibrary
    public void update(int animTime){
    }
    public void render(Graphics g, int animTime){
        for(int i = 0; i < animParts.length; i++){
            if(animParts[i].getSize() != 1)
                g.drawImage(storedImg.getSlickImage(imgMap.get(
                    animParts[i].getAnimation(animTime))),
                    animParts[i].posx, animParts[i].posy);
            else
                g.drawImage(storedImg.getSlickImage(imgMap.get(
                    animParts[i].getAnimation(0))),
                    animParts[i].posx, animParts[i].posy);
        }	
    }
    //We need a lot for this class, and it is the most important class.
    //1) ImgLibrary, to store the images.
    //2) Some way to get the time. Each image will use the FileIndex size
    //to see how fast an image needs to be displayed, and if it needs to
    //be displayed
    //3) All images will be displayed as MovingPix, to make animating them
    //a lot easier to swallow. Though I am unsure about memory.
    //4) A render function (and possibly an update function if needed)
    //It will try and draw within the bounds of the screen only.
    //5) When I make the map class, I'll deal with screen shakes

    private ArrayList<Integer> colorChange(String filePath){
        ArrayList<Integer> newColors = new ArrayList<Integer>();
        ImgLibrary temp = new ImgLibrary();
        temp.addImage(filePath);
        int[] tempColors = temp.getPixels(0);
        for(int i = 0; i < tempColors.length/(temp.getX(0)*2); i++){
            for(int j = 1; j < (temp.getX(0)-1); j++)
                newColors.add(new Color(tempColors[
                        (i*temp.getX(0)*2)+temp.getX(0)+j]).getRGB());
        }
        return newColors;
    }

    private void makeNewImage(int index, int player, int direction){
        short store = (short)((index*10000+player*100+direction)*100);
        if(imgMap.containsKey(store))       return;

        ImgLibrary parseImg = new ImgLibrary();
        ImgData data = ImgDataParser.getData().get(index);
        for(int i = 0; i < data.imgFileRef.size(); i++){
            ImgFile file = data.imgFileRef.get(i);
            parseImg.addImage(0, file.filename);
            if(file.flipEdit != 0){
                if(file.flipEdit == 1 || file.flipEdit == 4 ||
                        file.flipEdit == 5 || file.flipEdit == 7)
                    storedImg.setRotateNinety();
                if(file.flipEdit == 2 || file.flipEdit == 4 ||
                        file.flipEdit == 6 || file.flipEdit == 7)
                    storedImg.setFlipX();
                if(file.flipEdit == 3 || file.flipEdit == 5 ||
                        file.flipEdit == 6 || file.flipEdit == 7)
                    storedImg.setFlipY();
            }
            for(int j = 0; j < data.dfltColors.size(); j++){
                if(data.code == data.UNIT &&
                        j+data.dfltColors.size()*player < unitColors.size()){
                    storedImg.setPixelChange(
                        new Color(data.dfltColors.get(j)),
                        new Color(unitColors.get(
                        j+data.dfltColors.size()*player).intValue()));
            
                }
            }
            storedImg.setImageSize(
                (int)(file.sizex*(BASE/(double)file.sizex)*file.tilex),
                (int)(file.sizey*(BASE/(double)file.sizex)*file.tiley));
            imgMap.put((short)(store+i), storedImg.length());
            storedImg.addImage(parseImg.getImage(0, file.locx, file.locy,
                file.sizex, file.sizey));
        }
    }


}
