cwt.test_synchron("model-round", "round to day conversion", function () {
  cwt.assert_equals(model.round_daysToTurns(4), 4 * MAX_PLAYER);
});
