var idleState = new meow.state.State()

idleState.update = function()
{
	if( meow.input.isPressed("action") )
	{
		// check unit menu
		if( true )
		{

		}
		// else main menu
		else
		{
			meow.state.setState("MAIN_MENU")
		}
	}
	else if( meow.input.isPressed("cancel") )
	{
		// check unit
	}
}

meow.state.add("idle", idleState)