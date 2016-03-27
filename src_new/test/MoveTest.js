QUnit.module("move");
QUnit.test("path", function(assert) {
  var path;

  path = new Path();

  path.right();
  path.right();
  path.right();

  assert.equals(path.size(), 3);

  path = new Path();
  path.right();
  path.down();
  path.left();
  path.up();

  assert.equals(path.size(), 0);

  path = new Path();
  path.right();
  path.right();
  path.left();

  assert.equals(path.size(), 1);
});

QUnit.test("directly", function(assert) {

  var unit = new Unit();
  unit.position.x = 2;
  unit.position.y = 2;

  var map = new Map();
  var path = new Path();
  path.right();
  path.right();
  path.right();

  var moving = new UnitMover(map);
  moving.move(unit, path);

  assert.equals(unit.position.x, 5);
  assert.equals(unit.position.y, 2);
});