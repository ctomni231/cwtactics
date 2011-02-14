package com.cwt.map.io;

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
 * @version 01.31.11
 */
public class RefStore{

    private HashMap<String, Integer> ref;//Holds the reference String data
    private ListStore list;//Holds the wild card reference data

    /**
     * This class uses a HashMap and a List to store String values for
     * reference purposes.
     */
    public RefStore(){
        ref = new HashMap<String, Integer>();
        list = new ListStore();
    }

    /**
     * This function adds a new reference to the list
     * @param key The String reference to add
     * @param index The index this reference refers to
     */
    public void add(String key, int index){
        key = key.toUpperCase();
        if(key.matches(".*[.].*"))
            list.add(key);
        ref.put(key, index);
    }

    /**
     * This function adds a group of new references to the list
     * @param keys The String references to add
     * @param index The index these references refer to
     */
    public void add(String[] keys, int index){
        for(String key: keys)
            add(key, index);
    }

    /**
     * This function checks to see if a reference exists
     * @param key The key value to check
     * @return If the key exists(T) or not(F)
     */
    public boolean exists(String key){
        key = key.toUpperCase();
        for(int i = 0; i < list.size(); i++){
            if(key.matches(list.getData(i)))
                return true;
        }
        return ref.containsKey(key);
    }

    /**
     * This retrieves a value from a key
     * @param key The key to retrieve the value from in the array
     * @return A value from the array representing the key
     */
    public int get(String key){
        key = key.toUpperCase();
        for(int i = 0; i < list.size(); i++){
            if(key.matches(list.getData(i)))
                return ref.get(list.getData(i));
        }
        return (ref.containsKey(key)) ? ref.get(key) : -1;
    }

    /**
     * Gets how many value references are within this reference list
     * @return The size of this reference list
     */
    public int size(){
        return ref.values().size();
    }
}
