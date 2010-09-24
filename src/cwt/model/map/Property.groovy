@Typed
package cwt.model.map

import cwt.model.Player;

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
