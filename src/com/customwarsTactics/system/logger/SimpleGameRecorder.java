package com.customwarsTactics.system.logger;

//import com.sun.xml.internal.bind.v2.runtime.RuntimeUtil.ToStringAdapter;
import com.customwarsTactics.system.commandPipeline.CommandPoolListener;
import java.util.Vector;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public class SimpleGameRecorder implements CommandPoolListener
{
    public static final int START_SIZE = 50;
	public static final int INCREAMENT_SIZE = 20;

	private Vector<String> messageStack;

    public SimpleGameRecorder()
	{
		messageStack = new Vector<String>( START_SIZE , INCREAMENT_SIZE );
	}

    /**
     * Called if a command is pushed in the communication pipeline, this
     * recorder will save this command.
     */
	@Override
    public void messagePushed(String message)
    {
        assert message != null;

		messageStack.add(message);
    }

	@Override
    public void messagePopped(String message){}

    /**
	 * Returns the number of messages, that are in this recorder.
	 */
	public int getNumOfMessages()
	{
		return messageStack.size();
	}

	/**
	 * Returns the message at a given index.
	 *
	 * @param index index number
	 * @return message string
	 */
	public String getMessage( int index )
	{
		assert index >= 0 && index < messageStack.size();

		return messageStack.get(index);
	}

	/**
	 * Removes all saved commands from the command recorder.
	 */
	public void clearRecorder()
	{
		messageStack.removeAllElements();
	}

    @Override
    public String toString()
    {
        return new StringBuilder("game recorder, recorded commands:")
                        .append( getNumOfMessages() ).toString();
    }

}
