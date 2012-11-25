package com.cwt.game;

/**
 * ObjectSorter.java
 *
 * This class extends the functionality of ObjectStorage.java
 * by using helper variables to shrink the options of the 
 * contained object list. It helps you find the best possible
 * images for the object list given for each category.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.24.12
 */
public class ObjectSorter extends ObjectStorage{

	/** The points given for connections */
	public final int CONNECT_POINTS = 1;
	/** The points given for overlap */
	public final int OVERLAP_POINTS = 10;
	/** The points given for army */
	public final int ARMY_POINTS = 100;
	/** The points given for base name */
	public final int BASE_POINTS = 1000;
	
	/** The code attribute preferred */
	//private int code;
	/** The name attribute preferred */
	private String name;
	/** The base attribute preferred */
	private String base;
	/** The type attribute preferred */
	private String type;
	/** The weather attribute preferred */
	private int weather;
	/** The army faction attribute preferred */
	private String army;	
	/** The overlap attribute preferred */
	private String overlap;
	/** The connection attribute preferred */
	private String connection;
	
	/**
	 * This class extends the functionality of ObjectStorage by
	 * allowing attributes to be entered to condense the list
	 * of eligible object items further 
	 */
	public ObjectSorter(){
		super();
		reset();
	}
	
	/**
	 * This function changes the preferred code attribute
	 * @param newCode The preferred code attribute
	 */
	//public void changeCode(int newCode){
	//	code = newCode;
	//}
	
	/**
	 * This function changes the preferred code attribute
	 * @param newName The preferred code attribute
	 */
	public void changeName(String newName){
		name = newName;
		if(base.isEmpty())
			base = newName;
	}
	
	/**
	 * This function changes the preferred base attribute
	 * @param newBase The preferred base attribute
	 */
	public void changeBase(String newBase){
		base = newBase;
	}
	
	/**
	 * This function changes the preferred type attribute
	 * @param newType The preferred type attribute
	 */
	public void changeType(String newType){
		type = newType;
	}
	
	/**
	 * This function changes the preferred weather attribute
	 * @param newWeather The preferred weather attribute
	 */
	public void changeWeather(int newWeather){
		weather = newWeather;
	}
	
	/**
	 * This function changes the preferred army attribute
	 * @param newArmy The preferred army attribute
	 */
	public void changeArmy(String newArmy){
		army = newArmy;
	}
	
	/**
	 * This function changes the preferred connection attribute
	 * @param newConnect The preferred connection attribute
	 */
	public void changeConnection(String newConnect){
		connection = newConnect;
	}	
	
	/**
	 * This function resets all attributes to default values
	 */
	public void reset(){
		//code = -1;
		name = "";
		base = "";
		type = "";
		weather = -1;
		army = "";
		overlap = "";
		connection = "NNNNNNNN";
	}
	
	/**
	 * This function looks for an index that best matches the current
	 * attributes within the list of objects stored
	 * @param codeType The code type of the objects to search for
	 * @return The best match within the object list
	 */
	public int getBestIndex(int codeType){
		int[] itemList = getList(codeType);
		if(codeType == TERRAIN)
			return getBestTerrain(itemList);
		return -1;
	}
	
	/**
	 * This function gets the best terrain index for the current
	 * attributes within the list of objects stored
	 * @param list A shortened list of only terrain image objects
	 * @return The best index match for a terrain using the current criteria
	 */
	private int getBestTerrain(int[] list){
		int bestMatch = -1;//The index containing the best match
		int points = -1;//The number of points for a single element
		int best = -1;//The number of points for the best match
		for(int i = 0; i < list.length; i++){
			points = 0;
			if(!name.matches("") && name.matches(getName(objList[list[i]].getData(NAME))))
				points += BASE_POINTS;
			else if(!base.matches("") && base.matches(getName(objList[list[i]].getData(BASE))))
				points += BASE_POINTS;
			if(!type.matches("") && type.matches(getType(objList[list[i]].getData(TYPE))))
				points += BASE_POINTS;
			if(weather == objList[list[i]].getData(WEATHER))
				points += ARMY_POINTS;
			if(!army.matches("") && army.matches(getArmy(objList[list[i]].getData(ARMY))))
				points += ARMY_POINTS;
			if(!overlap.matches("") && overlap.matches(getName(objList[list[i]].getData(OVERLAP))))
				points += OVERLAP_POINTS;
			points += matchConnections(objList[list[i]].getData(CONNECTION));
			if(points > best){
				best = points;
				bestMatch = list[i];
			}
		}
		return bestMatch;
	}
	
	/**
	 * This function is an extension of the best terrain to help decide
	 * point matching for the connections.
	 * @param index The index of the object connection
	 * @return The number of points for connection matching
	 */
	private int matchConnections(int index){
		char[] current = new char[8];
		char[] storage = new char[8];
		char[] tempcur = getConnection(index).toCharArray();
		char[] tempstore = connection.toCharArray();
		int points = 0;
		for(int i = 0; i < 8; i++){
			current[i] = tempcur.length < i ? tempcur[i] : 'N';
			storage[i] = tempstore.length < i ? tempstore[i] : 'N';
			if(current[i] == storage[i] && current[i] != 'N')
				points += CONNECT_POINTS;
			else if(current[i] != storage[i] && storage[i] != 'N')
				points -= CONNECT_POINTS;
		}
		return points;
	}
	
	/**
     * This function is used to return a list constrained by the codeType
     * @param codeType The code type representation
     * @return A list constrained to that specific code type
     */
    private int[] getList(int codeType){
    	int[] temp = new int[0];
    	for(int i = 0; i < objList.length; i++){
    		if(objList[i].getData(CODE) == codeType)
    			temp = addData(temp, i);
    	}
    	return temp;
    }
	
	 /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private int[] addData(int[] fillData, int data){
        if(fillData == null)
            fillData = new int[0];

        int[] temp = fillData;
        fillData = new int[temp.length+1];
        for(int i = -1; i++ < temp.length-1;)
            fillData[i] = temp[i];
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
