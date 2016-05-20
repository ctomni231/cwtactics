var TOOLTIP_TIMEOUT = 5000;

cwt.loadingState = {

  _initTips() {
    this.tips = [];
    this.events.subscribe("game:loadtype:tips", data => this.tips = data);
    this.tipTimer = this.generateTimer(TOOLTIP_TIMEOUT, () => this.log.info("TIP: " + this.tips[parseInt(Math.random() * this.tips.length, 10)]));
  },

  enter() {
    this.doneLoading = false;

    var fileToDataRequestor = (file) => {
      var type = file.substring(0, file.indexOf("."));
      var path = cwt.MOD_PATH + "/" + file;

      return (cbDone, cbFail) => {
        this.requestData(path, (data) => {
          this.log.info("grabbed data from path " + path);
          this.events.publish("game:loadtype:" + type, data);
          cbDone();
        }, cbFail);
      };
    };

    this._initTips();

    this.serial(
      ["tips.json", "tiles.json", "units.json", "movetypes.json", "weathers.json"].map(fileToDataRequestor),
      () => this.doneLoading = true,
      (error) => this.log.error(error)
    );
  },

  update(delta, input) {
    this.tipTimer.tick(delta);
    if (this.doneLoading && input.isActionPressed("ACTION")) {
      this.log.info("completed data loading");
      this.events.publish("game:construct");
      return "MAINMENU";
    }
    return;
  },

  render(delta) {

  }
};