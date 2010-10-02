@Typed
package cwt_repo_tapsi.logic

import cwt_repo_tapsi.model.map.Map;
import cwt_repo_tapsi.model.map.Player;
import cwt_repo_tapsi.model.Turn;
import java.util.LinkedList;

@Singleton
class GameService
{
	static final int MAX_PLAYER = 8
	
	Turn turn
	Map map
	Player[] playerFlow
	
	GameService()
	{
		setPlayerFlow new Player[MAX_PLAYER]
	}
	
	@Override
	void setPlayerFlow( Player[] playerFlow )
	{
		assert playerFlow
		
		this.playerFlow = playerFlow	
	}
}
