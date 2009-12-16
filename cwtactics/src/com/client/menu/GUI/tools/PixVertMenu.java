package com.client.menu.GUI.tools;

import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.Image;

/**
 *
 * @author Crecen
 */
public class PixVertMenu extends PixMenu{
    private int spacingY;
    private int maxItems;
    private int itemMax;
    private int itemMin;

    private ArrayList<Integer> vertParts;
    private ArrayList<Integer> vertIndex;
    private int arrowSpacing;
    private int arrowSpace;

    private Image arrowUp;
    private Image arrowDown;
    private boolean start;

    public PixVertMenu(int locx, int locy, int spacing, double speed){
        super(locx, locy, speed);
        globalOpac = 0.5;
        vertParts = new ArrayList<Integer>();
        vertIndex = new ArrayList<Integer>();
        arrowUp = null;
        arrowDown = null;
        spacingY = spacing;
        maxItems = 1;
        itemMax = maxItems-1;
        itemMin = 0;
        arrowSpacing = 0;
        arrowSpace = 0;
        start = true;
    }

    //Make sure you create a new item or items might overlap each other
    public void addVertPart(int select, boolean selectable){
        addVertPart(select, 0, 0, selectable);
    }
    public void addVertPart(int select, int sizex, int sizey,
            boolean selectable){
        int chng = menuItems.size();
        super.addMenuPart(select, sizex, sizey, selectable);
        super.setItemPosition(chng, 0,
                (int)(select*spacingY), true);
        vertParts.add(chng);

        boolean addSelect = true;
        for(int ind: vertIndex){
            addSelect = (select != vertParts.get(ind));
            if(addSelect) break;
        }
        if(addSelect)   vertIndex.add(select);
    }

    public void addVertRound(int select, Color theColor,
            int sizex, int sizey, int arc, boolean selectable){
        int chng = menuItems.size();
        super.addRoundBox(select, theColor, sizex, sizey, arc, selectable);
        super.setItemPosition(chng, 0,
                (int)(select*spacingY), true);
        vertParts.add(chng);
    }

    public void addVertBox(int select, Color theColor,
            int sizex, int sizey, boolean selectable){
        int chng = menuItems.size();
        super.addBox(select, theColor, sizex, sizey, selectable);
        super.setItemPosition(chng, 0,
                (int)(select*spacingY), true);
        vertParts.add(chng);
    }

    public void clearAllVertParts(){
        this.clearAllItems();
        vertParts.clear();
        vertIndex.clear();
        select = 0;
    }

    public void setMaxItems(int number){
        if(number > 0){
            maxItems = number;
            itemMax = maxItems-1;
            itemMin = 0;
        }
    }

    public int getMaxItems(){
        return maxItems;
    }

    public void setArrow(Image arrUp){
        if(arrUp != null){
            arrowUp = arrUp;
            arrowUp.setName("UP");
            arrowDown = arrUp.getFlippedCopy(false, true);
            arrowDown.setName("DOWN");
            arrowSpacing = arrUp.getWidth();
            arrowSpace = arrowSpacing;
        }
    }

    public void setJustify(double locx, char justify){
        double lx;
        for(int index: vertParts){            
            lx = locx;
            lx += fposx;
            arrowSpace = (int)lx+arrowSpacing;
            
            if(menuItems.get(index).logoPic != null){
                if(justify == 'r' || justify == 'R'){
                    arrowSpace = (int)lx+(arrowSpacing*-1);
                    lx -= menuItems.get(index).logoPic.getWidth();
                    
                }
                else if(justify == 'c' || justify == 'C'){
                    arrowSpace = (int)lx-(arrowSpacing/2);
                    lx -= (menuItems.get(index).logoPic.getWidth()/2);
                }
            }
            if(menuItems.get(index).index == 0)
                super.setItemPosition(index, (int)lx,
                        (int)menuItems.get(index).fposy);
        }

    }

    public String getItemText(){
        return getItemText(select);
    }

    public int getIndexSize(){
        return vertIndex.size();
    }

    @Override
    public void render(Graphics g){
        super.render(g);
        if(vertIndex.size() > maxItems){
            updateList();
            if(itemMin > 0 && arrowUp != null){
                if(globalOpac >= 0 && globalOpac <= 1)
                    arrowUp.setAlpha((float)globalOpac);
                g.drawImage(arrowUp, (float)(posx+arrowSpace),
                    (float)(posy-spacingY));
            }
            if(itemMax+1 < vertIndex.size() && arrowDown != null){
                if(globalOpac >= 0 && globalOpac <= 1)
                    arrowDown.setAlpha((float)globalOpac);
                g.drawImage(arrowDown, (float)(posx+arrowSpace),
                    (float)(posy+(spacingY*maxItems)));
            }
        }
    }

    private void updateList(){
        int change = 0;
        while(select > itemMax){
            itemMax++;
            itemMin++;
            change++;
        }
        while(select < itemMin){
            itemMax--;
            itemMin--;
            change--;
        }
      
        if(change != 0) updateParts(change);
        if(start) updateParts();
    }

    private void updateParts(int change){
        for(int index: vertParts){
            super.setItemPosition(index, 0, -(change*spacingY), true);
            super.setItemDraw(index,
                    (menuItems.get(index).select >= itemMin &&
                menuItems.get(index).select <= itemMax));
        }
    }
    private void updateParts(){
        for(int index: vertParts){
            super.setItemDraw(index,
                    (menuItems.get(index).select >= itemMin &&
                menuItems.get(index).select <= itemMax));
        }
        start = false;
    }

    public void mouseScroll(int mx, int my){
        if(itemMin > 0 && my > posy-spacingY && my < posy)
            select--;
        if(itemMax+1 < vertIndex.size() && my > posy+(spacingY*maxItems) &&
                my < posy+(spacingY*maxItems)+spacingY)
            select++;
    }
}
