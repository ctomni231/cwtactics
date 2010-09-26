@Typed
package cwt_repo_tapsi.states

/**
 * Abstract state class. Used by the state controller to 
 * control the flow of the logic. State classes are designed 
 * to control and modify mainly the model and logic.
 * Any game play actions, and user interactions should be 
 * handled in state classes.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 25.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
abstract class State
{
	abstract void update( int timePassed )
}
