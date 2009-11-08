package com.client.menu.GUI.tools;

import com.client.model.loading.ImgData;
import com.client.model.loading.ImgDataParser;
import com.client.model.loading.ImgFile;
import com.client.tools.ImgLibrary;
import java.awt.Color;
import java.util.ArrayList;
import org.newdawn.slick.Graphics;

/**
 * This class makes ImgData worth while by turning its data into
 * animated pictures. All you need to know is the name of the
 * picture and the location, and it'll give an updated animated
 * image in the render function.
 * @author Crecen
 */
public class PixAnimate {
    public int BASE = 16;

    private ImgLibrary storedImg;
    private ArrayList<Integer> buildColors;
    private ArrayList<Integer> unitColors;
    private ArrayList<MovingPix> animParts;
    private String[] animStr;

    public PixAnimate(){
        storedImg = new ImgLibrary();
        buildColors = new ArrayList<Integer>();
        unitColors = new ArrayList<Integer>();
        animParts = new ArrayList<MovingPix>();
        animStr = new String[0];
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
        String anim = "";
        MovingPix item = new MovingPix(locx, locy, 0);
        for(int i = 0; i < ImgDataParser.getData().size(); i++){
            ImgData data = ImgDataParser.getData().get(i);
            if(data.group.matches(name) && data.direction == direction){
                nameItem = i;
                for(byte animPart: data.animRef)
                    anim += ":"+animPart;
                break;
            }
        }
        if(nameItem == -1)  return;
        makeNewImage(nameItem, player, direction);
        item.setText(""+nameItem+":"+player+":"+direction+""+anim);
        animParts.add(item);
    }

    //Checks to see if a certain image exists, if not, it adds it to
    //the list of the ImgLibrary
    public void update(int animTime){
        for(MovingPix item: animParts){
            
        }
    }
    public void render(Graphics g, int animTime){
        for(MovingPix item: animParts){
            animStr = item.logoTxt.split(":");
            if(animStr.length > 4){
                int time = (int)(animTime/(1000/(animStr.length-3)));
                //Keeps neutral steady if uncommented
                if(time < 0) //|| animStr[1].matches("0"))
                    time = 0;
                else if(time >= animStr.length-3)
                    time = animStr.length-4;
                g.drawImage(storedImg.getSlickImage(""+animStr[0]+"_"
                        +animStr[1]+"_"+animStr[2]+"_"+animStr[(3+time)]),
                        (int)item.posx, (int)item.posy);
            }else
                g.drawImage(storedImg.getSlickImage(
                        ""+animStr[0]+"_"+animStr[1]+"_"+animStr[2]+"_0"),
                        (int)item.posx, (int)item.posy);
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
        if(storedImg.getIndex(""+index+"_"+player+"_"+direction+"_0") != -1)
            return;

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
            storedImg.addImage(""+index+"_"+player+"_"+direction+"_"+i+"",
                parseImg.getImage(0, file.locx, file.locy,
                file.sizex, file.sizey));
        }
    }


}
