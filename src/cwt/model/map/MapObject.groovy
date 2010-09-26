@Typed
package cwt.model.map

/**
 * Abstract map object, provides support of variations for the graphic engine.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 25.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class MapObject
{
	byte variation
	
	/**
	 * Sets the variation id number of this object.
	 * 
	 * @param variation must be greater equals zero
	 */
	@Override
	void setVariation( byte variation )
	{
		assert variation >= 0
		
		this.variation = variation
	}
}
