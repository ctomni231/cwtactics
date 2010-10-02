@Typed
package cwt_repo_tapsi.model.map


class Property extends Tile
{
	int capturePoints
	Player owner
	
	@Override
	void setOwner( Player owner )
	{
		assert this.owner != owner : "new owner cant be the same as the old owner"
		
		this.owner = owner
	}
	
	@Override
	void setCapturePoints( int points )
	{
		assert points >= 0
		
		this.capturePoints = points
	}
}
