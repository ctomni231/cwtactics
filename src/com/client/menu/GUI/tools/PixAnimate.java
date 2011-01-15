package com.client.menu.GUI.tools;

import com.system.data.ImgData;
import com.system.data.ImgDataParser;
import com.system.data.ImgFile;
import com.system.log.Logger;
import com.cwt.system.jslix.tools.ImgLibrary;
import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import org.newdawn.slick.Image;

/**
 * This class makes ImgData worth while by turning its data into
 * animated pictures. All you need to know is the name of the
 * picture and the location, and it'll give an updated animated
 * image in the render function.
 * @author Crecen
 */
public class PixAnimate {
    private static final int BASE = 32;

    private static ImgLibrary storedImg;
    private static ArrayList<Integer> buildColors;
    private static ArrayList<Integer> unitColors;
    private static HashMap<Short, Integer> imgMap;
    private static ImgDataParser imgData;
    private static double scale;

    public PixAnimate(){
        init();
    }

    public static void init(){
        storedImg = new ImgLibrary();
        buildColors = new ArrayList<Integer>();
        unitColors = new ArrayList<Integer>();
        scale = 1.0;
        imgMap = new HashMap<Short, Integer>();
        imgData = new ImgDataParser();
    }

    public static void addBuildingChange(String filePath){
        buildColors = colorChange(filePath);
    }

    public static void addUnitChange(String filePath){
        unitColors = colorChange(filePath);
    }

    public static void addPreferredItem(String code, String type){
        imgData.addForceType(code, type);
    }

    public static void clearData(){
        imgData.clearData();
    }

    public static void loadData(){
        imgData.decode();
    }

    public static boolean isReady(){
        return imgData.isReady();
    }

    public static ArrayList<String> getTypes(){
        return imgData.getTypes();
    }

    public static ArrayList<ImgData> getData(){
        return imgData.getData();
    }

    public static void changeScale(int tileBase){
        if(tileBase > 0)
            scale = (double)tileBase/BASE;
        imgMap.clear();
    }

    public static double getScale(){
        return scale;
    }

    public static ImgData getData(String name){
        for(int i = 0; i < imgData.getData().size(); i++){
            ImgData data = imgData.getData().get(i);
            if(name.matches(data.group+".*"))
                return data;
        }
        return null;
    }

    public static int getDataLocation(String name){
        for(int i = 0; i < imgData.getData().size(); i++){
            ImgData data = imgData.getData().get(i);
            if(name.matches(data.group+".*"))
                return i;
        }
        return -1;
    }

    public static AnimStore getBuildPart(String name,
            int player, int direction){
        for(int i = 0; i < imgData.getData().size(); i++){
            ImgData build = imgData.getData().get(i);
            if(name.matches(build.group+".*") &&
                    build.code == build.PROPERTY){
                for(String temp: build.tags){
                    if(temp.matches("OT:.*"))
                        return getTagPart(temp.substring(3), player, direction);
                }
            }
        }
        return getImgPart(name, player, direction);
    }

    public static AnimStore getImgPart(String name, int player, int direction){
        int nameItem = -1;
        byte[] anim = new byte[0];
        for(int i = 0; i < imgData.getData().size(); i++){
            ImgData data = imgData.getData().get(i);
            if(name.matches(data.group+".*") && data.direction == direction){
                nameItem = i;
                anim = new byte[data.animRef.size()];
                for(int j = 0; j < anim.length; j++)
                    anim[j] = data.animRef.get(j);
                break;
            }
        }
        if(nameItem == -1)  return null;
        return new AnimStore(nameItem, player, direction,
                anim, 0, 0);
    }

    public static AnimStore getImgPart(int index, int player, int direction){
        if(index < 0 || index >= imgData.getData().size())
            return null;
        ImgData data = imgData.getData().get(index);
        byte[] anim = new byte[data.animRef.size()];
        for(int j = 0; j < anim.length; j++)
                    anim[j] = data.animRef.get(j);
        return new AnimStore(index, player, direction, anim, 0, 0);
    }

    public static java.awt.Image getJavaImg(AnimStore item, int animTime){
        return storedImg.getImage(imgMap.get(
                item.getAnimation(animTime)));
    }

    public static Image getImage(AnimStore item, int animTime){
        return storedImg.getSlickImage(imgMap.get(
                item.getAnimation(animTime)));
    }

    public static void makeNewImage(AnimStore item){
        if(item != null)    makeNewImage(item.ind, item.owner, item.dir);
    }

    private static AnimStore getTagPart(String tag, int player, int direction){
        for(int i = 0; i < imgData.getData().size(); i++){
            ImgData data = imgData.getData().get(i);
            for(String temp: data.tags){
                if(temp.substring(2).matches(tag))
                    return getImgPart(data.name, player, direction);
            }
        }
        return null;
    }

    private static ArrayList<Integer> colorChange(String filePath){
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


    private static void makeNewImage(int index, int player, int direction){
        short store = (short)((index*10000+player*100+direction)*100);
        if(imgMap.containsKey(store))       return;

        ImgLibrary parseImg = new ImgLibrary();
        ImgData data = imgData.getData().get(index);
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
                if((data.code == data.UNIT || data.code == data.ARROW) &&
                        j+data.dfltColors.size()*player < unitColors.size()){
                    storedImg.setPixelChange(
                        new Color(data.dfltColors.get(j)),
                        new Color(unitColors.get(
                        j+data.dfltColors.size()*player).intValue()));
                }else if(data.code == data.PROPERTY &&
                        j+data.dfltColors.size()*player < buildColors.size()){
                    storedImg.setPixelChange(
                        new Color(data.dfltColors.get(j)),
                        new Color(buildColors.get(
                        j+data.dfltColors.size()*player).intValue()));
                }
            }
            if((data.code == data.UNIT || data.code == data.PROPERTY)
                    && data.ignrColors.size() != 0){
                storedImg.setPixelBlend(new Color(unitColors.get(
                    2+data.dfltColors.size()*player).intValue()));
                for(int ignore: data.ignrColors)
                    storedImg.setPixelIgnore(new Color(ignore));
            }
            storedImg.setImageSize(
                (int)(file.sizex*(BASE/(double)file.sizex)*file.tilex*scale),
                (int)(file.sizey*(BASE/(double)file.sizex)*file.tiley*scale));
            imgMap.put((short)(store+i), storedImg.length());
            storedImg.addImage(parseImg.getImage(0, file.locx, file.locy,
                file.sizex, file.sizey));
        }
    }
}
