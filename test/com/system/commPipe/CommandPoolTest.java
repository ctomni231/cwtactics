package com.system.commPipe;

import com.customwarsTactics.system.commandPipeline.CommandPool;
import org.junit.Test;
import static org.junit.Assert.*;
import static com.customwarsTactics.system.commandPipeline.CommandPool.*;

public class CommandPoolTest {
    
    @Test
    public void testPool()
	{
		CommandPool pool = new CommandPool();

		pool.pushCommand( "C1" , LOW_PRIORITY );
		pool.pushCommand( "C2" , LOW_PRIORITY );
		pool.pushCommand( "C3" , HIGH_PRIORITY );
		pool.pushCommand( "C4" , CRITICAL_PRIORITY );
		pool.pushCommand( "C5" , CRITICAL_PRIORITY );
		pool.pushCommand( "C6" , LOW_PRIORITY );

        assertEquals( pool.toString() , "CommandPool Size is 6");

		assertFalse( pool.isEmpty() );

		assertTrue( pool.popCommand().equals("C4") );
		assertTrue( pool.popCommand().equals("C5") );
		assertTrue( pool.popCommand().equals("C3") );
		assertTrue( pool.popCommand().equals("C1") );
		assertTrue( pool.popCommand().equals("C2") );
		assertTrue( pool.popCommand().equals("C6") );

        assertEquals( pool.toString() , "CommandPool Size is 0");

		assertTrue( pool.isEmpty());

        try
        {
            // pool is empty, must fail here
            pool.popCommand();

            throw new AssertionError("an assertion error wasn't thrown");
        }
        catch( UnsupportedOperationException e ){}
	}

}