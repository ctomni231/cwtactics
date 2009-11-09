package com.client.menu.GUI.tools;

/**
 * A small class used to help store animations and help with speed
 * @author Crecen
 */
public class AnimStore {
    private short imgData;
    private byte[] animate;

    public int owner;
    public int posx;
    public int posy;

    public AnimStore(int index, int player, int direction, byte[] anim,
            int locx, int locy){
        imgData = (short)(index*10000+player*100+direction);
        owner = player;
        animate = anim;
        posx = locx;
        posy = locy;
        if(animate == null)
            animate = new byte[0];
    }

    public int getSize(){
        return animate.length;
    }

    public short getAnimation(int index){
        if(index >= animate.length) index = animate.length-1;
        else if(index < 0)
            index = 0;
        return (short)((imgData*100)+(int)animate[index]);
    }

}
