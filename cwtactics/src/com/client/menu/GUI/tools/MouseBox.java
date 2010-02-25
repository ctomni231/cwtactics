package com.client.menu.GUI.tools;

/**
 * This class is only for holding 4 variables that help to speed up
 * the graphics engine.
 * @author Crecen
 */
public class MouseBox {
    private short[] data;

    public MouseBox(){
        clearData();
    }

    public void clearData(){
        data = new short[4];
    }

    public void setData(int locx, int locy, int sizex, int sizey){
        data[0] = (short)locx;
        data[1] = (short)locy;
        data[2] = (short)(locx+sizex);
        data[3] = (short)(locy+sizey);
    }

    public int getData(int index){
        if(index >= 0 && index < data.length)
            return data[index];
        return -1;
    }
}
