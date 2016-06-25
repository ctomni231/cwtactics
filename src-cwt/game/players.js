// () -> PlayerModel
cwt.playerFactory = () => ({
  name: "Player",
  team: -1,
  money: 0
});

// (playerModel, playerModel) -> Boolean
cwt.areOnSameTeam = (playerA, playerB) => playerA.team === playerB.team;

// ([PlayerModel]) -> Boolean
cwt.thereAreAtLeastTwoOppositeTeams = (players) => players.reduce((result, player) => result =
  (player.team == -1 ? result :
    (result == -1 ? player.team :
      (result != player.team ? -2 : result))), -1) == -2;
