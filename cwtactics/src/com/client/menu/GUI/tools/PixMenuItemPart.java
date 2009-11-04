package com.client.menu.GUI.tools;

import org.newdawn.slick.Color;
import org.newdawn.slick.Image;

/**
 * This helps organize pictures for the MenuPart
 *
 * @author Crecen
 */

public class PixMenuItemPart {
    public Image img;
    public String text;
    public double opacity;
    public Color color;

    public PixMenuItemPart(){
        img = null;
        text = "";
        opacity = -1;
        color = null;
    }
}
