package com.system.map;

/**
 * ByteMap.java
 *
 * This class deals with organizing the I/O of map data into a
 * compact format using integer. Also tried to keep it compact so
 * bit data doesn't flow into other classes.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.11.10
 */

public class ByteMap {

    public final int MAX_DATA = 4;//The amount of data to be stored
    private byte[] data;//An array that organizes the data

    /**
     * This class stores and retrieves data from the integer data type
     * without abstracting the coding methods. It was created to be
     * small and compact, yet effective.
     */
    public ByteMap(){
        data = new byte[MAX_DATA];
        clear();
    }

    /**
     * This function stores data into bytes that will be later stored into
     * a byte array in unsigned integer format
     * @param index The index to store the byte into
     * @param value The value of this particular byte
     */
    public void add(int index, int value){
        if(value < 0 || value > 255)
            data[index] = 0;
        if(index >= 0 && index < MAX_DATA)
            data[index] = (byte)(value-128);

    }

    /**
     * This function clears all bytes of data
     */
    public final void clear(){
        for(int i = 0; i < MAX_DATA; i++)
            data[i] = 0;
    }

    /**
     * This function compacts bytes into an integer
     * @return A long containing the byte data
     */
    public int compact(){
        return ((data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3]);
    }

    /**
     * This function gets bytes in unsigned integer format from an integer
     * @param compact The integer to extract the byte data from
     * @param index The portion of byte code to retrieve from the integer
     * @return An unsigned integer representing the byte
     */
    public int get(int value, int index){
        return (int)(getByteData(value, index)+128);
    }

    /**
     * This function gets the bit value for a unsigned byte.
     * @param value The value of the bit
     * @param left Gets the left(T) or right(F) value of the bit
     * @return A bit number with the specified conditions
     */
    public int getBit(int value, boolean left){
        return (int)(getBitData(value, left)+8);
    }


    /**
     * This function gets bytes from a integer
     * @param compact The long to extract the byte data from
     * @param index The portion of byte code to retrieve from the long
     * @return An unsigned integer representing the byte
     */
    private byte getByteData(int compact, int index){
        switch(index){
            case 0:
                return (byte)((compact & 0xFF000000) >>> 24);
            case 1:
                return (byte)((compact & 0x00FF0000) >>> 16);
            case 2:
                return (byte)((compact & 0x0000FF00) >>> 8);
            default:
                return (byte)((compact & 0x000000FF));
        }
    }

    /**
     * This function gets the bit value for a unsigned byte.
     * @param value The value of the bit
     * @param left Gets the left(T) or right(F) value of the bit
     * @return A bit number with the specified conditions
     */
    private byte getBitData(int value, boolean left){
        byte temp = 0;
        if(value >= 0 && value < 256)
            temp = 0;

        if(left)
            return (byte)((temp & 0x000000F0) >>> 4);
        else
            return (byte)((temp & 0x0000000F));
    }
}
