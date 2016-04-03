class TileDBFactory {
  static create() {
    return new SheetDatabase((sheet, data) => {
      sheet.defense = Require.isInteger(data.defense);
      sheet.blocksVision = !!data.blocksVision;
      sheet.capturePoints = Types.isInteger(data.capturePoints) ? data.capturePoints : -1;
      sheet.looseAfterCaptured = !!data.looseAfterCaptured;
      sheet.changeAfterCaptured = !!data.changeAfterCaptured;
      sheet.notTransferable = !!data.notTransferable;
      sheet.funds = Types.isInteger(data.funds) ? data.funds : 0;
      sheet.vision = Types.isInteger(data.vision) ? data.vision : 0;
      sheet.supply = new TargetList(data.supply || []);
      sheet.repairs = new TargetList(data.repairs || []);
    });
  }
}
