@Typed
package cwt_repo_tapsi.model.map

/**
 * Abstract map object, provides support of variations for the graphic engine.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 30.10.2010 
 */
class MapObject
{
	int variation
	int id
	
	/**
	 * Sets the variation id number of this object.
	 * 
	 * @param variation must be greater equals zero
	 */
	@Override
	void setVariation( int variation )
	{
		assert variation >= 0
		
		this.variation = variation
	}
}
