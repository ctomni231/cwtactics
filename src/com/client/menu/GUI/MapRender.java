package com.client.menu.GUI;

import com.client.menu.GUI.tools.MovingPix;
import com.client.menu.GUI.tools.PixAnimate;
import org.newdawn.slick.Graphics;

/**
 * Beginning preparations for the new engine.
 * @author Crecen
 */
public class MapRender extends MovingPix{
    
    private MapItem[][] drawMap;
    private int mapsy;
    private int mapsx;

    public MapRender(int msx, int msy, int locx, int locy, double speed){
        super(locx, locy, speed);
        resizeMap(msx, msy);
    }

    public void resizeMap(int sx, int sy){
        mapsx = (sx < 0) ? 0 : sx;
        mapsy = (sy < 0) ? 0 : sy;
        drawMap = new MapItem[mapsx][mapsy];
        for(int i = 0; i < mapsx; i++){
            for(int j = 0; j < mapsy; j++)
                drawMap[i][j] = new MapItem();
        }
    }

    public void render(Graphics g, int animTime){
    }
}
