cwt.data.cards =
{
	TransportCard :  Class.$extend({
		max : 0,
		loaded : new Array()
	}),

	BattleCard : Class.$extend({
		attacker : null,
		defender : null,
		attackDmg : 0,
		counterDmg : 0
	})
}