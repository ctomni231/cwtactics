package com.cwt.game.tools;

/**
 * BasicArray.java
 *
 * This is a small class that was made to make it easier to create
 * Object arrays. It is pretty much obsolete as doing static calls to
 * Objects in an array is impossible for generic classes.  
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.23.12
 */
public class BasicArray<T extends Object> {

	/** Holds the temporary array for the Objects */
	private transient Object[] list;

	/**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    @SuppressWarnings("unchecked")
	public T[] addData(T[] fillData, T data){
    	list = fillData;
    	
        if(list == null)
            list = new Object[0];

        Object[] temp = list;
        list = new Object[temp.length+1];
        System.arraycopy(temp, 0, list, 0, temp.length);
        list[list.length-1] = data;

        return (T[]) list;
    }
}
