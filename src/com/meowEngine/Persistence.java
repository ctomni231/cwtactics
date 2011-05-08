package com.meowEngine;

import java.io.File;
import com.yasl.annotation.ParentModulePointer;
import com.yasl.annotation.InCompleteModul;
import com.yasl.annotation.SubModule;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 07.05.2011
 */
@InCompleteModul
@SubModule("com.meowEngine.Engine")
public class Persistence
{
	@ParentModulePointer
	private Engine engine;

	private PersitenceStrategy strategy;

	public Persistence( Engine engine )
	{
		notNull(engine);
		
		this.engine = engine;
	}

	public void setStrategy( PersitenceStrategy strategy )
	{
		notNull(strategy);

		this.strategy = strategy;
	}

	public void saveContextToFile( String fileName )
	{
		
	}

	public void loadContextFromFile( String fileName )
	{
		
	}
}
