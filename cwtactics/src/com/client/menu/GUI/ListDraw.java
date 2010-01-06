package com.client.menu.GUI;

import com.client.menu.GUI.tools.PixVertMenu;
import org.newdawn.slick.Color;

/**
 *
 * @author Crecen
 */
public class ListDraw {
    public PixVertMenu selectBox;
    public PixVertMenu items;

    public ListDraw(int maxItems, int spacing,
            int locx, int locy, double speed){
        selectBox = new PixVertMenu(locx, locy, spacing, speed);
        items = new PixVertMenu(locx, locy, spacing, speed);
    }

    public void init(){
        selectBox.createNewItem(0, 0, 0);
        selectBox.addVertBox(0,
                new Color(Color.darkGray.getRed(),
                Color.darkGray.getGreen(), Color.darkGray.getBlue(),
                127), 200, 20, true);
    }

}
