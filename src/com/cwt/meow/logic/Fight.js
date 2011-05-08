cwt.fightCtr =
{
	battleCard :
	{
		attacker		: null,
		defender		: null,
		damage			: 0,
		counterDamage	: 0
	},

	prepareBattle : function( attacker , defender )
	{
		this.battleCard.attacker = attacker;
		this.battleCard.defender = defender;

		meow.triggerCtr.invokeEvent( Fight_Event , null);
	},

	invokeBattle : function()
	{

	}

}