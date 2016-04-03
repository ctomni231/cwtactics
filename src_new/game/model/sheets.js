class SheetDatabase {
  constructor(sheetParser) {
    this.sheets = {};
    this.names = [];
    this.sheetParser = Require.isSomething(sheetParser);
  }

  registerSheet(data) {
    Require.isSomething(data);
    Require.isTrue(data.id.length === 4);

    var sheet = {};

    sheet.id = Require.isString(data.id);

    cwt.log_info("registering object type with id " + data.id);
    Require.isNothing(this.sheets[data.id]);

    this.sheets[data.id] = sheet;
    this.names.push(data.id);

    this.sheetParser(sheet, data);

    return sheet;
  }

  getRandomSheet() {
    return this.sheets[this.names[parseInt(Math.random() * this.names.length, 10)]];
  }

  getSheet(id) {
    return Require.isSomething(this.sheets[id]);
  }

  isValidId(id) {
    return Types.isSomething(this.sheets[id]);
  }
}

class TargetList {

  constructor(list) {
    this.targets = Require.isArray(list);
  }

  containsId(target) {
    return this.targets.indexOf(target) !== -1;
  }

  containsSheet(sheet) {
    return this.containsId(Require.isString(sheet.id));
  }
}
