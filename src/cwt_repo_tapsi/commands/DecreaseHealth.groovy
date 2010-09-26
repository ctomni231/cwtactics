@Typed
package cwt_repo_tapsi.commands

class DecreaseHealth extends ChangeHealth
{
	
	@Override 
	void setHealth( short health )
	{
		this.health = -health
	}
}
