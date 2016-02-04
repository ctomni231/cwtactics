gameServices.synchronTest("base", "test_a", function () {
  assert(1 == 2);
});

gameServices.synchronTest("base", "test_b", function () {
  assert(2 == 2);
});
