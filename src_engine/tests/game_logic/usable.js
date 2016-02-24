cwt.test_synchron("game-logic/usable", "create_context", function() {
  var ctx_a, ctx_b;

  ctx_a = cwt.usable_create_context();
  ctx_b = cwt.usable_create_context();

  cwt.assert_true(cwt.type_is_not_null(ctx_a));
  cwt.assert_true(cwt.type_is_not_null(ctx_b));

  cwt.assert_not_equals(ctx_a, ctx_b);
});

cwt.test_synchron("game-logic/usable", "is_usable", function() {
  var ctx, TURN_OWNER = 0;

  ctx = cwt.usable_create_context();
  cwt.list_for_each(ctx, function(element, index) {

    cwt.usable_make_usable(ctx, TURN_OWNER, index);
    cwt.assert_true(cwt.usable_is_usable(ctx, TURN_OWNER, index));

    cwt.usable_make_unusable(ctx, TURN_OWNER, index);
    cwt.assert_true(!cwt.usable_is_usable(ctx, TURN_OWNER, index));
  });
});

cwt.test_synchron("game-logic/usable", "make_all_usable", function() {
  var ctx, TURN_OWNER = 0;

  ctx = cwt.usable_create_context();

  cwt.usable_make_all_usable(ctx);
  cwt.list_for_each(ctx, function(element, index) {

    cwt.assert_true(cwt.usable_is_usable(ctx, TURN_OWNER, index));
  });
});