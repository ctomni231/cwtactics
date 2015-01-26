package net.wolfTec.wtEngine.utility;

import net.wolfTec.cwt.Constants;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class MoveableMatrix {
	
	private int centerX;
	private int centerY;
	private Array<Array<Integer>> data;
	
	@SuppressWarnings("unchecked")
  public MoveableMatrix(int sideLength) {
		data = JSCollections.$array();
		for (int i = 0; i < sideLength; i++) {
	    data.push(JSCollections.$array());
	    for (int j = 0; j < sideLength; j++) {
	    	data.$get(i).$set(j, Constants.INACTIVE_ID);
	    }
    }
	}
	
	public int getCenterX() {
		return centerX;
	}
	
	public int getCenterY(){
		return centerY;
	}
	
	public void setCenter(int centerx, int centery, int defaultValue){
		
	}
	
	public int getValue(int x, int y){
		return 0;
	}
	
	public void setValue(int x, int y, int value){
	}
}
