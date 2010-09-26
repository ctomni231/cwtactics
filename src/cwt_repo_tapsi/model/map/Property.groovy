@Typed
package cwt_repo_tapsi.model.map

import cwt_repo_tapsi.model.Player;

class Property extends Tile
{
	byte capturePoints
	Player owner
	
	@Override
	void setOwner( Player owner )
	{
		assert owner
		assert this.owner != owner : "new owner cant be the same as the old owner"
		
		this.owner = owner
	}
	
	@Override
	void setCapturePoints( byte points )
	{
		assert points >= 0
		
		this.capturePoints = points
	}
}
