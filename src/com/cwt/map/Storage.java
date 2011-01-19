package com.cwt.map;

import java.util.HashMap;

/**
 * Storage.java
 *
 * This interface is used to keep all the storage classes holding and
 * distributing data the exact same way. Also so I won't forget how to
 * add these files in case we'll need more in the future.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.19.11
 */
public interface Storage {

    /**
     * This function is used to gather the data given from the item storage
     * classes. It'll give one hash map with all the given data for that
     * section 
     * @param fillData THe HashMap containing the data for one section
     * @return The integer index where this data is stored
     */
    public int addItem(HashMap<String, String> fillData);
}
