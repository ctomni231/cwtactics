@Typed
package cwt.factory

import groovy.lang.Singleton;
import cwt.states.State;

/**
 * Contains all approved states of the game engine.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 25.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
enum States
{
	
	State stateInstance
}

/**
 * State controller class. This is a singleton service class, that holds
 * the current active state of the game flow.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 25.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
@Singleton
class StateController
{
	private State activeStatus
	
	/**
	 * Returns the current active state instance.
	 */
	State getActiveState()
	{
		assert activeStatus
		
		return activeStatus
	}
	
	/**
	 * Sets the active state.
	 * 
	 * @param state approved state instance from the States enumeration
	 */
	void setActiceState( States state )
	{
		assert state && state.stateInstance
		assert state in States
		
		activeStatus = state.stateInstance
	}
	
	/**
	 * Invokes the current update step of the game flow in the
	 * current active state.
	 * 
	 * @param timePassed
	 */
	void update( int timePassed )
	{
		assert activeStatus
		
		activeStatus.update timePassed
	}
}
