@Typed
package cwt_repo_tapsi.model

import cwt_repo_tapsi.model.map.Player;

/**
 * Turn instance.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 02.10.2010
 */
class Turn
{
	Player activePlayer
	
	void startTurn( Player player )
	{
		assert player
		assert activePlayer != player : "next turn owner can't be the same as the previous turn owner"											
		
		// TODO check effects
										
		// set active player
		activePlayer player
	}
	
	void endTurn( Player player )
	{
		// TODO effects
	}
	
	void nextTurn()
	{
		//TODO
		
		endTurn activePlayer
		// activePlayer(...)
	}
	
	@Override
	String toString()
	{
		"TURN :: Active player [$activePlayer]"
	}
}
