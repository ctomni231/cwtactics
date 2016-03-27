QUnit.module("command interpreter");
QUnit.test("hasCommands", function(assert) {

  var mockedBuffer = new Buffer();
  var interpreter = new CommandInterpreter(mockedBuffer);

  mockedBuffer.hasItems = () => false;
  assert.notOk(interpreter.hasCommands());

  mockedBuffer.hasItems = () => true;
  assert.ok(interpreter.hasCommands());
});