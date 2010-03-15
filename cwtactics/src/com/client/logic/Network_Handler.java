package com.client.logic;

import com.system.meowShell.Handler;
import com.system.meowShell.Method_Database;

public class Network_Handler extends Handler {

	@Override
	public Object callMethod( String key , Object[] parameter ){
		if( Method_Database.getReturn(key) == null ){
			//TODO implement MessageServer code here!
			return null; 
		}
		else{
			return Method_Database.callMethod(key, parameter);
		}
	}
	
}
