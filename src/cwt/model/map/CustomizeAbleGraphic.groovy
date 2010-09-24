@Typed
package cwt.model.map

/**
 * Abstract map object, provides support of variations for the graphic engine.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 1
 * @changelog <UL>
 *            <LI>v1
 *            <UL>
 *            <LI>initial version</LI>
 *            </UL>
 *            </LI>
 *            </UL>
 */
class CustomizeAbleGraphic
{
	byte variation
	
	@Override
	void setVariation( byte variation )
	{
		assert variation >= 0
		
		this.variation = variation
	}
}
