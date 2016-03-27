QUnit.module("game construction");
QUnit.test("hasCommands", function(assert) {

});

QUnit.module("battle controller");
QUnit.test("xxx", function(assert) {
  var attackerId = 0;
  var defenderId = 1;
  var playerHandler = mock(PlayerHandler);
  var unitHandler = mock(UnitHandler);

  var battle = new BattleHandler(playerHandler, unitHandler);

  battle.startBattle(attackerId, defenderId);

  assert.equals(attacker.hp, 85);
  assert.equals(defenderId.hp, 55);
});