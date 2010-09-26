@Typed
package cwt_repo_tapsi.structures

import java.util.ArrayList;

/**
 * Thread safe List which provides LIFO and LIFO support.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class ConcurrentModificationList <T> 
{
	/**
	 * List modification strategies.
	 */
	enum Strategy
   	{
	  LIFO,FIFO
   	}
	
	private ArrayList<T> list
	
	ConcurrentModificationList() 
	{
		list = new ArrayList<T>()
	}
	
	
	/**
	 * Inserts an object into the list.
	 * 
	 * @param obj object instance
	 */
	synchronized void insert( T obj , Strategy strategy ) 
	{
		assert obj
		assert strategy
		
		switch ( strategy ) {
			case Strategy.LIFO:
				list.add obj
				break
			
			case Strategy.FIFO:
				list.add 0, obj
				break
		}
	}
	
	
	/**
	 * Has the list any commands in itself ?
	 */
	synchronized boolean isEmpty() 
	{
		return list.isEmpty();
	}
	
	
	/**
	 * Returns the next object from list.
	 * 
	 * @return object instance from list
	 */
	synchronized T pop( Strategy strategy ) 
	{
		assert !isEmpty()
		assert strategy
		
		def obj, n
		switch ( strategy ) 
		{
			case Strategy.LIFO:
				n = 0
				break
			
			case Strategy.FIFO:
				n = list.size() - 1 
				break
		}

		obj = list.get(n) 
		list.remove n 
		
		return obj;
	}
	
}
