@Typed
package cwt.factory.fog

import cwt.model.map.Tile
import cwt.model.Unit

/**
 * A set of tags, that describes why a unit is not visible.
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
enum InvinsibleReason
{
	INVINSIBLE,
	MARKED,
	HIDDEN	
}

/**
 * Fog module, used by the fog factory, to produce the visible / unvisible status of an unit.
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
interface FogModule
{
	boolean isVisible( Tile tile )
	boolean isVisible( Unit unit )
}
