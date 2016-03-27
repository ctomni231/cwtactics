class CommandInterpreterFactory {
  static create() {
    var buffer = new PrioritizedBuffer(new Buffer(), new Buffer());
    var register = new CommandRegister();
    return new CommandInterpreter(buffer, register);
  }
}

class CommandRegister {

  constructor() {
    this.handlers = {};
  }

  registerHandler(commandkey, handler) {
    var keyCode = Utility.convertStringToHash(commandkey);

    Require.isNothing(this.handlers[keyCode]);
    this.handlers[keyCode] = handler;
  }

  getHandlerByKey(key) {
    return this.getHandlerByCode(Utility.convertStringToHash(key));
  }

  getHandlerByCode(code) {
    return Require.isSomething(this.handlers[code + ""]);
  }
}

class CommandInterpreter {

  constructor(buffer, register) {
    this.buffer = Require.InstanceOf(buffer, Buffer);
    this.register = Require.InstanceOf(register, CommandRegister);
  }

  pushCommand(commandkey, p1, p2, p3, p4, p5) {
    this.buffer.pushItem([Utility.convertStringToHash(commandkey), p1, p2, p3, p4, p5], false);
  }

  pushImportantCommand() {
    this.buffer.pushItem([Utility.convertStringToHash(commandkey), p1, p2, p3, p4, p5], true);
  }

  hasCommands() {
    return this.buffer.hasItems();
  }

  evaluateNext() {
    Require.isTrue(hasCommands());
    var data = this.buffer.popItem();
    this.register.getHandlerByCode(data[0])(data[1], data[2], data[3], data[4], data[5]);
  }
}
