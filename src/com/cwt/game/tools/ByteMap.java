package com.cwt.game.tools;

/**
 * ByteMap.java
 *
 * This class deals with organizing the I/O of data into a
 * compact format using integer. Also tried to keep it compact so
 * bit data doesn't flow into other classes.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.13.11
 */

public class ByteMap {

    /** The amount of data to be stored */
    public final int MAX_DATA = 4;
    /** An array that organizes the data */
    private byte[] data;

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
     * This function stores data into 2 bytes that will be later stored into
     * a byte array in unsigned integer format
     * @param index The index to store the byte into
     * @param value The value of this particular byte
     */
    public void addShort(int index, int value){
        if(value < 0 || value > 65534)
            value = 0;
        if(index >= 0 && index < MAX_DATA-1){            
            addByte(index, value/256);
            addByte(index+1, value%256);
        }
    }

    /**
     * This function stores data into bytes that will be later stored into
     * a byte array in unsigned integer format
     * @param index The index to store the byte into
     * @param value The value of this particular byte
     */
    public void addByte(int index, int value){
        if(value < 0 || value > 255)
            value = 0;
        if(index >= 0 && index < MAX_DATA)
            data[index] = (byte)(value-128);
    }

    /**
     * This function stores data into bytes that will be later stored into
     * a byte array in unsigned integer format
     * @param index The index to store the byte into
     * @param leftVal The value of the left bit
     * @param rightVal The value of the right bit
     */
    public void addByte(int index, int leftVal, int rightVal){
        if(leftVal < 0 || leftVal > 15)
            leftVal = 0;
        if(rightVal < 0 || rightVal > 15)
            rightVal = 0;
        addByte(index, (leftVal*16)+rightVal);
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
     * @return A integer containing the byte data
     */
    public int getCompact(){
        return (((data[0] & 0xFF) << 24) | ((data[1] & 0xFF) << 16) |
                ((data[2] & 0xFF) << 8) | (data[3] & 0xFF));
    }

    /**
     * This function gets bytes in unsigned short format from an integer
     * @param index The beginning array portion of byte code to retrieve
     * @param compact The integer to extract the byte data from
     * @return An unsigned integer representing the byte
     */
    public int getShort(int index, int compact){
        return ((getByte(index, compact)*256)+getByte(index+1, compact));
    }

    /**
     * This function gets bytes in unsigned integer format from an integer
     * @param index The array portion of byte code to retrieve
     * @param compact The integer to extract the byte data from
     * @return An unsigned integer representing the byte
     */
    public int getByte(int index, int compact){
        return (int)(getByteData(index, compact)+128);
    }

    /**
     * This function gets the bit value for a unsigned byte.
     * @param index The array portion of byte code to retrieve
     * @param compact The integer to extract the bit data from
     * @param left Gets the left(T) or right(F) value of the bit
     * @return An unsigned bit number with the specified conditions
     */
    public int getBit(int index, int compact, boolean left){
        return (int)(getBitData(getByte(index, compact), left)+8);
    }

    /**
     * This function gets bytes from a integer
     * @param value The integer to extract the byte data from
     * @param index The portion of byte code to retrieve from the long
     * @return An unsigned integer representing the byte
     */
    private byte getByteData(int index, int value){
        switch(index){
            case 0:
                return (byte)((value & 0xFF000000) >>> 24);
            case 1:
                return (byte)((value & 0x00FF0000) >>> 16);
            case 2:
                return (byte)((value & 0x0000FF00) >>> 8);
            case 3:
                return (byte)((value & 0x000000FF));
        }
        return 0;
    }

    /**
     * This function gets the bit value for a unsigned byte.
     * @param value The value of the unsigned byte (0-255)
     * @param left Gets the left(T) or right(F) value of the bit
     * @return A bit number with the specified conditions
     */
    private byte getBitData(int value, boolean left){
        if(value < 0 && value > 255)
            value = 0;
        return left ? (byte)(((value-128) & 0x000000F0) >>> 4) :
            (byte)((value-128) & 0x0000000F);
    }
}
