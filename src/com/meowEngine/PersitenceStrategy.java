package com.meowEngine;

import org.mozilla.javascript.ScriptableObject;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 08.05.2011
 */
public abstract class PersitenceStrategy
{
	public abstract ScriptableObject[] getTargetObjects( ScriptableObject rootNode );
}
