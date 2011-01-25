package com.cwt.map;

import java.util.HashMap;

/**
 * RefStore.java
 *
 * This class stores String values into reference numbers. It was created
 * to imitate the system of both the FileStorage and TagStorage classes. 
 * It is used to easily get the type of data within a XML file regardless
 * of which key is used.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 01.25.11
 * @todo TODO Under construction: Finish the references
 */
public class RefStore {

    private HashMap<String, Integer> ref;
    private ListStore list;

    public RefStore(){
        ref = new HashMap<String, Integer>();
    }

    public void add(String key, int index){

        //References have to be stored in 2 ways
        //.* = This wild card will be stored in ListStore. It'll use the
        //wild card to check for matches. It will be stored in the hashmap
        //as a normal string
        //"" = Normal strings will only be stored in the hashmap.
    }
}
