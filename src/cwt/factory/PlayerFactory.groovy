@Typed
package cwt.factory

import cwt.model.Player;
import cwt.model.Team;

class PlayerFactory
{
	void createPlayer( Team team )
	{
		assert team 
		
		def pl = new Player( team )
		team.addMember()
	}
	
	void destroyPlayer( Player player )
	{
		assert player
		
		player.team.removeMember()
	}
}
